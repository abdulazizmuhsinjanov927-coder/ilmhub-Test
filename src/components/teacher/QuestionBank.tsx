import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Copy,
  Edit2,
  Image as ImageIcon,
  CheckCircle,
  X,
  Check,
  ChevronDown
} from 'lucide-react';
import { Question, QuestionType, QuestionDifficulty, User } from '../../types';
import { StorageService, subscribeToStore } from '../../services/storage';

interface QuestionBankProps {
  currentUser: User;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ currentUser }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Question Creation/Editing Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [questionText, setQuestionText] = useState('');
  const [qType, setQType] = useState<QuestionType>('single_choice');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [score, setScore] = useState(2);
  const [explanation, setExplanation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [passageText, setPassageText] = useState('');
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: 'opt_1', text: '' },
    { id: 'opt_2', text: '' },
    { id: 'opt_3', text: '' },
    { id: 'opt_4', text: '' }
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<any>('opt_1');

  const loadData = () => {
    setQuestions(StorageService.getQuestions());
  };

  useEffect(() => {
    loadData();
    return subscribeToStore(loadData);
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setQuestionText('');
    setQType('single_choice');
    setDifficulty('medium');
    setScore(2);
    setExplanation('');
    setImageUrl('');
    setPassageText('');
    setOptions([
      { id: 'opt_1', text: '' },
      { id: 'opt_2', text: '' },
      { id: 'opt_3', text: '' },
      { id: 'opt_4', text: '' }
    ]);
    setCorrectAnswer('opt_1');
    setShowModal(true);
  };

  const openEditModal = (q: Question) => {
    setEditingId(q.id);
    setQuestionText(q.questionText);
    setQType(q.type);
    setDifficulty(q.difficulty);
    setScore(q.score);
    setExplanation(q.explanation || '');
    setImageUrl(q.imageUrl || '');
    setPassageText(q.passageText || '');
    setOptions(q.options && q.options.length > 0 ? q.options : [
      { id: 'opt_1', text: '' },
      { id: 'opt_2', text: '' },
      { id: 'opt_3', text: '' },
      { id: 'opt_4', text: '' }
    ]);
    setCorrectAnswer(q.correctAnswer);
    setShowModal(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (editingId) {
      const existing = questions.find(q => q.id === editingId);
      if (existing) {
        StorageService.updateQuestion({
          ...existing,
          questionText: questionText.trim(),
          type: qType,
          difficulty,
          score: Number(score),
          explanation: explanation.trim(),
          imageUrl: imageUrl.trim() || undefined,
          passageText: passageText.trim() || undefined,
          options,
          correctAnswer
        });
      }
    } else {
      StorageService.createQuestion({
        teacherId: currentUser.id,
        questionText: questionText.trim(),
        type: qType,
        difficulty,
        score: Number(score),
        explanation: explanation.trim(),
        imageUrl: imageUrl.trim() || undefined,
        passageText: passageText.trim() || undefined,
        tags: ['General'],
        options,
        correctAnswer
      });
    }

    setShowModal(false);
  };

  const handleDuplicate = (id: string) => {
    StorageService.duplicateQuestion(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ushbu savolni o\'chirishni xohlaysizmi?')) {
      StorageService.deleteQuestion(id);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || q.type === typeFilter;
    return matchesSearch && matchesDiff && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            Savollar Banki ({questions.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Barcha 8 turdagi savollarni saqlash, nusxalash va testlarga random tanlash imkoniyati.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yangi savol qo'shish
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Savol matni bo'yicha qidirish..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="all">Barcha qiyinlik</option>
            <option value="easy">Oson</option>
            <option value="medium">O'rta</option>
            <option value="hard">Qiyin</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="all">Barcha savol turlari</option>
            <option value="single_choice">Bitta to'g'ri javob</option>
            <option value="true_false">True / False</option>
            <option value="multiple_choice">Bir nechta javob</option>
            <option value="image_question">Rasm asosida</option>
            <option value="text_question">Matn asosida (Reading)</option>
            <option value="short_answer">Qisqa javob</option>
            <option value="numeric_answer">Sonli javob</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            Savollar topilmadi. Yangi savol qo'shing yoki filtrni tozalang.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      #{idx + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                      q.difficulty === 'easy'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : q.difficulty === 'hard'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {q.difficulty === 'easy' ? 'Oson' : q.difficulty === 'hard' ? 'Qiyin' : "O'rta"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {q.type} • {q.score} ball
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(q.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Nusxa olish"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(q)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="font-semibold text-sm text-slate-900 dark:text-white">
                  {q.questionText}
                </div>

                {/* Options display */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-2">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isCorrect = q.correctAnswer === opt.id || (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt.id));
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
                            isCorrect
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 font-semibold text-emerald-900 dark:text-emerald-200'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {letter}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingId ? 'Savolni tahrirlash' : 'Yangi savol yaratish'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Savol turi
                  </label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="single_choice">Bitta to'g'ri javob</option>
                    <option value="true_false">True / False</option>
                    <option value="multiple_choice">Bir nechta javob</option>
                    <option value="image_question">Rasm asosida</option>
                    <option value="text_question">Matn asosida</option>
                    <option value="short_answer">Qisqa javob</option>
                    <option value="numeric_answer">Sonli javob</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Qiyinlik darajasi
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="easy">Oson</option>
                    <option value="medium">O'rta</option>
                    <option value="hard">Qiyin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ball (Score)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Savol matni *
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Savolni aniq va tushunarli yozing..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Rasm URL (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rasm havolasi (URL - ixtiyoriy)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/diagram.png"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              {/* Options */}
              {(qType === 'single_choice' || qType === 'multiple_choice' || qType === 'image_question') && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Variantlar va to'g'ri javobni tanlash
                  </label>
                  {options.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isCorrect = correctAnswer === opt.id;
                    return (
                      <div key={opt.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(opt.id)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                          }`}
                        >
                          {isCorrect ? <Check className="w-4 h-4" /> : letter}
                        </button>
                        <input
                          type="text"
                          required
                          value={opt.text}
                          onChange={(e) => {
                            const next = [...options];
                            next[oIdx].text = e.target.value;
                            setOptions(next);
                          }}
                          placeholder={`${letter} varianti matni...`}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Short / Numeric answers */}
              {qType === 'short_answer' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    To'g'ri javob (so'z yoki ibora)
                  </label>
                  <input
                    type="text"
                    required
                    value={correctAnswer || ''}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="Masalan: better"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              )}

              {qType === 'numeric_answer' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    To'g'ri sonli qiymat
                  </label>
                  <input
                    type="number"
                    required
                    value={correctAnswer || ''}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="Masalan: 14"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              )}

              {/* Explanation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Izoh (Test tugagandan keyin o'quvchiga ko'rsatiladigan tushuntirish)
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Nima uchun bu javob to'g'riligi haqida qisqacha izoh..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  Saqlash
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

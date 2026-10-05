import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Copy,
  Trash2,
  Save,
  Check,
  X,
  Settings,
  Clock,
  Shuffle,
  Eye,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Test, Question, Group, Book, User, TestStatus } from '../../types';
import { StorageService, subscribeToStore } from '../../services/storage';

interface TestEditorProps {
  currentUser: User;
  onOpenWordImport?: () => void;
  onSelectTestAnalytics?: (test: Test) => void;
}

export const TestEditor: React.FC<TestEditorProps> = ({
  currentUser,
  onOpenWordImport,
  onSelectTestAnalytics
}) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [bookId, setBookId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [passingPercentage, setPassingPercentage] = useState(70);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);
  const [showResultsImmediately, setShowResultsImmediately] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);
  const [status, setStatus] = useState<TestStatus>('active');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const loadData = () => {
    setTests(StorageService.getTests());
    setGroups(StorageService.getGroups());
    setBooks(StorageService.getBooks());
    setQuestions(StorageService.getQuestions());
  };

  useEffect(() => {
    loadData();
    return subscribeToStore(loadData);
  }, []);

  const openCreateModal = () => {
    setEditingTestId(null);
    setTitle('');
    setDescription('');
    setSelectedGroupIds(groups.length > 0 ? [groups[0].id] : []);
    setBookId(books.length > 0 ? books[0].id : '');
    setDurationMinutes(25);
    setMaxAttempts(1);
    setPassingPercentage(70);
    setRandomizeQuestions(true);
    setRandomizeOptions(true);
    setShowResultsImmediately(true);
    setShowCorrectAnswers(true);
    setShowExplanations(true);
    setStatus('active');
    setSelectedQuestionIds(questions.slice(0, 5).map(q => q.id));
    setShowModal(true);
  };

  const openEditModal = (t: Test) => {
    setEditingTestId(t.id);
    setTitle(t.title);
    setDescription(t.description);
    setSelectedGroupIds(t.groupIds || []);
    setBookId(t.bookId || '');
    setDurationMinutes(t.durationMinutes);
    setMaxAttempts(t.maxAttempts);
    setPassingPercentage(t.passingPercentage);
    setRandomizeQuestions(t.randomizeQuestions);
    setRandomizeOptions(t.randomizeOptions);
    setShowResultsImmediately(t.showResultsImmediately);
    setShowCorrectAnswers(t.showCorrectAnswers);
    setShowExplanations(t.showExplanations);
    setStatus(t.status);
    setSelectedQuestionIds(t.questionIds || []);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenQuestions = questions.filter(q => selectedQuestionIds.includes(q.id));
    const maxScore = chosenQuestions.reduce((acc, q) => acc + (q.score || 1), 0);

    if (editingTestId) {
      const existing = tests.find(t => t.id === editingTestId);
      if (existing) {
        StorageService.updateTest({
          ...existing,
          title: title.trim(),
          description: description.trim(),
          groupIds: selectedGroupIds,
          bookId: bookId || undefined,
          durationMinutes: Number(durationMinutes),
          maxAttempts: Number(maxAttempts),
          passingPercentage: Number(passingPercentage),
          maxScore: maxScore || 10,
          randomizeQuestions,
          randomizeOptions,
          showResultsImmediately,
          showCorrectAnswers,
          showExplanations,
          status,
          questionIds: selectedQuestionIds
        });
      }
    } else {
      StorageService.createTest({
        teacherId: currentUser.id,
        teacherName: `${currentUser.firstName} ${currentUser.lastName}`,
        title: title.trim(),
        description: description.trim(),
        groupIds: selectedGroupIds,
        bookId: bookId || undefined,
        durationMinutes: Number(durationMinutes),
        maxAttempts: Number(maxAttempts),
        passingPercentage: Number(passingPercentage),
        maxScore: maxScore || 10,
        randomizeQuestions,
        randomizeOptions,
        showResultsImmediately,
        showCorrectAnswers,
        showExplanations,
        status,
        questionIds: selectedQuestionIds
      });
    }

    setShowModal(false);
  };

  const handleDuplicate = (id: string) => {
    StorageService.duplicateTest(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ushbu testni o\'chirishni xohlaysizmi?')) {
      StorageService.deleteTest(id);
    }
  };

  const toggleQuestionSelection = (qId: string) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== qId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, qId]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            Testlar Boshqaruvi ({tests.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Talab #8: Yangi test yaratish, savollar randomizatsiyasi, nusxa olish va guruhlarga ochish.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenWordImport && (
            <button
              onClick={onOpenWordImport}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Word import
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Yangi test yaratish
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tests.map((test) => {
          const testGroups = groups.filter(g => test.groupIds?.includes(g.id));

          return (
            <div
              key={test.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    test.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : test.status === 'draft'
                      ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {test.status}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(test.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Nusxa olish (Duplicate)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(test)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Tahrirlash"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>
                </div>

                {/* Groups pills */}
                <div className="flex flex-wrap gap-1">
                  {testGroups.map(g => (
                    <span key={g.id} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {g.name}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{test.durationMinutes} daqiqa</span>
                  </div>
                  <div>O'tish: <strong>{test.passingPercentage}%</strong></div>
                  <div>Savollar: <strong>{test.questionIds.length} ta</strong></div>
                  <div>Urinishlar: <strong>{test.maxAttempts} ta</strong></div>
                </div>
              </div>

              {/* Bottom Analytics Trigger */}
              {onSelectTestAnalytics && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onSelectTestAnalytics(test)}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                  >
                    Batafsil Analitika & Qayta topshirish
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Test Creation & Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingTestId ? 'Testni tahrirlash' : 'Yangi test yaratish'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Test nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Unit 3-4 Oraliq Nazorat Testi"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Holati
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TestStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="active">Ochiq (Active)</option>
                    <option value="draft">Qoralama (Draft)</option>
                    <option value="scheduled">Rejalashtirilgan</option>
                    <option value="closed">Yopilgan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Test sinovi bo'yicha ko'rsatma..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              {/* Group & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vaqt (daqiqa)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Urinishlar soni
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    O'tish foizi (%)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={passingPercentage}
                    onChange={(e) => setPassingPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              {/* Group Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Test biriktiriladigan guruhlar
                </label>
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => {
                    const isSelected = selectedGroupIds.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) setSelectedGroupIds(selectedGroupIds.filter(id => id !== g.id));
                          else setSelectedGroupIds([...selectedGroupIds, g.id]);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {g.name} ({g.code})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Randomization & Results Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">Random savollar</span>
                    <span className="text-slate-400">Har bir o'quvchiga savollar aralashtirib beriladi</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeOptions}
                    onChange={(e) => setRandomizeOptions(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">Random variantlar</span>
                    <span className="text-slate-400">A/B/C/D variantlar ketma-ketligi tasodifiy bo'ladi</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCorrectAnswers}
                    onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">To'g'ri javoblarni ko'rsatish</span>
                    <span className="text-slate-400">Test yakunlangach to'g'ri javoblar ko'rinadi</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showExplanations}
                    onChange={(e) => setShowExplanations(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">Izohlarni ko'rsatish</span>
                    <span className="text-slate-400">Savol tagidagi tushuntirish beriladi</span>
                  </div>
                </label>
              </div>

              {/* Select Questions from Bank */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Savollar bankidan tanlash ({selectedQuestionIds.length} ta tanlandi)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedQuestionIds.length === questions.length) setSelectedQuestionIds([]);
                      else setSelectedQuestionIds(questions.map(q => q.id));
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {selectedQuestionIds.length === questions.length ? 'Barchasini bekor qilish' : 'Barchasini tanlash'}
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 bg-slate-50 dark:bg-slate-800/50">
                  {questions.map((q) => {
                    const isChecked = selectedQuestionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => toggleQuestionSelection(q.id)}
                        className="p-2 flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-indigo-600"
                        />
                        <div className="flex-1 text-xs">
                          <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                            {q.questionText}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {q.type} • {q.score} ball • {q.difficulty}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  Testni saqlash
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

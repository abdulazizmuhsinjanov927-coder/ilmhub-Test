import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Save,
  Trash2,
  Check,
  Plus,
  Download
} from 'lucide-react';
import { parseDocxFile, parseRawQuestionsText, formatRawMessyText } from '../../services/wordParser';
import { exportQuestionsTemplateToExcel } from '../../services/excelService';
import { StorageService } from '../../services/storage';
import { ParsedQuestionItem, QuestionDifficulty } from '../../types';

interface WordImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (importedCount: number) => void;
}

export const WordImportModal: React.FC<WordImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'preview'>('upload');
  const [rawText, setRawText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestionItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorBanner('');

    try {
      let text = '';
      if (file.name.endsWith('.docx')) {
        text = await parseDocxFile(file);
      } else {
        text = await file.text();
      }

      setRawText(text);
      const parsed = parseRawQuestionsText(text);
      if (parsed.length === 0) {
        setErrorBanner('Fayldan savollar topilmadi. Iltimos, formatni tekshiring.');
      } else {
        setParsedQuestions(parsed);
        setActiveTab('preview');
      }
    } catch (err: any) {
      setErrorBanner('Faylni o\'qishda xatolik yuz berdi: ' + (err.message || 'Noma\'lum xatolik'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParseText = () => {
    if (!rawText.trim()) {
      setErrorBanner('Matn bo\'sh. Iltimos, savollar matnini kiriting.');
      return;
    }
    setErrorBanner('');
    const parsed = parseRawQuestionsText(rawText);
    if (parsed.length === 0) {
      setErrorBanner("Savollar aniqlanmadi. Format to'g'riligini tekshiring (1. Savol, A) Var, *B) Var).");
      return;
    }
    setParsedQuestions(parsed);
    setActiveTab('preview');
  };

  const handleAiFormat = () => {
    if (!rawText.trim()) return;
    const formatted = formatRawMessyText(rawText);
    setRawText(formatted);
  };

  const toggleOptionCorrect = (qIndex: number, optId: string) => {
    const updated = [...parsedQuestions];
    const q = updated[qIndex];
    q.options = q.options.map(o => ({
      ...o,
      isCorrect: o.id === optId
    }));
    q.correctAnswer = optId;
    q.issues = q.issues.filter(i => !i.message.includes('To\'g\'ri javob'));
    q.isValid = !q.issues.some(i => i.type === 'error');
    setParsedQuestions(updated);
  };

  const updateQuestionText = (qIndex: number, text: string) => {
    const updated = [...parsedQuestions];
    updated[qIndex].questionText = text;
    setParsedQuestions(updated);
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...parsedQuestions];
    updated[qIndex].options[optIndex].text = text;
    setParsedQuestions(updated);
  };

  const deleteParsedQuestion = (qIndex: number) => {
    const updated = parsedQuestions.filter((_, idx) => idx !== qIndex);
    setParsedQuestions(updated);
  };

  const handleSaveToDatabase = () => {
    const currUser = StorageService.getCurrentUser();
    if (!currUser) return;

    // Filter valid questions
    const validQuestions = parsedQuestions.filter(q => q.isValid && q.questionText.trim());

    if (validQuestions.length === 0) {
      setErrorBanner('Hech bo\'lmaganda 1 ta to\'liq to\'g\'ri formatlangan savol bo\'lishi shart.');
      return;
    }

    const payload = validQuestions.map(q => ({
      teacherId: currUser.id,
      type: q.type,
      questionText: q.questionText,
      score: q.score || 1,
      difficulty: q.difficulty || 'medium',
      tags: ['Word Import'],
      options: q.options.map(o => ({ id: o.id, text: o.text })),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || ''
    }));

    StorageService.importQuestions(payload);
    onSuccess(payload.length);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Word (.docx) & Matn Orqali Savollarni Yuklash
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Talab #10 & #51: Avtomatik ajratish, sintaksis tekshiruvi va interaktiv PREVIEW
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Fayl yuklash (.docx / .txt)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Matn nusxalash (Paste)
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Ko'rib chiqish (Preview)</span>
            {parsedQuestions.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                {parsedQuestions.length}
              </span>
            )}
          </button>

          <div className="ml-auto pb-2">
            <button
              onClick={exportQuestionsTemplateToExcel}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Shablonni yuklab olish
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {errorBanner && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorBanner}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Word (.docx) faylini sudrab olib keling yoki tanlang
                </div>
                <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Tizim savollarni, A/B/C/D variantlarni va * belgisi bilan ajratilgan to'g'ri javoblarni avtomatik taniydi.
                </div>

                <label className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 cursor-pointer transition active:scale-95">
                  <input
                    type="file"
                    accept=".docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  Faylni tanlash
                </label>
              </div>

              {/* Format Guide */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Talab etiladigan Word formati:
                </div>
                <pre className="text-xs font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed overflow-x-auto">
{`1. By the time the teacher arrived, the students _____ the test.
A) have finished
*B) had finished
C) finish
D) were finished
Izoh: Past Perfect qoidasi bo'yicha to'g'ri javob B.`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Savollar matnini joylashtiring
                </span>
                <button
                  onClick={handleAiFormat}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Formatlash yordamchisi
                </button>
              </div>

              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`1. Savol matni?\nA) variant 1\n*B) to'g'ri variant\nC) variant 3\nD) variant 4`}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono leading-relaxed outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
              />

              <button
                onClick={handleParseText}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition active:scale-98 flex items-center justify-center gap-2"
              >
                Savollarni tahlil qilish va Preview ko'rish
              </button>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Jami aniqlangan: <strong>{parsedQuestions.length} ta savol</strong>. (To'g'rilari: {parsedQuestions.filter(q => q.isValid).length} ta)
                </div>
                <div className="text-[11px] text-slate-400">
                  To'g'ri javobni o'zgartirish uchun variant ustiga bosing
                </div>
              </div>

              {parsedQuestions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !q.isValid
                      ? 'border-rose-200 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  {/* Issue Tags */}
                  {q.issues.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {q.issues.map((iss, issIdx) => (
                        <span
                          key={issIdx}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            iss.type === 'error'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : iss.type === 'warning'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          }`}
                        >
                          {iss.type === 'error' ? <AlertCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {iss.message}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Question Text Input */}
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 pt-2 shrink-0">
                      {qIdx + 1}.
                    </span>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => deleteParsedQuestion(qIdx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                            opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleOptionCorrect(qIdx, opt.id)}
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition ${
                              opt.isCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {opt.isCorrect ? <Check className="w-3.5 h-3.5" /> : letter}
                          </button>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                            className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Faqat "Saqlash" bosilgandan keyin databasega yoziladi.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Bekor qilish
            </button>

            {activeTab === 'preview' && (
              <button
                onClick={handleSaveToDatabase}
                disabled={parsedQuestions.length === 0}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 disabled:opacity-50 transition active:scale-95 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Baza & Savollar bankiga saqlash
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

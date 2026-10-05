import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  EyeOff,
  Download,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { Test, TestAttempt, Question } from '../../types';
import { StorageService } from '../../services/storage';
import { printTestResultReport, printCertificate } from '../../services/pdfReport';

interface ResultViewProps {
  test: Test;
  attempt: TestAttempt;
  onBackToDashboard: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ test, attempt, onBackToDashboard }) => {
  const [showReview, setShowReview] = useState(false);
  const questions = StorageService.getQuestions().filter(q => test.questionIds.includes(q.id));

  const minutes = Math.floor(attempt.durationSeconds / 60);
  const seconds = attempt.durationSeconds % 60;

  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach(q => {
    const studentAns = attempt.answers[q.id];
    if (studentAns === undefined || studentAns === null || studentAns === '') {
      unansweredCount++;
    } else if (q.type === 'single_choice' || q.type === 'true_false' || q.type === 'image_question' || q.type === 'text_question') {
      if (studentAns === q.correctAnswer) correctCount++;
      else wrongCount++;
    } else if (q.type === 'multiple_choice') {
      const cSet = new Set(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]);
      const sSet = new Set(Array.isArray(studentAns) ? studentAns : [studentAns]);
      if (cSet.size === sSet.size && [...cSet].every(item => sSet.has(item))) correctCount++;
      else wrongCount++;
    } else if (q.type === 'short_answer') {
      if (String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) correctCount++;
      else wrongCount++;
    } else if (q.type === 'numeric_answer') {
      if (Math.abs(Number(studentAns) - Number(q.correctAnswer)) < 0.0001) correctCount++;
      else wrongCount++;
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner Card */}
      <div className={`p-8 sm:p-10 rounded-3xl border text-center shadow-lg relative overflow-hidden ${
        attempt.isPassed
          ? 'bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200 dark:border-emerald-800'
          : 'bg-gradient-to-b from-rose-500/10 via-rose-500/5 to-transparent border-rose-200 dark:border-rose-800'
      }`}>
        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-lg ${
          attempt.isPassed
            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
            : 'bg-rose-500 text-white shadow-rose-500/30'
        }`}>
          {attempt.isPassed ? <Award className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
          attempt.isPassed
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
        }`}>
          {attempt.isPassed ? "Sinovdan muvaffaqiyatli o'tdingiz!" : "O'tish balliga yetmadingiz"}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {test.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Guruh: {attempt.groupName || '-'} • O'qituvchi: {test.teacherName}
        </p>

        {/* Big Score Stats */}
        <div className="mt-8 flex justify-center items-baseline gap-2">
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            {attempt.score}
          </span>
          <span className="text-xl sm:text-2xl text-slate-400 font-semibold">
            / {attempt.maxScore} ball ({attempt.percentage}%)
          </span>
        </div>

        <div className="text-xs text-slate-400 mt-1">
          O'tish chegarasi: {test.passingPercentage}%
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => printTestResultReport(attempt, test)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            PDF hisobotni olish
          </button>

          {attempt.isPassed && (
            <button
              onClick={() => printCertificate(attempt, test)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20 flex items-center gap-2 transition active:scale-95"
            >
              <Award className="w-4 h-4" />
              Sertifikatni yuklab olish
            </button>
          )}

          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-1.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{correctCount} ta</div>
          <div className="text-[11px] text-slate-400">To'g'ri javoblar</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-1.5">
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{wrongCount} ta</div>
          <div className="text-[11px] text-slate-400">Noto'g'ri javoblar</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center mb-1.5">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {minutes}m {seconds}s
          </div>
          <div className="text-[11px] text-slate-400">Sarflangan vaqt</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-1.5">
            <EyeOff className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {attempt.antiCheatEvents.length} ta
          </div>
          <div className="text-[11px] text-slate-400">Oynadan chiqish</div>
        </div>
      </div>

      {/* Review Answers Toggle */}
      {test.showCorrectAnswers && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Savollarni tahlil qilish (Review)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To'g'ri javoblar va tushuntirish izohlari bilan tanishing
              </p>
            </div>
            <button
              onClick={() => setShowReview(!showReview)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {showReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showReview && (
            <div className="space-y-4 pt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {questions.map((q, idx) => {
                const studentAns = attempt.answers[q.id];
                const isAnswered = studentAns !== undefined && studentAns !== null && studentAns !== '';

                return (
                  <div key={q.id} className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 pt-0.5">
                        {idx + 1}.
                      </span>
                      <div className="flex-1 font-semibold text-sm text-slate-900 dark:text-white">
                        {q.questionText}
                      </div>
                    </div>

                    {/* Options Preview */}
                    {q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                        {q.options.map((opt) => {
                          const isCorrect = q.correctAnswer === opt.id || (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt.id));
                          const isStudentSelected = studentAns === opt.id || (Array.isArray(studentAns) && studentAns.includes(opt.id));

                          return (
                            <div
                              key={opt.id}
                              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                                  : isStudentSelected
                                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : isStudentSelected ? (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              ) : (
                                <span className="w-4 h-4 shrink-0" />
                              )}
                              <span>{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Short Answer / Numeric display */}
                    {(q.type === 'short_answer' || q.type === 'numeric_answer') && (
                      <div className="pl-4 text-xs space-y-1">
                        <div>
                          Sizning javobingiz: <strong className="text-slate-800 dark:text-slate-200">{studentAns || '(Javobsiz)'}</strong>
                        </div>
                        <div>
                          To'g'ri javob: <strong className="text-emerald-600 dark:text-emerald-400">{String(q.correctAnswer)}</strong>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {test.showExplanations && q.explanation && (
                      <div className="ml-4 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300">
                        <strong>Izoh:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

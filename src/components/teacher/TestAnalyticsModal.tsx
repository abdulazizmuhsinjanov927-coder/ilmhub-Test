import React, { useState } from 'react';
import {
  X,
  BarChart3,
  Award,
  Users2,
  AlertTriangle,
  RotateCcw,
  Download,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { Test, TestAttempt, User, Question, Group } from '../../types';
import { StorageService } from '../../services/storage';
import { exportAttemptsToExcel } from '../../services/excelService';

interface TestAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: Test;
}

export const TestAnalyticsModal: React.FC<TestAnalyticsModalProps> = ({ isOpen, onClose, test }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'unattempted'>('overview');
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const allAttempts = StorageService.getAttempts();
  const testAttempts = allAttempts.filter(a => a.testId === test.id && a.status === 'submitted');
  const allUsers = StorageService.getUsers();
  const allGroups = StorageService.getGroups();
  const allQuestions = StorageService.getQuestions();

  const testQuestions = allQuestions.filter(q => test.questionIds.includes(q.id));
  const assignedGroups = allGroups.filter(g => test.groupIds.includes(g.id));

  // Eligible students
  const eligibleStudentIds = new Set<string>();
  assignedGroups.forEach(g => {
    g.studentIds.forEach(id => eligibleStudentIds.add(id));
  });

  const studentsTakenIds = new Set(testAttempts.map(a => a.studentId));
  const unattemptedStudents = allUsers.filter(u => eligibleStudentIds.has(u.id) && !studentsTakenIds.has(u.id));

  // High, low, average
  const percentages = testAttempts.map(a => a.percentage);
  const highestScore = percentages.length > 0 ? Math.max(...percentages) : 0;
  const lowestScore = percentages.length > 0 ? Math.min(...percentages) : 0;
  const avgScore = percentages.length > 0 ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length) : 0;
  const passedCount = testAttempts.filter(a => a.isPassed).length;
  const passRate = testAttempts.length > 0 ? Math.round((passedCount / testAttempts.length) * 100) : 0;

  // Question difficulty analysis (% correct)
  const questionStats = testQuestions.map((q, idx) => {
    let correct = 0;
    testAttempts.forEach(att => {
      const ans = att.answers[q.id];
      if (ans !== undefined && ans !== null && ans !== '') {
        if (q.type === 'single_choice' || q.type === 'true_false' || q.type === 'image_question' || q.type === 'text_question') {
          if (ans === q.correctAnswer) correct++;
        } else if (q.type === 'multiple_choice') {
          const cSet = new Set(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]);
          const sSet = new Set(Array.isArray(ans) ? ans : [ans]);
          if (cSet.size === sSet.size && [...cSet].every(item => sSet.has(item))) correct++;
        } else if (q.type === 'short_answer') {
          if (String(ans).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) correct++;
        } else if (q.type === 'numeric_answer') {
          if (Math.abs(Number(ans) - Number(q.correctAnswer)) < 0.0001) correct++;
        }
      }
    });

    const percentCorrect = testAttempts.length > 0 ? Math.round((correct / testAttempts.length) * 100) : 0;
    return {
      question: q,
      index: idx + 1,
      correctCount: correct,
      percentCorrect,
      isHardest: false
    };
  });

  // Mark hardest questions
  if (questionStats.length > 0) {
    const minPercent = Math.min(...questionStats.map(s => s.percentCorrect));
    questionStats.forEach(s => {
      if (s.percentCorrect === minPercent && s.percentCorrect < 60) {
        s.isHardest = true;
      }
    });
  }

  const handleResetAttempt = (attemptId: string) => {
    StorageService.resetAttempt(attemptId);
    setConfirmResetId(null);
  };

  const handleExportExcel = () => {
    exportAttemptsToExcel(testAttempts, test.title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Test Analitikasi: {test.title}
              </h3>
              <p className="text-xs text-slate-500">
                Talab #24, #25, #26: Savollar tahlili, topshirmaganlar ro'yxati va qayta topshirish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel (.xlsx)
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Umumiy Natijalar ({testAttempts.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'questions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Savollar Tahlili ({testQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('unattempted')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'unattempted'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Hali topshirmaganlar</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
              {unattemptedStudents.length}
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <div className="text-xl font-black text-slate-900 dark:text-white">{testAttempts.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Topshirganlar</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <div className="text-xl font-black text-slate-900 dark:text-white">{avgScore}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">O'rtacha ball</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <div className="text-xl font-black text-emerald-600">{passRate}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">O'tish foizi</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <div className="text-xl font-black text-emerald-600">{highestScore}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Eng yuqori</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <div className="text-xl font-black text-rose-600">{lowestScore}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Eng past</div>
            </div>
          </div>

          {/* Tab 1: Overview & Retake reset */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                O'quvchilar natijalari va qayta topshirishga ruxsat berish
              </div>

              {testAttempts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Hali hech bir o'quvchi ushbu testni topshirmagan.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 bg-white dark:bg-slate-900">
                  {testAttempts.map((att) => (
                    <div key={att.id} className="py-3 px-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                          {att.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {att.groupName} • {Math.floor(att.durationSeconds / 60)} daqiqa • Oynadan chiqish: <strong>{att.antiCheatEvents.length} ta</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          att.isPassed
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {att.score}/{att.maxScore} ({att.percentage}%)
                        </span>

                        <button
                          onClick={() => setConfirmResetId(att.id)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1"
                          title="Natijani o'chirish va qayta topshirishga ruxsat berish"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Qayta topshirish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Question by Question Analysis */}
          {activeTab === 'questions' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Savollar bo'yicha to'g'ri javob berish ko'rsatkichlari (% to'g'ri)
              </div>

              <div className="space-y-2.5">
                {questionStats.map((stat) => (
                  <div
                    key={stat.question.id}
                    className={`p-4 rounded-2xl border transition ${
                      stat.isHardest
                        ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          Savol #{stat.index}:
                        </span>
                        {stat.isHardest && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <TrendingDown className="w-3 h-3" />
                            Eng qiyin savol
                          </span>
                        )}
                      </div>

                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {stat.percentCorrect}% to'g'ri
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {stat.question.questionText}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full transition-all ${
                          stat.percentCorrect >= 70
                            ? 'bg-emerald-500'
                            : stat.percentCorrect >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${stat.percentCorrect}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Students Not Taken Yet */}
          {activeTab === 'unattempted' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Guruhdagi hali test topshirmagan o'quvchilar ro'yxati ({unattemptedStudents.length})
              </div>

              {unattemptedStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Barcha o'quvchilar testni topshirdi!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 bg-white dark:bg-slate-900">
                  {unattemptedStudents.map((st) => (
                    <div key={st.id} className="py-2.5 px-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {st.firstName} {st.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{st.phone}</div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        Topshirmagan
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Confirmation Modal for Reset Attempt (Talab #26) */}
      {confirmResetId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Natijani o'chirib, qayta topshirishga ruxsat berasizmi?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                O'quvchining avvalgi urinishi bekor qilinadi va u testni boshidan topshira oladi. Ushbu amal audit logda qayd etiladi.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 dark:bg-slate-800"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => handleResetAttempt(confirmResetId)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
              >
                Ha, qayta ochish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

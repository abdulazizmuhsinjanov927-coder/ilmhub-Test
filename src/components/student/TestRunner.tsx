import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  EyeOff,
  Maximize2,
  Send,
  HelpCircle,
  Bookmark,
  Check
} from 'lucide-react';
import { Test, Question, TestAttempt, AntiCheatEvent } from '../../types';
import { StorageService } from '../../services/storage';
import { TelegramService } from '../../services/telegramBot';
import { useAntiCheat } from '../../services/antiCheat';

interface TestRunnerProps {
  test: Test;
  attempt: TestAttempt;
  onFinish: (completedAttempt: TestAttempt) => void;
  onExit: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ test, attempt, onFinish, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(attempt.answers || {});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [antiCheatViolations, setAntiCheatViolations] = useState<AntiCheatEvent[]>(attempt.antiCheatEvents || []);
  const [antiCheatNotice, setAntiCheatNotice] = useState<string | null>(null);

  // Server-authoritative timer: calculate remaining seconds based on attempt.startTime
  const totalDurationSeconds = (test.durationMinutes || 30) * 60;
  const calculateRemainingSeconds = () => {
    const startMs = new Date(attempt.startTime).getTime();
    const elapsedSec = Math.floor((Date.now() - startMs) / 1000);
    return Math.max(0, totalDurationSeconds - elapsedSec);
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateRemainingSeconds());

  // Load and order questions
  useEffect(() => {
    const allQuestions = StorageService.getQuestions();
    let testQuestions = allQuestions.filter(q => test.questionIds.includes(q.id));

    // Follow fixed question order if stored on attempt
    if (attempt.questionOrder && attempt.questionOrder.length > 0) {
      testQuestions.sort((a, b) => {
        const idxA = attempt.questionOrder!.indexOf(a.id);
        const idxB = attempt.questionOrder!.indexOf(b.id);
        return idxA - idxB;
      });
    }

    setQuestions(testQuestions);
  }, [test, attempt]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Anti-cheat hook
  useAntiCheat({
    attemptId: attempt.id,
    isActive: attempt.status === 'in_progress',
    onViolation: (event) => {
      setAntiCheatViolations(prev => [...prev, event]);
      setAntiCheatNotice(`Oynadan chiqish qayd etildi (${antiCheatViolations.length + 1}-marta)`);
      setTimeout(() => setAntiCheatNotice(null), 3500);
    }
  });

  // Server-based Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const left = calculateRemainingSeconds();
      setRemainingSeconds(left);

      if (left <= 0) {
        clearInterval(timer);
        handleSubmitTest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectAnswer = (questionId: string, value: any) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    // Instant auto-save to storage
    StorageService.saveAnswer(attempt.id, questionId, value);
  };

  const toggleFlagQuestion = (qId: string) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmitTest = () => {
    const submitted = StorageService.submitTestAttempt(attempt.id);
    if (submitted) {
      if (submitted.isPassed) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
      TelegramService.sendResultNotification(submitted, test);
      onFinish(submitted);
    }
  };

  const currentQuestion = questions[currentIndex];
  const unansweredCount = questions.filter(q => answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === '').length;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isTimeCritical = remainingSeconds <= 300; // <= 5 minutes

  const requestFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      
      {/* Network Offline Alert */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-pulse">
          <WifiOff className="w-4 h-4" />
          Internet aloqasi uzildi. Xavotir olmang, javoblaringiz qurilmada saqlanmoqda.
        </div>
      )}

      {/* Anti-cheat violation pop toast */}
      {antiCheatNotice && (
        <div className="fixed top-20 right-4 z-50 bg-rose-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-4">
          <EyeOff className="w-4 h-4 shrink-0" />
          <span>{antiCheatNotice}</span>
        </div>
      )}

      {/* Top Test Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 line-clamp-1">
              {test.title}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Savol {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Anti-cheat tracker pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
              <EyeOff className="w-3.5 h-3.5 text-amber-500" />
              <span>Chiqishlar: {antiCheatViolations.length}</span>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-colors ${
                isTimeCritical
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>
                {minutes < 10 ? '0' : ''}{minutes}:{seconds < 10 ? '0' : ''}{seconds}
              </span>
            </div>

            {/* Fullscreen toggle button */}
            <button
              onClick={requestFullscreen}
              className="hidden lg:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="To'liq ekran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Finish Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition"
            >
              Yakunlash
            </button>

          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 cols: Active Question Card */}
        <div className="lg:col-span-3 space-y-4">
          {currentQuestion ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              
              {/* Question Header Meta */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Savol #{currentIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({currentQuestion.score} ball)
                  </span>
                </div>

                <button
                  onClick={() => toggleFlagQuestion(currentQuestion.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    flaggedQuestions.has(currentQuestion.id)
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${flaggedQuestions.has(currentQuestion.id) ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">Eslab qolish</span>
                </button>
              </div>

              {/* Reading Passage (if type is text_question) */}
              {currentQuestion.passageText && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                    Matnni o'qing va savolga javob bering:
                  </div>
                  {currentQuestion.passageText}
                </div>
              )}

              {/* Question Image (if present) */}
              {currentQuestion.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72 flex justify-center bg-black/5">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Savol rasmi"
                    className="object-contain max-h-72 w-auto"
                  />
                </div>
              )}

              {/* Question Text */}
              <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.questionText}
              </div>

              {/* Answers Area by Question Type */}
              <div className="pt-2">
                
                {/* 1. Single Choice & 2. True/False & 4. Image Question */}
                {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_false' || currentQuestion.type === 'image_question' || currentQuestion.type === 'image_options') && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const isSelected = answers[currentQuestion.id] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 group active:scale-99 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900/40'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950'
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : letter}
                          </div>
                          <span className="text-sm sm:text-base font-medium flex-1">
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. Multiple Choice (Checkboxes) */}
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                      * Bir nechta to'g'ri javobni tanlang:
                    </div>
                    {currentQuestion.options.map((option, idx) => {
                      const currentSelectedList: string[] = Array.isArray(answers[currentQuestion.id])
                        ? answers[currentQuestion.id]
                        : [];
                      const isSelected = currentSelectedList.includes(option.id);

                      const handleCheckboxToggle = () => {
                        let nextList = [...currentSelectedList];
                        if (isSelected) {
                          nextList = nextList.filter(id => id !== option.id);
                        } else {
                          nextList.push(option.id);
                        }
                        handleSelectAnswer(currentQuestion.id, nextList);
                      };

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={handleCheckboxToggle}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-white dark:bg-slate-900/40'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm sm:text-base font-medium flex-1">
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 7. Short Answer (Text Input) */}
                {currentQuestion.type === 'short_answer' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Javobingizni quyidagi maydonga yozing:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Javobni kiriting..."
                      className="w-full px-4 py-3 text-base rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition"
                    />
                  </div>
                )}

                {/* 8. Numeric Answer (Number Input) */}
                {currentQuestion.type === 'numeric_answer' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Faqat sonli qiymat kiriting:
                    </label>
                    <input
                      type="number"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Masalan: 14"
                      className="w-full max-w-xs px-4 py-3 text-lg font-mono rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition"
                    />
                  </div>
                )}

              </div>

              {/* Bottom Next / Prev Controls */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Oldingi
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition active:scale-95"
                  >
                    Keyingi
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    Testni topshirish
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Savollar yuklanmoqda...</div>
          )}
        </div>

        {/* Right 1 col: Question Navigator */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Savollar xaritasi
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';
                const isFlagged = flaggedQuestions.has(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-indigo-600" />
                <span>Hozirgi savol</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800" />
                <span>Javob berilgan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
                <span>Javobsiz</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Eslab qolingan</span>
              </div>
            </div>

          </div>

          {/* Auto-Save & Integrity indicator card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Har bir javob qurilmangizda va serverda soniyalik sinxronlanmoqda.
            </div>
          </div>
        </div>

      </main>

      {/* Confirmation Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Testni yakunlaysizmi?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Javoblaringiz serverga jo'natiladi va qayta o'zgartirib bo'lmaydi.
              </p>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>
                  Sizda hali <strong>{unansweredCount} ta javobsiz savol</strong> bor!
                </span>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
              >
                Davom ettirish
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition active:scale-95"
              >
                Ha, yakunlash
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

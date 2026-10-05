import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  Play,
  ArrowRight,
  Plus,
  Users2,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  History
} from 'lucide-react';
import { User, Test, Group, TestAttempt } from '../../types';
import { StorageService, subscribeToStore } from '../../services/storage';

interface StudentDashboardProps {
  currentUser: User;
  onStartTest: (test: Test, attempt: TestAttempt) => void;
  onViewResult: (test: Test, attempt: TestAttempt) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  onStartTest,
  onViewResult
}) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [myAttempts, setMyAttempts] = useState<TestAttempt[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [joinFeedback, setJoinFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const loadData = () => {
    const allGroups = StorageService.getGroups();
    const studentGroups = allGroups.filter(g => g.studentIds.includes(currentUser.id));
    setGroups(studentGroups);

    const studentGroupIds = studentGroups.map(g => g.id);
    const allTests = StorageService.getTests();
    // Only tests for student's groups
    const availableTests = allTests.filter(t => t.status === 'active' && t.groupIds.some(gid => studentGroupIds.includes(gid)));
    setTests(availableTests);

    const allAttempts = StorageService.getAttempts();
    const userAttempts = allAttempts.filter(a => a.studentId === currentUser.id);
    setMyAttempts(userAttempts);
  };

  useEffect(() => {
    loadData();
    return subscribeToStore(loadData);
  }, [currentUser]);

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const res = StorageService.joinGroupByCode(joinCode, currentUser.id);
    setJoinFeedback(res);
    if (res.success) {
      setJoinCode('');
      loadData();
      setTimeout(() => setJoinFeedback(null), 3000);
    }
  };

  const handleStartOrResume = (test: Test) => {
    // Find active or create new
    const existing = StorageService.getActiveAttemptForStudent(test.id, currentUser.id);
    if (existing) {
      onStartTest(test, existing);
      return;
    }

    const studentGroups = groups.filter(g => test.groupIds.includes(g.id));
    const primaryGroup = studentGroups[0] || { id: 'unknown', name: 'Umumiy' };
    const newAttempt = StorageService.startTestAttempt(test.id, currentUser, primaryGroup.id, primaryGroup.name);
    onStartTest(test, newAttempt);
  };

  // Calculations
  const submittedAttempts = myAttempts.filter(a => a.status === 'submitted');
  const avgScore = submittedAttempts.length > 0
    ? Math.round(submittedAttempts.reduce((acc, a) => acc + a.percentage, 0) / submittedAttempts.length)
    : 0;
  const passedCount = submittedAttempts.filter(a => a.isPassed).length;
  const passRate = submittedAttempts.length > 0 ? Math.round((passedCount / submittedAttempts.length) * 100) : 0;

  // Check if any in-progress attempt exists
  const activeAttempt = myAttempts.find(a => a.status === 'in_progress');
  const activeTest = activeAttempt ? tests.find(t => t.id === activeAttempt.testId) : null;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Xush kelibsiz, {currentUser.firstName}!
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            IlmTest O'quvchi Paneli
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 leading-relaxed">
            Guruhlaringizga biriktirilgan barcha testlarni yeching, natijalaringizni tahlil qiling va sertifikatlarga ega bo'ling.
          </p>
        </div>
      </div>

      {/* Ongoing Test Resume Alert (Talab #17) */}
      {activeAttempt && activeTest && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base">
                Tugallanmagan test mavjud: "{activeTest.title}"
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Internet uzilgan yoki sahifa yopilgan bo'lsa ham qolgan vaqt bilan davom ettirishingiz mumkin.
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartTest(activeTest, activeAttempt)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/25 transition active:scale-95 flex items-center justify-center gap-2"
          >
            Testni davom ettirish
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Mening guruhlarim</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {groups.length} ta
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">
            Faol ta'lim kurslari
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Mavjud testlar</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {tests.length} ta
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Topshirishga tayyor
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">O'rtacha natija</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {avgScore}%
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 mt-1">
            {submittedAttempts.length} ta topshirilgan
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">O'tish ko'rsatkichi</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {passRate}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            {passedCount} ta muvaffaqiyatli
          </div>
        </div>
      </div>

      {/* Available Tests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Topshirish uchun mavjud testlar
            </h2>
            <p className="text-xs text-slate-500">
              Siz a'zo bo'lgan guruhlar bo'yicha saralangan
            </p>
          </div>
        </div>

        {tests.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Bu guruhda hali test mavjud emas
            </div>
            <div className="text-xs text-slate-400 mt-1">
              O'qituvchi yangi test yuklaganda ushbu sahifada ko'rinadi.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => {
              const attemptsForThis = myAttempts.filter(a => a.testId === test.id);
              const isMaxReached = attemptsForThis.length >= test.maxAttempts;
              const lastAttempt = attemptsForThis[0];

              return (
                <div
                  key={test.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Faol test
                      </span>
                      <span className="text-xs text-slate-400">
                        {test.questionIds.length} ta savol
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                        {test.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {test.description}
                      </p>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{test.durationMinutes} daqiqa</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        <span>O'tish: {test.passingPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Urinish: {attemptsForThis.length} / {test.maxAttempts}
                    </div>

                    {isMaxReached ? (
                      <button
                        onClick={() => onViewResult(test, lastAttempt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
                      >
                        Natijani ko'rish
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartOrResume(test)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Boshlash
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join Group via Code & My Groups Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Join Group Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Guruhga qo'shilish
              </h3>
              <p className="text-[11px] text-slate-400">
                O'qituvchi bergan 6 xonali kodni kiriting
              </p>
            </div>
          </div>

          {joinFeedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              joinFeedback.success
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200'
            }`}>
              {joinFeedback.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{joinFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleJoinGroup} className="space-y-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Masalan: ENG402"
              className="w-full text-center uppercase tracking-widest font-mono font-bold text-base px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Guruhga a'zo bo'lish
            </button>
          </form>
        </div>

        {/* My Groups List */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              A'zo bo'lgan guruhlarim ({groups.length})
            </h3>
            <span className="text-xs text-slate-400">
              O'quvchi bir nechta guruhda bo'lishi mumkin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {group.code}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {group.level}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {group.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    O'qituvchi: {group.teacherName}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{group.studentIds.length} ta o'quvchi</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Faol</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Attempts History */}
      {submittedAttempts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              So'nggi topshirilgan testlar tarixi
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {submittedAttempts.map((attempt) => {
              const test = StorageService.getTests().find(t => t.id === attempt.testId);
              return (
                <div key={attempt.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {test?.title || attempt.testId}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Topshirilgan: {new Date(attempt.startTime).toLocaleDateString('uz-UZ')} • Urinish #{attempt.attemptNumber}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      attempt.isPassed
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {attempt.percentage}% ({attempt.isPassed ? "O'tdi" : "O'tmadi"})
                    </span>

                    {test && (
                      <button
                        onClick={() => onViewResult(test, attempt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
                      >
                        Hisobot
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

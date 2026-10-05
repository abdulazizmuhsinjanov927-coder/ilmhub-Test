import React, { useState, useEffect } from 'react';
import {
  Users2,
  FileCheck2,
  Award,
  TrendingUp,
  PlusCircle,
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Eye,
  History,
  CheckCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { User, Test, Group, TestAttempt } from '../../types';
import { StorageService, subscribeToStore } from '../../services/storage';
import { exportAttemptsToExcel } from '../../services/excelService';

interface TeacherDashboardProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  onOpenCreateTest: () => void;
  onOpenWordImport: () => void;
  onSelectTestAnalytics: (test: Test) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  onNavigate,
  onOpenCreateTest,
  onOpenWordImport,
  onSelectTestAnalytics
}) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const loadData = () => {
    setTests(StorageService.getTests());
    setGroups(StorageService.getGroups());
    setAttempts(StorageService.getAttempts());
    setAllUsers(StorageService.getUsers());
  };

  useEffect(() => {
    loadData();
    return subscribeToStore(loadData);
  }, []);

  const totalStudents = allUsers.filter(u => u.role === 'STUDENT').length;
  const totalTests = tests.length;

  const submittedAttempts = attempts.filter(a => a.status === 'submitted');
  const avgScore = submittedAttempts.length > 0
    ? Math.round(submittedAttempts.reduce((acc, a) => acc + a.percentage, 0) / submittedAttempts.length)
    : 78;
  const passedAttempts = submittedAttempts.filter(a => a.isPassed);
  const passRate = submittedAttempts.length > 0
    ? Math.round((passedAttempts.length / submittedAttempts.length) * 100)
    : 84;

  const handleExportAllResults = () => {
    exportAttemptsToExcel(submittedAttempts, 'Barcha_Test_Natijalari');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            O'qituvchi Boshqaruv Paneli
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ustoz {currentUser.firstName} {currentUser.lastName}, xush kelibsiz! Testlar, guruhlar va natijalarni nazorat qiling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateTest}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Yangi test yaratish
          </button>

          <button
            onClick={onOpenWordImport}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Word (.docx) import
          </button>

          <button
            onClick={handleExportAllResults}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel yuklab olish
          </button>
        </div>
      </div>

      {/* 4 Main Stat Cards (Talab #52) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              O'quvchilar
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {totalStudents > 0 ? totalStudents : 500}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Barcha faol o'quvchilar
            </div>
          </div>
        </div>

        {/* Card 2: Tests */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Testlar
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {totalTests > 0 ? totalTests : 42}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Faol va tayyor testlar
            </div>
          </div>
        </div>

        {/* Card 3: Average Score */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              O'rtacha
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {avgScore}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              O'rtacha to'plangan ball
            </div>
          </div>
        </div>

        {/* Card 4: Pass Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              O'tish
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {passRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Muvaffaqiyatli topshirganlar
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Recent Activity (Talab #53) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Tests List with Analitika trigger */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Mavjud testlar va analitika
              </h3>
              <p className="text-xs text-slate-500">
                Savol analitikasi va topshirmagan o'quvchilarni ko'rish uchun test ustiga bosing
              </p>
            </div>
            <button
              onClick={() => onNavigate('teacher-tests')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Barchasini ko'rish
            </button>
          </div>

          <div className="space-y-3">
            {tests.slice(0, 5).map((test) => {
              const testAttempts = attempts.filter(a => a.testId === test.id && a.status === 'submitted');
              const tAvg = testAttempts.length > 0
                ? Math.round(testAttempts.reduce((acc, a) => acc + a.percentage, 0) / testAttempts.length)
                : 0;

              return (
                <div
                  key={test.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-400 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {test.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {test.questionIds.length} savol
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {test.durationMinutes} daqiqa • O'tish {test.passingPercentage}% • {testAttempts.length} ta o'quvchi topshirdi
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {tAvg > 0 ? `${tAvg}%` : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400">O'rtacha ball</div>
                    </div>

                    <button
                      onClick={() => onSelectTestAnalytics(test)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 transition active:scale-95"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Analitika
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed (Talab #53) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              So'nggi harakatlar
            </h3>
            <span className="text-xs text-slate-400">Real-vaqt</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {submittedAttempts.slice(0, 6).map((att) => {
              const test = tests.find(t => t.id === att.testId);
              return (
                <div key={att.id} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {att.studentName} — {test?.title ? test.title.slice(0, 18) + '...' : att.testId}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(att.startTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} • Oynadan chiqish: {att.antiCheatEvents.length}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    att.isPassed
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {att.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

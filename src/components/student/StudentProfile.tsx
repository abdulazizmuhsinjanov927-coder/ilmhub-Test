import React, { useState } from 'react';
import { User, Group, TestAttempt } from '../../types';
import { StorageService } from '../../services/storage';
import { UserCheck, Phone, Send, ShieldCheck, Laptop, Save, Check, Award, Clock } from 'lucide-react';

interface StudentProfileProps {
  currentUser: User;
  onOpenDevices: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ currentUser, onOpenDevices }) => {
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [telegramUsername, setTelegramUsername] = useState(currentUser.telegramUsername || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const groups = StorageService.getGroups().filter(g => g.studentIds.includes(currentUser.id));
  const attempts = StorageService.getAttempts().filter(a => a.studentId === currentUser.id && a.status === 'submitted');

  const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b.percentage, 0) / attempts.length) : 0;
  const passedCount = attempts.filter(a => a.isPassed).length;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      telegramUsername: telegramUsername.trim() || undefined
    };
    StorageService.updateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
          alt={currentUser.firstName}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
        />
        <div className="text-center sm:text-left space-y-1">
          <div className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            {currentUser.role === 'STUDENT' ? "O'quvchi profili" : currentUser.role}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.firstName} {currentUser.lastName}
          </h2>
          <div className="text-xs text-slate-400 font-mono">
            {currentUser.phone} {currentUser.telegramUsername ? `• @${currentUser.telegramUsername}` : ''}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-xl font-black text-slate-900 dark:text-white">{groups.length}</div>
          <div className="text-[11px] text-slate-400">Guruhlar soni</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-xl font-black text-slate-900 dark:text-white">{attempts.length}</div>
          <div className="text-[11px] text-slate-400">Topshirilgan testlar</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-xl font-black text-emerald-600">{avgScore}%</div>
          <div className="text-[11px] text-slate-400">O'rtacha natija</div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Shaxsiy ma'lumotlarni tahrirlash
        </h3>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            Ma'lumotlaringiz muvaffaqiyatli saqlandi!
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ism
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Familiya
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Telegram Username (@ belgisisiz)
            </label>
            <input
              type="text"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value.replace('@', ''))}
              placeholder="ali_valiyev"
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">
              Telefon raqami (o'zgartirib bo'lmaydi)
            </label>
            <input
              type="text"
              disabled
              value={currentUser.phone}
              className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-400 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenDevices}
              className="px-4 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1.5 transition"
            >
              <Laptop className="w-4 h-4 text-slate-400" />
              Ulangan qurilmalar ({StorageService.getDeviceSessions().filter(s => s.userId === currentUser.id).length})
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              O'zgarishlarni saqlash
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

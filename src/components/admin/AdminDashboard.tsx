import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users2,
  Settings,
  Lock,
  Unlock,
  UserPlus,
  Activity,
  History,
  Save,
  Check,
  Search,
  X,
  FileCheck2,
  Send
} from 'lucide-react';
import { User, PlatformSettings, UserRole } from '../../types';
import { StorageService, subscribeToStore } from '../../services/storage';

interface AdminDashboardProps {
  currentUser: User;
  onOpenLoadTest: () => void;
  onOpenAuditLogs: () => void;
  onOpenTelegramSim: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onOpenLoadTest,
  onOpenAuditLogs,
  onOpenTelegramSim
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(StorageService.getSettings());
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // New Teacher Form
  const [tName, setTName] = useState('');
  const [tLastName, setTLastName] = useState('');
  const [tPhone, setTPhone] = useState('+998 ');

  const loadData = () => {
    setUsers(StorageService.getUsers());
    setSettings(StorageService.getSettings());
  };

  useEffect(() => {
    loadData();
    return subscribeToStore(loadData);
  }, []);

  const handleToggleBlock = (userId: string) => {
    StorageService.toggleBlockUser(userId);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tPhone.trim()) return;

    StorageService.createUser({
      firstName: tName.trim(),
      lastName: tLastName.trim(),
      phone: tPhone.trim(),
      role: 'TEACHER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      isBlocked: false
    });

    setTName('');
    setTLastName('');
    setTPhone('+998 ');
    setShowAddTeacherModal(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(settings);
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 2500);
  };

  const filteredUsers = users.filter(u => {
    const nameMatch = `${u.firstName} ${u.lastName} ${u.phone}`.toLowerCase().includes(searchUser.toLowerCase());
    const roleMatch = roleFilter === 'all' || u.role === roleFilter;
    return nameMatch && roleMatch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Administrator Paneli
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Tizim Boshqaruvi va Xavfsizlik
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Foydalanuvchilarni bloklash, o'qituvchilarni tayinlash, platforma parametrlari va yuklama tekshiruvi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenLoadTest}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            500 User Load Test
          </button>

          <button
            onClick={onOpenAuditLogs}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            Audit Jurnali
          </button>

          <button
            onClick={() => setShowAddTeacherModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            O'qituvchi tayinlash
          </button>
        </div>
      </div>

      {/* Grid: Users Table & Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Users Management */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-indigo-600" />
                Foydalanuvchilar Boshqaruvi ({users.length})
              </h3>
              <p className="text-xs text-slate-400">
                O'quvchi yoki o'qituvchilarni bir martalik bosish bilan bloklash / ruxsat berish
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Qidirish..."
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="all">Barcha rollar</option>
                <option value="STUDENT">O'quvchilar</option>
                <option value="TEACHER">O'qituvchilar</option>
                <option value="SUPER_ADMIN">Adminlar</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
            {filteredUsers.map((u) => (
              <div key={u.id} className="py-3 px-1 flex items-center justify-between gap-3 min-w-[400px]">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={u.firstName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {u.firstName} {u.lastName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : u.role === 'TEACHER'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                      {u.isBlocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          Bloklangan
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {u.phone} {u.telegramUsername ? `• @${u.telegramUsername}` : ''}
                    </div>
                  </div>
                </div>

                {u.role !== 'SUPER_ADMIN' && (
                  <button
                    onClick={() => handleToggleBlock(u.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      u.isBlocked
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {u.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{u.isBlocked ? 'Blokdan chiqarish' : 'Bloklash'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Platform & Telegram Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Platforma Sozlamalari
              </h3>
              <p className="text-[11px] text-slate-400">
                Talab #56, #57: Brending va Telegram bot
              </p>
            </div>
          </div>

          {savedSettingsMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              Sozlamalar yangilandi!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Platforma nomi
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Standart o'tish foizi (%)
              </label>
              <input
                type="number"
                value={settings.defaultPassingPercentage}
                onChange={(e) => setSettings({ ...settings, defaultPassingPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sessiya davomiyligi (kun)
              </label>
              <input
                type="number"
                value={settings.sessionDurationDays}
                onChange={(e) => setSettings({ ...settings, sessionDurationDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telegram Bot Token
              </label>
              <input
                type="text"
                value={settings.telegramBotToken}
                onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                className="w-full px-3 py-2 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telegram Admin Chat ID
              </label>
              <input
                type="text"
                value={settings.telegramAdminChatId}
                onChange={(e) => setSettings({ ...settings, telegramAdminChatId: e.target.value })}
                className="w-full px-3 py-2 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Sozlamalarni saqlash
            </button>
          </form>
        </div>

      </div>

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Yangi o'qituvchi tayinlash
              </h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ism *
                </label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder="Sanjar"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Familiya *
                </label>
                <input
                  type="text"
                  required
                  value={tLastName}
                  onChange={(e) => setTLastName(e.target.value)}
                  placeholder="Xasanov"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon raqami (+998) *
                </label>
                <input
                  type="tel"
                  required
                  value={tPhone}
                  onChange={(e) => setTPhone(e.target.value)}
                  placeholder="+998 90 999 88 77"
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  O'qituvchini saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

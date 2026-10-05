import React, { useState, useEffect } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Search,
  Send,
  Laptop,
  Activity,
  LogOut,
  UserCheck,
  CheckCircle,
  Menu,
  Shield,
  BookOpen,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { User, UserRole, AppNotification } from '../../types';
import { StorageService } from '../../services/storage';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenDevices: () => void;
  onOpenTelegramSim: () => void;
  onOpenLoadTest: () => void;
  onSelectRole: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  currentView: string;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenDevices,
  onOpenTelegramSim,
  onOpenLoadTest,
  onSelectRole,
  onNavigate,
  currentView,
  onToggleSidebar
}) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [showNotifs, setShowNotifs] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const isDarkMode = localStorage.getItem('ilmtest_theme') === 'dark' ||
      (!localStorage.getItem('ilmtest_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ilmtest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ilmtest_theme', 'light');
    }
  };

  useEffect(() => {
    if (currentUser) {
      setNotifications(StorageService.getNotifications(currentUser.id));
    }
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    if (currentUser) {
      StorageService.markAllNotificationsAsRead(currentUser.id);
      setNotifications(StorageService.getNotifications(currentUser.id));
    }
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setShowProfileMenu(false);
    onNavigate('landing');
  };

  const handleDemoSwitch = (role: UserRole) => {
    const users = StorageService.getUsers();
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
      StorageService.setCurrentUser(demoUser);
      onSelectRole(role);
      setShowProfileMenu(false);
      if (role === 'STUDENT') onNavigate('student');
      else if (role === 'TEACHER') onNavigate('teacher');
      else if (role === 'SUPER_ADMIN') onNavigate('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate(currentUser ? (currentUser.role === 'STUDENT' ? 'student' : currentUser.role === 'TEACHER' ? 'teacher' : 'admin') : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                    IlmTest
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                    Pro
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5">
                  Online Baholash Platformasi
                </div>
              </div>
            </button>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md hidden lg:block mx-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Testlar, guruhlar yoki mavzularni qidirish..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800/70 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Telegram Simulator Button */}
            <button
              onClick={onOpenTelegramSim}
              title="Telegram Bot Simulyatori"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800/60 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telegram Bot</span>
            </button>

            {/* Load Test 500-Users Button */}
            <button
              onClick={onOpenLoadTest}
              title="500 foydalanuvchi yuklama testi"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden md:inline">500 User Test</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Mavzuni o'zgartirish"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  aria-label="Bildirishnomalar"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                        Bildirishnomalar ({notifications.length})
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Barchasini o'qilgan qilish
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          Yangi bildirishnomalar yo'q
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 text-xs transition-colors ${
                              n.isRead ? 'opacity-70' : 'bg-indigo-50/40 dark:bg-indigo-950/20'
                            }`}
                          >
                            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                              {n.title}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {n.message}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.firstName}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {currentUser.firstName} {currentUser.lastName[0]}.
                    </div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {currentUser.role === 'SUPER_ADMIN' ? 'Admin' : currentUser.role === 'TEACHER' ? 'O\'qituvchi' : 'O\'quvchi'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {currentUser.phone}
                      </div>
                    </div>

                    {/* Quick Demo Switchers */}
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Tezkor rol almashtirish (Demo)
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleDemoSwitch('STUDENT')}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg flex items-center justify-between ${
                            currentUser.role === 'STUDENT' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>O'quvchi (Ali Valiyev)</span>
                          {currentUser.role === 'STUDENT' && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDemoSwitch('TEACHER')}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg flex items-center justify-between ${
                            currentUser.role === 'TEACHER' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>O'qituvchi (Dilshod R.)</span>
                          {currentUser.role === 'TEACHER' && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDemoSwitch('SUPER_ADMIN')}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg flex items-center justify-between ${
                            currentUser.role === 'SUPER_ADMIN' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>Super Admin (Azizbek R.)</span>
                          {currentUser.role === 'SUPER_ADMIN' && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenDevices();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Laptop className="w-4 h-4 text-slate-400" />
                        Ulangan qurilmalar
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Tizimdan chiqish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Kirish / Ro'yxat
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

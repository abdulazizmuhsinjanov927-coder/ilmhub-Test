import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Users2,
  BookOpen,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  History,
  Settings,
  Laptop,
  Activity,
  Send,
  Sparkles,
  Award,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { User, UserRole } from '../../types';

interface SidebarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
  onOpenWordImport?: () => void;
  onOpenCreateTest?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  isOpen,
  onCloseMobile,
  onOpenWordImport,
  onOpenCreateTest
}) => {
  if (!currentUser) return null;

  const role = currentUser.role;

  const renderNavButton = (viewId: string, label: string, icon: React.ReactNode, badge?: string) => {
    const isActive = currentView === viewId;
    return (
      <button
        key={viewId}
        onClick={() => {
          onNavigate(viewId);
          if (onCloseMobile) onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
            {icon}
          </span>
          <span>{label}</span>
        </div>
        {badge && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6 overflow-y-auto">
          
          {/* Quick Action Button for Teacher */}
          {role === 'TEACHER' && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (onOpenCreateTest) onOpenCreateTest();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                Yangi test yaratish
              </button>
              <button
                onClick={() => {
                  if (onOpenWordImport) onOpenWordImport();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Word (.docx) import
              </button>
            </div>
          )}

          {/* Navigation Items based on Role */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Asosiy bo'limlar
            </div>

            {role === 'STUDENT' && (
              <>
                {renderNavButton('student', 'Bosh sahifa', <LayoutDashboard className="w-4 h-4" />)}
                {renderNavButton('student-tests', 'Mavjud testlar', <FileCheck2 className="w-4 h-4" />)}
                {renderNavButton('student-results', 'Mening natijalarim', <Award className="w-4 h-4" />)}
                {renderNavButton('student-profile', 'Mening profilim', <Users2 className="w-4 h-4" />)}
              </>
            )}

            {role === 'TEACHER' && (
              <>
                {renderNavButton('teacher', 'Boshqaruv paneli', <LayoutDashboard className="w-4 h-4" />)}
                {renderNavButton('teacher-tests', 'Testlar boshqaruvi', <FileCheck2 className="w-4 h-4" />)}
                {renderNavButton('teacher-groups', 'Guruhlar & Kodlar', <Users2 className="w-4 h-4" />)}
                {renderNavButton('teacher-books', 'Kitoblar & Mavzular', <BookOpen className="w-4 h-4" />)}
                {renderNavButton('teacher-questions', 'Savollar banki', <HelpCircle className="w-4 h-4" />)}
                {renderNavButton('teacher-analytics', 'Natijalar & Hisobotlar', <BarChart3 className="w-4 h-4" />)}
              </>
            )}

            {role === 'SUPER_ADMIN' && (
              <>
                {renderNavButton('admin', 'Boshqaruv paneli', <ShieldCheck className="w-4 h-4" />)}
                {renderNavButton('admin-users', 'Foydalanuvchilar', <Users2 className="w-4 h-4" />)}
                {renderNavButton('admin-tests', 'Barcha testlar', <FileCheck2 className="w-4 h-4" />)}
                {renderNavButton('admin-audit', 'Audit jurnali', <History className="w-4 h-4" />)}
                {renderNavButton('admin-settings', 'Platforma sozlamalari', <Settings className="w-4 h-4" />)}
              </>
            )}
          </div>
        </div>

        {/* Bottom Role Info Card */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Server: Online
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              500+ o'quvchi bir vaqtda test topshirishiga tayyor.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

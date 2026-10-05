import React from 'react';
import { Home, FileCheck2, Award, User } from 'lucide-react';
import { UserRole } from '../../types';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole?: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate, userRole }) => {
  const items = userRole === 'TEACHER' ? [
    { id: 'teacher', label: 'Dashboard', icon: Home },
    { id: 'teacher-tests', label: 'Testlar', icon: FileCheck2 },
    { id: 'teacher-analytics', label: 'Natijalar', icon: Award },
    { id: 'teacher-groups', label: 'Guruhlar', icon: User }
  ] : [
    { id: 'student', label: 'Bosh sahifa', icon: Home },
    { id: 'student-tests', label: 'Testlar', icon: FileCheck2 },
    { id: 'student-results', label: 'Natijalar', icon: Award },
    { id: 'student-profile', label: 'Profil', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden pb-safe">
      <div className="grid grid-cols-4 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

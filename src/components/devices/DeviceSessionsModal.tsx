import React, { useState, useEffect } from 'react';
import { X, Smartphone, Laptop, Tablet, ShieldAlert, LogOut, CheckCircle } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { DeviceSession, User } from '../../types';

interface DeviceSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const DeviceSessionsModal: React.FC<DeviceSessionsModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);

  const refreshSessions = () => {
    if (!currentUser) return;
    const all = StorageService.getDeviceSessions();
    const userSessions = all.filter(s => s.userId === currentUser.id);
    setSessions(userSessions);
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      refreshSessions();
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleRevokeOne = (sessionId: string) => {
    StorageService.terminateSession(sessionId);
    refreshSessions();
  };

  const handleRevokeAllOther = () => {
    StorageService.terminateAllOtherSessions(currentUser.id);
    refreshSessions();
  };

  const getDeviceIcon = (type: DeviceSession['deviceType']) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-violet-500" />;
      case 'desktop':
      default:
        return <Laptop className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Ulangan qurilmalar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Accountga ulangan faol sessiyalar va xavfsizlik nazorati
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Faol qurilmalar ({sessions.length})
            </span>
            {sessions.filter(s => !s.isCurrent).length > 0 && (
              <button
                onClick={handleRevokeAllOther}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Boshqa barcha qurilmalardan chiqish
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto pr-1">
            {sessions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Faol qurilmalar mavjud emas
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {session.browser} • {session.os}
                        </span>
                        {session.isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Hozirgi qurilma
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        IP: {session.ip} • Kirilgan: {new Date(session.loginTime).toLocaleDateString('uz-UZ')}
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeOne(session.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
                    >
                      Chiqarish
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              Agar ro'yxatda sizga notanish qurilma bo'lsa, zudlik bilan barcha boshqa qurilmalardan chiqish tugmasini bosing.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

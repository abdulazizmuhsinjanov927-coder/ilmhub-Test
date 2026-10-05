import React, { useState } from 'react';
import { X, Send, ShieldCheck, Phone, UserCheck, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { TelegramService } from '../../services/telegramBot';
import { User, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  
  // Verification step
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setPhone(val);
  };

  const startCountdown = () => {
    setCountdown(45);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = phone.replace(/[^\d+]/g, '');
    if (clean.length < 13) {
      setErrorMsg('Telefon raqamini to\'liq kiriting: +998 (XX) XXX-XX-XX');
      return;
    }

    if (mode === 'register' && (!firstName.trim() || !lastName.trim())) {
      setErrorMsg('Ism va familiyangizni to\'liq kiriting.');
      return;
    }

    const res = TelegramService.sendVerificationCode(clean);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setIsVerifying(true);
    setGeneratedCode(res.code || null);
    setSuccessMsg(res.message);
    startCountdown();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = phone.replace(/[^\d+]/g, '');
    const verifyRes = TelegramService.verifyCode(clean, code);

    if (!verifyRes.success) {
      setErrorMsg(verifyRes.message);
      return;
    }

    // Verification succeeded
    const existingUsers = StorageService.getUsers();
    let user = existingUsers.find(u => u.phone.replace(/[^\d+]/g, '') === clean);

    if (user) {
      if (user.isBlocked) {
        setErrorMsg('Ushbu hisob administrator tomonidan bloklangan.');
        return;
      }
      StorageService.setCurrentUser(user);
      onSuccess(user);
      onClose();
    } else {
      // Create new user account
      const newUser = StorageService.createUser({
        phone: clean,
        firstName: firstName.trim() || 'Foydalanuvchi',
        lastName: lastName.trim() || '',
        role: role,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
        telegramId: Math.floor(100000000 + Math.random() * 900000000).toString(),
        telegramUsername: firstName.toLowerCase() + '_' + Math.floor(Math.random() * 1000),
        isBlocked: false,
      });

      StorageService.setCurrentUser(newUser);
      onSuccess(newUser);
      onClose();
    }
  };

  const handleQuickDemo = (userRole: UserRole) => {
    const users = StorageService.getUsers();
    const demo = users.find(u => u.role === userRole);
    if (demo) {
      StorageService.setCurrentUser(demo);
      onSuccess(demo);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVerifying ? 'Telegram Tasdiqlash' : mode === 'register' ? 'O\'quvchi ro\'yxatdan o\'tish' : 'Tizimga kirish'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              SMS ishlatilmaydi. Xavfsiz Telegram kodi orqali tasdiqlash.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isVerifying ? (
            <form onSubmit={handleSendCode} className="space-y-3.5">
              {/* Mode Toggle */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className={`py-2 rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Ro'yxatdan o'tish
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className={`py-2 rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Kirish
                </button>
              </div>

              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ism *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ali"
                        className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Familiya *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Valiyev"
                        className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Rol
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none"
                    >
                      <option value="STUDENT">O'quvchi</option>
                      <option value="TEACHER">O'qituvchi</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon raqami (+998) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Telegram orqali kod olish
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {phone} raqamiga kod yuborildi
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Telegram boti orqali kelgan 6 xonali tasdiqlash kodini kiriting
                </div>

                {generatedCode && (
                  <div className="mt-2.5 inline-block px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-mono font-semibold">
                    Simulyator kodi: <strong>{generatedCode}</strong>
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition active:scale-98 flex items-center justify-center gap-2"
              >
                Tasdiqlash va kirish
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerifying(false)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Raqamni o'zgartirish
                </button>
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  className={`text-indigo-600 dark:text-indigo-400 font-medium ${
                    countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
                  }`}
                >
                  {countdown > 0 ? `Qayta yuborish (${countdown}s)` : 'Kodni qayta yuborish'}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Tezkor sinov hisoblari (1-bosishda)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickDemo('STUDENT')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 text-left text-xs transition"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">O'quvchi</div>
                <div className="text-[10px] text-slate-400">Ali Valiyev</div>
              </button>
              <button
                onClick={() => handleQuickDemo('TEACHER')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 text-left text-xs transition"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">O'qituvchi</div>
                <div className="text-[10px] text-slate-400">Dilshod R.</div>
              </button>
              <button
                onClick={() => handleQuickDemo('SUPER_ADMIN')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 text-left text-xs transition"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">Admin</div>
                <div className="text-[10px] text-slate-400">Azizbek R.</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

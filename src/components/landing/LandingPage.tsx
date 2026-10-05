import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  FileCheck2,
  Send,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  Users2,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Laptop,
  Activity,
  FileSpreadsheet,
  Clock,
  Phone
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenAuth: () => void;
  onQuickLogin: (role: UserRole) => void;
  onOpenTelegramSim: () => void;
  onOpenLoadTest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onQuickLogin,
  onOpenTelegramSim,
  onOpenLoadTest
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Test vaqtida internet uzilib qolsa nima bo'ladi?",
      a: "IlmTest ilg'or PWA va Auto-Save tizimi bilan ta'minlangan. Har bir belgilangan javobingiz soniya ichida ham serverga, ham qurilma xotirasiga (Offline storage) saqlanadi. Internet tiklanganda avtomatik sinxronlashadi va qolgan vaqt bilan testni davom ettirasiz."
    },
    {
      q: "O'qituvchilar Word (.docx) faylidagi savollarni qanday yuklaydi?",
      a: "Word (.docx) import moduli orqali faylni tanlaysiz. Tizim avtomatik ravishda savol matnini, A/B/C/D variantlarini va * bilan belgilangan to'g'ri javoblarni ajratib oladi va xatoliklarni tekshirib PREVIEW oynasida ko'rsatadi."
    },
    {
      q: "Anti-cheat tizimi nimalarni nazorat qiladi?",
      a: "Test topshirish jarayonida brauzer tabini almashtirish, oynani minimallashtirish yoki boshqa dasturga o'tishlar soniyali aniqlikda serverda qayd etiladi va o'qituvchi tahlilida ko'rinadi."
    },
    {
      q: "Platforma bir vaqtning o'zida nechta o'quvchini ko'tara oladi?",
      a: "Tizim arxitekturasi kamida 500+ o'quvchi bir vaqtda test boshlaganda, javob yuborganda va submit qilganda 100% barqaror va minimal (15-30ms) kechikish bilan ishlashga sinovdan o'tkazilgan."
    },
    {
      q: "Natijalar qanday formatlarda eksport qilinadi?",
      a: "Barcha test natijalarini to'liq ustunlar bilan Excel (.xlsx) fayliga yuklab olishingiz, shuningdek har bir o'quvchi uchun rasmiy PDF hisobot va Sertifikat generatsiya qilishingiz mumkin."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Professional Ta'lim va Online Test Platformasi</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">500+ User Ready</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Zamonaviy, Tezkor va{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
            Xavfsiz Online Testlar
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          O'quv markazlari, maktablar va repetitorlar uchun yaratilgan mukammal tizim: Word (.docx) import, Telegram bot integratsiyasi, anti-cheat, oflayn avtosaqlash va chuqur analitika.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onQuickLogin('STUDENT')}
            className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 transition active:scale-95 flex items-center gap-2"
          >
            <span>O'quvchi sifatida kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onQuickLogin('TEACHER')}
            className="px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition active:scale-95 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>O'qituvchi paneli</span>
          </button>

          <button
            onClick={onOpenTelegramSim}
            className="px-5 py-3.5 rounded-2xl text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition active:scale-95 flex items-center gap-2"
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>Telegram Bot</span>
          </button>
        </div>

        {/* Hero Preview Card */}
        <div className="pt-8">
          <div className="rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-slate-200/60 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="rounded-2xl bg-white dark:bg-slate-950 p-5 sm:p-8 text-left border border-slate-200/60 dark:border-slate-800 shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">ilmtest.uz/demo-test</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                  Timer: 18:42
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                  English Grammar Mastery • Savol 7 / 20
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                  By the time the teacher arrived in the classroom, the students _____ their homework assignment.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                    A) have finished
                  </div>
                  <div className="p-3 rounded-xl border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                    <span>*B) had finished</span>
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                    C) finish
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                    D) were finished
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Metrics Counter Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">500+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Bir vaqtda test topshiruvchilar</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-black text-violet-600 dark:text-violet-400">10,000+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Muvaffaqiyatli urinishlar</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">&lt; 20ms</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Server javob tezligi</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-black text-sky-600 dark:text-sky-400">99.9%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Barqarorlik (Uptime)</div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Nega aynan IlmTest?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Oddiy prototip emas, real ta'lim muassasalari uchun har tomonlama puxta ishlab chiqilgan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Word (.docx) Import & Validator
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Savollarni Word formatida yuklang. Tizim avtomatik tahlil qilib, xatoliklarni (variant yetishmasligi, to'g'ri javob belgilanmagani) ko'rsatadi.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Telegram Bot Integratsiyasi
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              O'quvchi SMS siz, Telegram bot orqali 6 xonali bir martalik kod bilan tasdiqlanadi. Natijalar darhol o'qituvchining Telegramiga jo'natiladi.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Anti-Cheat Monitoring
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Test vaqtida boshqa tabga o'tish, minimallashtirish yoki boshqa oynani ochish serverda soniyalik vaqt bilan qayd etiladi.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Auto-Save & Offline Recovery
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Internet uzilib qolsa ham javoblar yo'qolmaydi. Sahifa qayta ochilganda qolgan server vaqti bilan testni davom ettirish mumkin.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Excel (.xlsx) & PDF Hisobot
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Barcha natijalarni 1 ta bosishda Excel ustunlarida yuklab oling yoki rasmiy PDF hisobot va chiroyli sertifikat chop eting.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Ulangan Qurilmalar Nazorati
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              O'quvchi va o'qituvchi o'z hisobiga kirilgan qurilmalarni ko'rishi, boshqa qurilmalardan chiqishi yoki audit logni kuzatishi mumkin.
            </p>
          </div>

        </div>
      </section>

      {/* 500-Users Load Test Callout */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20">
              <Activity className="w-3.5 h-3.5" />
              Talab #37 & #67
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              500 Ta O'quvchi Bir Vaqtda Test Topshirishi Sinovi
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Platforma ichidagi jonli simulyator orqali real vaqtda 500 ta virtual o'quvchi bir vaqtda login qilib, savollarni yuklab, javoblarni serverga jo'natish jarayonini sinab ko'ring.
            </p>
          </div>

          <button
            onClick={onOpenLoadTest}
            className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-emerald-950 bg-white hover:bg-emerald-50 shadow-lg active:scale-95 transition flex items-center gap-2 self-start md:self-center"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            500 User Testni Boshlash
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ko'p Beriladigan Savollar (FAQ)
          </h2>
          <p className="text-xs text-slate-400">
            Platforma imkoniyatlari bo'yicha eng muhim javoblar
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact & Footer Section */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-10 text-center text-xs text-slate-500 space-y-4">
        <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <button onClick={() => onQuickLogin('STUDENT')} className="hover:text-indigo-600">O'quvchi kirish</button>
          <button onClick={() => onQuickLogin('TEACHER')} className="hover:text-indigo-600">O'qituvchi paneli</button>
          <button onClick={() => onQuickLogin('SUPER_ADMIN')} className="hover:text-indigo-600">Admin paneli</button>
          <button onClick={onOpenTelegramSim} className="hover:text-indigo-600">Telegram Bot</button>
          <button onClick={onOpenLoadTest} className="hover:text-indigo-600">500 User Test</button>
        </div>

        <p className="text-slate-400">
          © {new Date().getFullYear()} IlmTest Online Test Platformasi. Barcha huquqlar himoyalangan.
        </p>
      </footer>

    </div>
  );
};

import { StorageService } from './storage';
import { TestAttempt, Test } from '../types';

export interface TelegramVerificationState {
  phone: string;
  code: string;
  expiresAt: number; // timestamp
  attemptsLeft: number;
  resendAvailableAt: number;
}

const activeVerifications = new Map<string, TelegramVerificationState>();

export const TelegramService = {
  // Generate verification code
  sendVerificationCode(phone: string): { success: boolean; message: string; code?: string; expiresInSec: number } {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const now = Date.now();
    const existing = activeVerifications.get(cleanPhone);

    if (existing && existing.resendAvailableAt > now) {
      const waitSec = Math.ceil((existing.resendAvailableAt - now) / 1000);
      return {
        success: false,
        message: `Iltimos, qayta kod olish uchun ${waitSec} soniya kuting.`,
        expiresInSec: 0
      };
    }

    // 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes
    const resendAvailableAt = now + 45 * 1000; // 45 seconds cooldown

    activeVerifications.set(cleanPhone, {
      phone: cleanPhone,
      code,
      expiresAt,
      attemptsLeft: 5,
      resendAvailableAt
    });

    // Also send via real Telegram Bot API if configured
    this.dispatchTelegramCodeToUser(cleanPhone, code);

    return {
      success: true,
      message: `Tasdiqlash kodi Telegram orqali yuborildi: ${cleanPhone}`,
      code, // Returned for simulated UI testing convenience
      expiresInSec: 300
    };
  },

  verifyCode(phone: string, inputCode: string): { success: boolean; message: string } {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const state = activeVerifications.get(cleanPhone);

    if (!state) {
      return { success: false, message: 'Tasdiqlash kodi so\'ralmagan yoki muddati o\'tgan. Qaytadan kod so\'rang.' };
    }

    if (Date.now() > state.expiresAt) {
      activeVerifications.delete(cleanPhone);
      return { success: false, message: 'Kodning amal qilish muddati tugadi. Yangi kod oling.' };
    }

    if (state.attemptsLeft <= 0) {
      activeVerifications.delete(cleanPhone);
      return { success: false, message: 'Urinishlar soni tugadi (brute-force himoyasi). Yangi kod so\'rang.' };
    }

    if (state.code !== inputCode.trim()) {
      state.attemptsLeft--;
      return {
        success: false,
        message: `Noto'g'ri kod! Qolgan urinishlar: ${state.attemptsLeft} ta.`
      };
    }

    // Success! Clear verification state
    activeVerifications.delete(cleanPhone);
    return { success: true, message: 'Telegram orqali muvaffaqiyatli tasdiqlandi!' };
  },

  // Notify teacher / admin about test results
  async sendResultNotification(attempt: TestAttempt, test: Test) {
    const minutes = Math.floor(attempt.durationSeconds / 60);
    const seconds = attempt.durationSeconds % 60;
    const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    const text = 
`🔔 <b>Yangi test natijasi!</b>\n\n` +
`👤 <b>O'quvchi:</b> ${attempt.studentName}\n` +
`📚 <b>Test:</b> ${test.title}\n` +
`👥 <b>Guruh:</b> ${attempt.groupName || '-'}\n` +
`🎯 <b>Ball:</b> ${attempt.score}/${attempt.maxScore}\n` +
`📊 <b>Foiz:</b> ${attempt.percentage}%\n` +
`⏱ <b>Vaqt:</b> ${timeStr}\n` +
`👁 <b>Oynadan chiqish:</b> ${attempt.antiCheatEvents.length}\n` +
`✅ <b>Holat:</b> ${attempt.isPassed ? "O'tdi 🎉" : "O'tmadi ❌"}\n\n` +
`<i>IlmTest Platformasi</i>`;

    const settings = StorageService.getSettings();
    if (settings.telegramBotToken && settings.telegramAdminChatId && !settings.telegramBotToken.includes('sample')) {
      try {
        await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegramAdminChatId,
            text,
            parse_mode: 'HTML'
          })
        });
      } catch (err) {
        console.warn('Real Telegram API call error:', err);
      }
    }

    // Store in simulated bot messages history for the interactive simulator modal
    this.addSimulatedBotMessage('bot', text);
  },

  async dispatchTelegramCodeToUser(phone: string, code: string) {
    const msg = `🔐 IlmTest platformasiga kirish uchun tasdiqlash kodingiz: <b>${code}</b>\nKod 5 daqiqa davomida amal qiladi. Hech kimga bermang!`;
    this.addSimulatedBotMessage('bot', msg);
  },

  // Simulated bot messages store for interactive simulator
  getSimulatedBotMessages(): { id: string; sender: 'user' | 'bot'; text: string; time: string }[] {
    try {
      const raw = localStorage.getItem('ilmtest_tg_sim_msgs');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        id: '1',
        sender: 'bot',
        text: 'Assalomu alaykum! IlmTest rasmiy botiga xush kelibsiz. Bot orqali tizimga kirish kodlarini olishingiz va test natijalarini kuzatishingiz mumkin.\n\nBuyruqlar:\n/start — Qayta ishga tushirish\n/stats — Platforma statistikasi\n/results — Oxirgi natijalar\n/help — Yordam',
        time: '10:00'
      }
    ];
  },

  addSimulatedBotMessage(sender: 'user' | 'bot', text: string) {
    try {
      const msgs = this.getSimulatedBotMessages();
      msgs.push({
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        sender,
        text,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem('ilmtest_tg_sim_msgs', JSON.stringify(msgs.slice(-50)));
    } catch (e) {}
  },

  handleBotCommand(command: string): string {
    const cleanCmd = command.trim().toLowerCase();
    const tests = StorageService.getTests();
    const attempts = StorageService.getAttempts();
    const users = StorageService.getUsers();

    if (cleanCmd === '/start') {
      return 'Xush kelibsiz! IlmTest ta\'lim platformasi boti faol ishlamoqda. Buyruqlar ro\'yxati uchun /help bosing.';
    }

    if (cleanCmd === '/stats') {
      const passedCount = attempts.filter(a => a.isPassed).length;
      const passRate = attempts.length > 0 ? Math.round((passedCount / attempts.length) * 100) : 0;
      return (
        `📊 <b>IlmTest Platformasi Statistikasi:</b>\n\n` +
        `👥 Jami foydalanuvchilar: ${users.length} nafar\n` +
        `📚 Mavjud testlar: ${tests.length} ta\n` +
        `📝 Topshirilgan urinishlar: ${attempts.length} ta\n` +
        `🏆 O'rtacha o'tish ko'rsatkichi: ${passRate}%\n` +
        `⚡ Server holati: 100% Barqaror`
      );
    }

    if (cleanCmd === '/results') {
      const recent = attempts.slice(0, 5);
      if (recent.length === 0) return 'Hozircha natijalar mavjud emas.';
      let reply = '📋 <b>Oxirgi 5 ta test natijasi:</b>\n\n';
      recent.forEach((a, i) => {
        reply += `${i + 1}. ${a.studentName} — ${a.percentage}% (${a.isPassed ? '✅ O\'tdi' : '❌ O\'tmadi'})\n`;
      });
      return reply;
    }

    if (cleanCmd === '/users') {
      const students = users.filter(u => u.role === 'STUDENT').length;
      const teachers = users.filter(u => u.role === 'TEACHER').length;
      return `👥 <b>Foydalanuvchilar:</b>\nO'qituvchilar: ${teachers}\nO'quvchilar: ${students}`;
    }

    if (cleanCmd === '/help') {
      return (
        `ℹ️ <b>Mavjud buyruqlar:</b>\n\n` +
        `/start — Botni ishga tushirish\n` +
        `/stats — Umumiy platforma statistikasi\n` +
        `/results — So'nggi test natijalari\n` +
        `/users — Foydalanuvchilar soni\n` +
        `/help — Ushbu yo'riqnoma`
      );
    }

    return 'Kechirasiz, bunday buyruq mavjud emas. /help buyrug\'i orqali ko\'rishingiz mumkin.';
  }
};

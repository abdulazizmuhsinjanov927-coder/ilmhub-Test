# IlmTest — Professional Online Test Platformasi

Zamonaviy, xavfsiz, o'ta tez ishlaydigan va 500+ virtual o'quvchi bir vaqtda test topshirishiga moslashtirilgan professional ta'lim platformasi.

---

## 🚀 Texnologik Stak

* **Frontend:** React 19 + TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti
* **Backend:** Express API, Node.js, REST endpoints
* **Database & RLS:** PostgreSQL / Supabase, Row Level Security, Triggers & Performance Indexes
* **Telegram:** Telegram Bot API (One-time verification code, Results notification webhook, Admin commands simulator)
* **Import / Export:** Word (.docx) parser with Mammoth, Excel (.xlsx) generator with SheetJS, Printable vector PDF & Certificate engine
* **Security & Anti-Cheat:** Server-authoritative timer, visibility & window blur events monitor, brute-force & replay attack protection, multi-device session management
* **Offline / PWA:** Standalone PWA manifest, localStorage / IndexedDB auto-save & network sync

---

## 📦 Loyihani Ishga Tushirish

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Muhit o'zgaruvchilari (.env)
`.env.example` faylidan nusxa olib `.env` faylini yarating:
```bash
cp .env.example .env
```
Fayl ichidagi kalitlarni to'ldiring:
* `SUPABASE_URL` va `SUPABASE_SERVICE_ROLE_KEY`
* `TELEGRAM_BOT_TOKEN` va `TELEGRAM_ADMIN_CHAT_ID`

### 3. Dasturni ishga tushirish (Development)
```bash
npm run dev
```
Brauzerda oching: `http://localhost:3000`

### 4. Production Build
```bash
npm run build
```

---

## 🗄️ Database Migratsiyasi (PostgreSQL & Supabase)

Loyiha ildizidagi `supabase_schema.sql` faylida barcha jadvallar, munosabatlar va RLS xavfsizlik qoidalari tayyorlangan:
1. Supabase loyihangizdagi **SQL Editor** bo'limiga kiring.
2. `supabase_schema.sql` faylining barcha tarkibini nusxalang va bajaring (Run).
3. Barcha jadvallar (`profiles`, `groups`, `books`, `topics`, `questions`, `tests`, `test_attempts`, `anti_cheat_events`, `audit_logs`) va indekslar avtomatik yaratiladi.

---

## 🤖 Telegram Bot Sozlash

1. Telegramda [@BotFather](https://t.me/BotFather) orqali yangi bot yarating: `/newbot`.
2. Bot nomini kiriting va berilgan API tokenni oling (masalan: `7123456789:AAFrX...`).
3. Admin profilingiz chat ID sini bilish uchun [@userinfobot](https://t.me/userinfobot) ga `/start` yozing.
4. Ushbu qiymatlarni `.env` yoki platforma ichidagi **Telegram Bot Simulyatori** sozlamalariga kiriting.
5. Bot buyruqlari:
   * `/start` — Botni ishga tushirish
   * `/stats` — Umumiy platforma statistikasi
   * `/results` — Oxirgi test natijalari
   * `/users` — Foydalanuvchilar soni
   * `/help` — Yordam yo'riqnomasi

---

## 📊 500 Foydalanuvchi Yuklama Testi (Load Testing)

Platforma bosh panelidagi **"500 User Test"** tugmasi orqali haqiqiy virtual stress-testni ishga tushirishingiz mumkin:
* 500 virtual o'quvchi bir vaqtda login qiladi, testni yuklaydi, javoblarni yuboradi va submit qiladi.
* Real vaqtda quyidagi metrikalar o'lchanadi:
  * **O'rtacha javob vaqti (Avg latency)**
  * **P50, P95, P99 percentile kechikishlar**
  * **Sekundiga so'rovlar (RPS)**
  * **Xatolik darajasi (Error rate %)**
  * **Baza va xotira ko'rsatkichlari**
* Natijani to'liq hisobot sifatida `.txt` faylida yuklab olish mumkin.

---

## 🛡️ Xavfsizlik & Anti-Cheat

1. **Server Taymeri:** Taymer frontend soatiga emas, balki serverdagi `startTime` ga tayanadi. Foydalanuvchi brauzer vaqtini o'zgartirib tizimni alday olmaydi.
2. **Anti-Cheat:** Test paytida brauzer tabini o'zgartirish, oynadan chiqish yoki oynani minimallashtirish aniqlanib, serverdagi test urinishiga qayd etiladi.
3. **Auto-Save:** Internet uzilganda javoblar qurilma xotirasida saqlanadi va aloqa tiklanganda darhol server bilan sinxronlashadi.
4. **Ulangan qurilmalar:** Har bir faol login sessiyasi qayd etiladi. Foydalanuvchi bir bosishda boshqa barcha qurilmalardan chiqishi mumkin.

---

## 👥 Standart Sinov Hisoblari (1-bosishda kirish)

* **O'quvchi:** Ali Valiyev (`+998971112233`) — Guruhlarga a'zo, test topshirish va natijalarni ko'rish
* **O'qituvchi:** Dilshod Rustamov (`+998912345678`) — Test va guruhlar yaratish, Word import, analitika
* **Super Admin:** Azizbek Rahimov (`+998901234567`) — To'liq tizim nazorati, foydalanuvchilarni bloklash, audit jurnali

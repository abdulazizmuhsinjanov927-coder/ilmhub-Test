import { TestAttempt, Test, Group } from '../types';

export function printTestResultReport(attempt: TestAttempt, test: Test) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const minutes = Math.floor(attempt.durationSeconds / 60);
  const seconds = attempt.durationSeconds % 60;
  const passedBadge = attempt.isPassed
    ? '<span style="background:#dcfce7;color:#15803d;padding:6px 14px;border-radius:20px;font-weight:700;">MUVAFFAQIYATLI O\'TDI</span>'
    : '<span style="background:#fee2e2;color:#b91c1c;padding:6px 14px;border-radius:20px;font-weight:700;">O\'TA OLMADI</span>';

  const html = `
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="UTF-8">
      <title>IlmTest — Natija Hisoboti: ${attempt.studentName}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 40px; color: #1e293b; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
        .logo { font-size: 26px; font-weight: 800; color: #4f46e5; }
        .badge { font-size: 13px; letter-spacing: 0.5px; }
        .title { font-size: 22px; font-weight: 700; margin: 24px 0 8px 0; color: #0f172a; }
        .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; background: #f8fafc; padding: 20px; border-radius: 12px; }
        .meta-item { font-size: 14px; }
        .meta-label { color: #64748b; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
        .meta-val { font-weight: 600; font-size: 16px; color: #0f172a; }
        .stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
        .stat-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; text-align: center; }
        .stat-num { font-size: 24px; font-weight: 800; color: #4f46e5; }
        .stat-name { font-size: 12px; color: #64748b; margin-top: 4px; }
        .anti-cheat { margin-top: 24px; padding: 16px; border-radius: 8px; background: #fffbeb; border: 1px solid #fef3c7; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">IlmTest Platformasi</div>
          <div style="font-size:13px;color:#64748b;margin-top:4px;">Rasmiy online baholash va test hisoboti</div>
        </div>
        <div class="badge">${passedBadge}</div>
      </div>

      <div class="title">${test.title}</div>
      <div style="color:#64748b;font-size:14px;">Guruh: ${attempt.groupName || '-'} | O'qituvchi: ${test.teacherName}</div>

      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">O'quvchi</div>
          <div class="meta-val">${attempt.studentName}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Telefon raqami</div>
          <div class="meta-val">${attempt.studentPhone || '-'}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Boshlangan vaqt</div>
          <div class="meta-val">${new Date(attempt.startTime).toLocaleString('uz-UZ')}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Tugallangan vaqt</div>
          <div class="meta-val">${attempt.endTime ? new Date(attempt.endTime).toLocaleString('uz-UZ') : '-'}</div>
        </div>
      </div>

      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-num">${attempt.score} / ${attempt.maxScore}</div>
          <div class="stat-name">To'plangan ball</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${attempt.percentage}%</div>
          <div class="stat-name">Muvaffaqiyat ko'rsatkichi</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${minutes}m ${seconds}s</div>
          <div class="stat-name">Sarflangan vaqt</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${attempt.antiCheatEvents.length}</div>
          <div class="stat-name">Oynadan chiqishlar</div>
        </div>
      </div>

      <div class="anti-cheat">
        <div style="font-weight:700;font-size:14px;color:#92400e;margin-bottom:6px;">Anti-cheat monitoring hisoboti</div>
        <div style="font-size:13px;color:#b45309;">
          Test davomida brauzer oynasidan chiqish hodisalari: <strong>${attempt.antiCheatEvents.length} ta</strong> qayd etildi.
        </div>
      </div>

      <div class="footer">
        Ushbu hisobot IlmTest elektron platformasi tomonidan generatsiya qilindi. Hujjat ID: ${attempt.id} | Sana: ${new Date().toLocaleDateString('uz-UZ')}
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printCertificate(attempt: TestAttempt, test: Test) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="UTF-8">
      <title>Sertifikat — ${attempt.studentName}</title>
      <style>
        body { margin: 0; padding: 30px; font-family: Georgia, serif; background: #fff; color: #1e293b; display: flex; justify-content: center; align-items: center; min-height: 100vh; box-sizing: border-box; }
        .cert-container { width: 1000px; padding: 50px 70px; border: 12px double #4f46e5; border-radius: 12px; background: #ffffff; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
        .cert-decor { position: absolute; width: 60px; height: 60px; border: 4px solid #c7d2fe; }
        .top-left { top: 15px; left: 15px; border-right: none; border-bottom: none; }
        .top-right { top: 15px; right: 15px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 15px; left: 15px; border-right: none; border-top: none; }
        .bottom-right { bottom: 15px; right: 15px; border-left: none; border-top: none; }
        
        .platform-title { font-family: system-ui, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #4f46e5; text-transform: uppercase; }
        .cert-header { font-size: 42px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0; letter-spacing: 3px; }
        .cert-sub { font-size: 16px; color: #64748b; font-style: italic; margin-bottom: 30px; font-family: system-ui, sans-serif; }
        .recipient-name { font-size: 38px; font-weight: 700; color: #1e1b4b; border-bottom: 2px solid #e2e8f0; display: inline-block; padding: 0 40px 10px 40px; margin: 10px 0 20px 0; }
        .cert-body { font-size: 18px; color: #334155; line-height: 1.8; max-width: 750px; margin: 0 auto 35px auto; font-family: system-ui, sans-serif; }
        .cert-score { font-weight: 700; color: #4f46e5; }
        .signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding: 0 40px; font-family: system-ui, sans-serif; }
        .sig-block { text-align: center; }
        .sig-line { width: 180px; border-top: 1px solid #94a3b8; margin-bottom: 8px; }
        .sig-title { font-size: 13px; color: #64748b; }
        .seal { width: 90px; height: 90px; border-radius: 50%; border: 3px dashed #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #4f46e5; text-transform: uppercase; margin: 0 auto; letter-spacing: 1px; }
        @media print {
          body { padding: 0; min-height: auto; }
          .cert-container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="cert-container">
        <div class="cert-decor top-left"></div>
        <div class="cert-decor top-right"></div>
        <div class="cert-decor bottom-left"></div>
        <div class="cert-decor bottom-right"></div>

        <div class="platform-title">IlmTest Ta'lim Akademiyasi</div>
        <div class="cert-header">SERTIFIKAT</div>
        <div class="cert-sub">Muvaffaqiyatli yakunlanganlik to'g'risida</div>

        <div class="recipient-name">${attempt.studentName}</div>

        <div class="cert-body">
          Ushbu sertifikat tasdiqlaydiki, ushbu o'quvchi <strong>"${test.title}"</strong> kursi bo'yicha online test sinovini 
          <span class="cert-score">${attempt.percentage}% (${attempt.score}/${attempt.maxScore} ball)</span> natija bilan a'lo darajada topshirdi.
        </div>

        <div class="seal">ILMTEST<br>TASDIQ</div>

        <div class="signatures">
          <div class="sig-block">
            <div class="sig-line"></div>
            <div style="font-weight:600;font-size:14px;">${test.teacherName}</div>
            <div class="sig-title">Fan o'qituvchisi</div>
          </div>
          <div class="sig-block">
            <div style="font-size:13px;color:#64748b;margin-bottom:8px;">ID: ${attempt.id.toUpperCase()}</div>
            <div class="sig-line"></div>
            <div style="font-weight:600;font-size:14px;">${new Date().toLocaleDateString('uz-UZ')}</div>
            <div class="sig-title">Berilgan sana</div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

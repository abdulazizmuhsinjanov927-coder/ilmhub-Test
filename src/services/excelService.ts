import * as XLSX from 'xlsx';
import { TestAttempt, Test } from '../types';

export function exportAttemptsToExcel(attempts: TestAttempt[], testTitle?: string) {
  const rows = attempts.map((att, index) => {
    const studentParts = (att.studentName || '').split(' ');
    const firstName = studentParts[0] || '';
    const lastName = studentParts.slice(1).join(' ') || '';

    const minutes = Math.floor(att.durationSeconds / 60);
    const seconds = att.durationSeconds % 60;
    const timeFormatted = `${minutes} daqiqa ${seconds} soniya`;

    const startDate = att.startTime ? new Date(att.startTime).toLocaleString('uz-UZ') : '-';
    const endDate = att.endTime ? new Date(att.endTime).toLocaleString('uz-UZ') : '-';

    return {
      '№': index + 1,
      'Ism': firstName,
      'Familiya': lastName,
      'Telefon': att.studentPhone || '-',
      'Guruh': att.groupName || '-',
      'Test': testTitle || att.testId,
      'Ball': `${att.score} / ${att.maxScore}`,
      'Foiz': `${att.percentage}%`,
      'Holat': att.isPassed ? "O'tdi" : "O'tmadi",
      'Vaqt': timeFormatted,
      'Urinish': att.attemptNumber,
      'Oynadan chiqish': att.antiCheatEvents ? att.antiCheatEvents.length : 0,
      'Boshlangan vaqt': startDate,
      'Tugagan vaqt': endDate
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  const columnWidths = [
    { wch: 6 },  // №
    { wch: 16 }, // Ism
    { wch: 18 }, // Familiya
    { wch: 18 }, // Telefon
    { wch: 25 }, // Guruh
    { wch: 30 }, // Test
    { wch: 12 }, // Ball
    { wch: 10 }, // Foiz
    { wch: 12 }, // Holat
    { wch: 20 }, // Vaqt
    { wch: 10 }, // Urinish
    { wch: 16 }, // Oynadan chiqish
    { wch: 22 }, // Boshlangan vaqt
    { wch: 22 }  // Tugagan vaqt
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Natijalar');

  const safeFilename = (testTitle ? testTitle.replace(/[^a-zA-Z0-9_\-]/g, '_') : 'Natijalar') + '_' + new Date().toISOString().slice(0, 10) + '.xlsx';
  XLSX.writeFile(workbook, safeFilename);
}

export function exportQuestionsTemplateToExcel() {
  const sampleData = [
    {
      'Savol matni': 'O\'zbekiston poytaxti qaysi shahar?',
      'A varianti': 'Samarqand',
      'B varianti': 'Toshkent',
      'C varianti': 'Buxoro',
      'D varianti': 'Xiva',
      'To\'g\'ri javob': 'B',
      'Ball': 2,
      'Qiyinlik (oson/o\'rta/qiyin)': 'oson',
      'Izoh': 'Toshkent — O\'zbekiston Respublikasining rasmiy poytaxti.'
    },
    {
      'Savol matni': 'Kvadratning yuzi formulasi?',
      'A varianti': 'S = a * b',
      'B varianti': 'S = a^2',
      'C varianti': 'S = 2 * (a + b)',
      'D varianti': 'S = a / 2',
      'To\'g\'ri javob': 'B',
      'Ball': 1,
      'Qiyinlik (oson/o\'rta/qiyin)': 'oson',
      'Izoh': 'Kvadrat tomoni teng bo\'lgani uchun S = a².'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Savollar_Shablon');
  XLSX.writeFile(workbook, 'IlmTest_Savollar_Shabloni.xlsx');
}

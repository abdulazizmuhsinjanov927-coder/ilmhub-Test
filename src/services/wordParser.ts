import mammoth from 'mammoth';
import { ParsedQuestionItem, ImportValidationIssue, QuestionType } from '../types';

export async function parseDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export function parseRawQuestionsText(rawText: string): ParsedQuestionItem[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  // Normalize line breaks
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  const questions: ParsedQuestionItem[] = [];
  let currentQuestion: Partial<ParsedQuestionItem> | null = null;
  let currentOptions: { id: string; text: string; isCorrect: boolean }[] = [];
  let questionCounter = 1;
  const seenQuestionTexts = new Set<string>();

  const flushCurrent = () => {
    if (currentQuestion && currentQuestion.questionText) {
      const issues: ImportValidationIssue[] = [];
      const trimmedQText = currentQuestion.questionText.trim();

      // Check duplicates
      const lowerQ = trimmedQText.toLowerCase();
      if (seenQuestionTexts.has(lowerQ)) {
        issues.push({
          questionIndex: questionCounter,
          type: 'warning',
          message: 'Ushbu savol matni avvalroq ham uchradi (ehtimol dublikat).'
        });
      } else {
        seenQuestionTexts.add(lowerQ);
      }

      // Check options
      if (currentOptions.length === 0) {
        issues.push({
          questionIndex: questionCounter,
          type: 'error',
          message: 'Savolda hech qanday javob varianti topilmadi.'
        });
      } else if (currentOptions.length < 4) {
        issues.push({
          questionIndex: questionCounter,
          type: 'warning',
          message: `Variantlar soni ${currentOptions.length} ta (odatda 4 ta bo'ladi).`
        });
      }

      const correctOptions = currentOptions.filter(o => o.isCorrect);
      let correctAnswer: any = null;
      let qType: QuestionType = 'single_choice';

      if (correctOptions.length === 0) {
        issues.push({
          questionIndex: questionCounter,
          type: 'error',
          message: 'To\'g\'ri javob belgilanmagan (* belgisini to\'g\'ri javob oldiga qo\'ying).'
        });
      } else if (correctOptions.length === 1) {
        correctAnswer = correctOptions[0].id;
        qType = 'single_choice';
      } else {
        correctAnswer = correctOptions.map(o => o.id);
        qType = 'multiple_choice';
        issues.push({
          questionIndex: questionCounter,
          type: 'info',
          message: `${correctOptions.length} ta to'g'ri javob topildi (ko'p tanlovli savol).`
        });
      }

      // Check empty options
      currentOptions.forEach((opt, idx) => {
        if (!opt.text.trim()) {
          issues.push({
            questionIndex: questionCounter,
            type: 'error',
            message: `${String.fromCharCode(65 + idx)} varianti matni bo'sh.`
          });
        }
      });

      const hasError = issues.some(i => i.type === 'error');

      questions.push({
        id: 'parsed_' + questionCounter + '_' + Date.now(),
        questionText: trimmedQText,
        type: qType,
        options: currentOptions,
        correctAnswer,
        score: 1,
        difficulty: 'medium',
        explanation: currentQuestion.explanation || '',
        issues,
        isValid: !hasError
      });

      questionCounter++;
    }

    currentQuestion = null;
    currentOptions = [];
  };

  const questionHeaderRegex = /^(\d+)[\.\)\-\s]+(.+)$/i;
  const optionRegex = /^([*+]?)\s*([A-Za-zА-Яа-я])[\.\)\-\:\s]+(.+)$/i;
  const explanationRegex = /^(?:Izoh|Tushuntirish|Explanation)[\:\s]+(.+)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const optMatch = line.match(optionRegex);
    const qMatch = line.match(questionHeaderRegex);
    const expMatch = line.match(explanationRegex);

    if (expMatch && currentQuestion) {
      currentQuestion.explanation = expMatch[1].trim();
      continue;
    }

    if (optMatch && currentQuestion) {
      // It's an option line: e.g. "A) text" or "*B) text" or "+C) text"
      const asterisk = optMatch[1];
      const letter = optMatch[2].toUpperCase();
      let optionText = optMatch[3].trim();
      let isCorrect = asterisk === '*' || asterisk === '+' || optionText.endsWith('*') || optionText.endsWith('(to\'g\'ri)') || optionText.endsWith('(correct)');

      if (optionText.endsWith('*')) {
        optionText = optionText.slice(0, -1).trim();
      }

      currentOptions.push({
        id: 'opt_' + letter.toLowerCase() + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        text: optionText,
        isCorrect
      });
      continue;
    }

    if (qMatch) {
      // New question line
      flushCurrent();
      currentQuestion = {
        questionText: qMatch[2].trim(),
      };
      continue;
    }

    // Line didn't match numbered question or option:
    // If we have an active question with no options yet, append to question text
    if (currentQuestion && currentOptions.length === 0) {
      currentQuestion.questionText += ' ' + line;
    } else if (currentOptions.length > 0) {
      // Append to last option
      const lastOpt = currentOptions[currentOptions.length - 1];
      lastOpt.text += ' ' + line;
    } else {
      // Freeform line starting a question without number
      flushCurrent();
      currentQuestion = {
        questionText: line,
      };
    }
  }

  // Flush remaining
  flushCurrent();

  return questions;
}

// AI-based or smart regex structuring for raw messy text
export function formatRawMessyText(messyText: string): string {
  if (!messyText) return '';
  
  // Format paragraphs into clean numbered format:
  // 1. Question text?
  // A) Option 1
  // *B) Option 2
  // C) Option 3
  // D) Option 4
  const lines = messyText.split('\n').map(l => l.trim()).filter(Boolean);
  const formatted: string[] = [];
  let qNum = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('?') || /^\d+[\.\)]/.test(line)) {
      if (formatted.length > 0) formatted.push('');
      const cleanQ = line.replace(/^\d+[\.\)\s]+/, '');
      formatted.push(`${qNum}. ${cleanQ}`);
      qNum++;
    } else if (/^[a-dA-D][\.\)]/.test(line)) {
      formatted.push(line);
    } else if (line.startsWith('*') || line.startsWith('+')) {
      formatted.push(line);
    } else {
      formatted.push(line);
    }
  }

  return formatted.join('\n');
}

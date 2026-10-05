export type UserRole = 'SUPER_ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  telegramId?: string;
  telegramUsername?: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface DeviceSession {
  id: string;
  userId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  ip: string;
  lastActive: string;
  loginTime: string;
  isCurrent: boolean;
}

export interface Group {
  id: string;
  teacherId: string;
  teacherName: string;
  name: string;
  description: string;
  course: string;
  level: string;
  code: string; // 6-character unique code e.g. "ILM402"
  createdAt: string;
  studentIds: string[];
}

export interface Book {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  coverUrl?: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  bookId: string;
  title: string;
  orderIndex: number;
  description?: string;
}

export type QuestionType =
  | 'single_choice'
  | 'true_false'
  | 'multiple_choice'
  | 'image_question'
  | 'text_question'
  | 'image_options'
  | 'short_answer'
  | 'numeric_answer';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect?: boolean; // For teacher internal model; omitted or secured when sent to student taking active test
}

export interface Question {
  id: string;
  teacherId: string;
  bookId?: string;
  topicId?: string;
  type: QuestionType;
  questionText: string;
  imageUrl?: string;
  passageText?: string; // For text-based reading questions
  score: number;
  difficulty: QuestionDifficulty;
  tags: string[];
  options: QuestionOption[];
  correctAnswer: any; // string, string[], boolean, or number
  explanation?: string;
  createdAt: string;
}

export type TestStatus = 'draft' | 'scheduled' | 'active' | 'closed' | 'archived';

export interface Test {
  id: string;
  teacherId: string;
  teacherName: string;
  groupIds: string[]; // groups assigned
  bookId?: string;
  topicId?: string;
  title: string;
  description: string;
  durationMinutes: number; // e.g. 30
  maxAttempts: number; // e.g. 1 or 3
  passingPercentage: number; // e.g. 70
  maxScore: number;
  startTime?: string;
  endTime?: string;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showResultsImmediately: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  status: TestStatus;
  questionIds: string[];
  createdAt: string;
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'time_expired' | 'cancelled';

export interface AntiCheatEvent {
  id: string;
  attemptId: string;
  eventType: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'page_leave';
  timestamp: string;
  details?: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  groupId: string;
  groupName: string;
  attemptNumber: number;
  startTime: string; // ISO string on server
  endTime?: string;
  durationSeconds: number;
  status: AttemptStatus;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  answers: Record<string, any>; // questionId -> answer
  antiCheatEvents: AntiCheatEvent[];
  questionOrder?: string[]; // Server-fixed order for randomized questions
  optionOrders?: Record<string, string[]>; // questionId -> optionId[]
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetType: 'test' | 'group' | 'student' | 'teacher' | 'attempt' | 'settings' | 'auth' | 'export';
  targetId?: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface PlatformSettings {
  platformName: string;
  platformDescription: string;
  logoText: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultPassingPercentage: number;
  sessionDurationDays: number;
  telegramBotToken: string;
  telegramBotUsername: string;
  telegramAdminChatId: string;
  allowLeaderboards: boolean;
  maintenanceMode: boolean;
}

export interface ImportValidationIssue {
  line?: number;
  questionIndex: number;
  type: 'error' | 'warning' | 'info';
  message: string;
}

export interface ParsedQuestionItem {
  id: string;
  questionText: string;
  type: QuestionType;
  options: { id: string; text: string; isCorrect: boolean }[];
  correctAnswer: any;
  score: number;
  difficulty: QuestionDifficulty;
  explanation?: string;
  issues: ImportValidationIssue[];
  isValid: boolean;
}

export interface LoadTestMetrics {
  totalVirtualUsers: number;
  completedUsers: number;
  failedUsers: number;
  totalRequests: number;
  requestsPerSecond: number;
  avgResponseTimeMs: number;
  minResponseTimeMs: number;
  maxResponseTimeMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  errorRatePercentage: number;
  databaseLatencyMs: number;
  memoryUsageMb: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  finishedAt?: string;
}

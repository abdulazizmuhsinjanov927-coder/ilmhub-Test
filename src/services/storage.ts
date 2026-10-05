import {
  User,
  DeviceSession,
  Group,
  Book,
  Topic,
  Question,
  Test,
  TestAttempt,
  AuditLog,
  AppNotification,
  PlatformSettings,
  AntiCheatEvent
} from '../types';

const STORAGE_KEYS = {
  USERS: 'ilmtest_users_v1',
  CURRENT_USER: 'ilmtest_current_user_v1',
  SESSIONS: 'ilmtest_sessions_v1',
  CURRENT_SESSION_ID: 'ilmtest_current_session_id_v1',
  GROUPS: 'ilmtest_groups_v1',
  BOOKS: 'ilmtest_books_v1',
  TOPICS: 'ilmtest_topics_v1',
  QUESTIONS: 'ilmtest_questions_v1',
  TESTS: 'ilmtest_tests_v1',
  ATTEMPTS: 'ilmtest_attempts_v1',
  AUDIT_LOGS: 'ilmtest_audit_logs_v1',
  NOTIFICATIONS: 'ilmtest_notifications_v1',
  SETTINGS: 'ilmtest_settings_v1',
  TELEGRAM_VERIFICATIONS: 'ilmtest_verifications_v1',
  THEME: 'ilmtest_theme_v1',
};

// Initial Seed Users
const SEED_USERS: User[] = [
  {
    id: 'user_admin_1',
    phone: '+998901234567',
    firstName: 'Azizbek',
    lastName: 'Rahimov',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    telegramId: '987654321',
    telegramUsername: 'aziz_admin',
    isBlocked: false,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'user_teacher_1',
    phone: '+998912345678',
    firstName: 'Dilshod',
    lastName: 'Rustamov',
    role: 'TEACHER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    telegramId: '123456789',
    telegramUsername: 'dilshod_teacher',
    isBlocked: false,
    createdAt: '2026-01-15T11:30:00Z',
  },
  {
    id: 'user_teacher_2',
    phone: '+998933456789',
    firstName: 'Malika',
    lastName: 'Karimova',
    role: 'TEACHER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    telegramId: '234567890',
    telegramUsername: 'malika_edu',
    isBlocked: false,
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 'user_student_1',
    phone: '+998971112233',
    firstName: 'Ali',
    lastName: 'Valiyev',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    telegramId: '345678901',
    telegramUsername: 'ali_valiyev',
    isBlocked: false,
    createdAt: '2026-02-10T14:20:00Z',
  },
  {
    id: 'user_student_2',
    phone: '+998992223344',
    firstName: 'Madina',
    lastName: 'Umarova',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    telegramId: '456789012',
    telegramUsername: 'madina_u',
    isBlocked: false,
    createdAt: '2026-02-12T16:00:00Z',
  },
  {
    id: 'user_student_3',
    phone: '+998903334455',
    firstName: 'Jasur',
    lastName: 'Beknazarov',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    telegramId: '567890123',
    telegramUsername: 'jasur_bek',
    isBlocked: false,
    createdAt: '2026-02-15T08:45:00Z',
  },
  {
    id: 'user_student_4',
    phone: '+998944445566',
    firstName: 'Shahzoda',
    lastName: 'Ergasheva',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    telegramId: '678901234',
    telegramUsername: 'shahzoda_e',
    isBlocked: false,
    createdAt: '2026-02-18T12:10:00Z',
  },
  {
    id: 'user_student_5',
    phone: '+998915556677',
    firstName: 'Bobur',
    lastName: 'Mirzayev',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    telegramId: '789012345',
    telegramUsername: 'bobur_m',
    isBlocked: false,
    createdAt: '2026-02-20T17:30:00Z',
  }
];

// Seed Groups
const SEED_GROUPS: Group[] = [
  {
    id: 'group_eng_1',
    teacherId: 'user_teacher_1',
    teacherName: 'Dilshod Rustamov',
    name: 'Ingliz tili - Intermediate B2',
    description: 'Grammatika, so\'z boyligi va akademik testlar guruhi',
    course: 'General English',
    level: 'B2 Intermediate',
    code: 'ENG402',
    createdAt: '2026-02-01T10:00:00Z',
    studentIds: ['user_student_1', 'user_student_2', 'user_student_3'],
  },
  {
    id: 'group_mat_1',
    teacherId: 'user_teacher_1',
    teacherName: 'Dilshod Rustamov',
    name: 'Matematika - Asosiy guruh (DTM)',
    description: 'Oliy ta\'limga tayyorlov guruhi, algebra va geometriya',
    course: 'Matematika',
    level: 'Abituriyent',
    code: 'MAT101',
    createdAt: '2026-02-05T11:00:00Z',
    studentIds: ['user_student_1', 'user_student_4', 'user_student_5'],
  },
  {
    id: 'group_uzb_1',
    teacherId: 'user_teacher_2',
    teacherName: 'Malika Karimova',
    name: 'Ona tili va adabiyot - Milliy sertifikat',
    description: 'A+ daraja uchun ona tili va adabiyot testlari',
    course: 'Ona tili',
    level: 'Milliy sertifikat',
    code: 'UZB303',
    createdAt: '2026-02-10T12:00:00Z',
    studentIds: ['user_student_2', 'user_student_3', 'user_student_4'],
  },
  {
    id: 'group_ielts_1',
    teacherId: 'user_teacher_1',
    teacherName: 'Dilshod Rustamov',
    name: 'IELTS Intensive 7.5+',
    description: 'Reading, Listening va Vocabulary mock testlar',
    course: 'IELTS',
    level: 'Advanced',
    code: 'IEL700',
    createdAt: '2026-02-15T15:00:00Z',
    studentIds: ['user_student_1', 'user_student_5'],
  }
];

// Seed Books & Topics
const SEED_BOOKS: Book[] = [
  {
    id: 'book_eng_1',
    teacherId: 'user_teacher_1',
    title: 'English Grammar in Practice',
    description: 'Zamonaviy ingliz tili grammatikasi qoidalari va mashqlari',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'book_mat_1',
    teacherId: 'user_teacher_1',
    title: 'Matematika: Algebra va Geometriya',
    description: 'Fundamental tenglamalar, logarifmlar va fazoviy figuralar',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'book_uzb_1',
    teacherId: 'user_teacher_2',
    title: 'Ona tili qoidalari va imlo lug\'ati',
    description: 'Morfologiya, sintaksis va zamonaviy imlo qoidalari',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-02-10T10:00:00Z',
  }
];

const SEED_TOPICS: Topic[] = [
  { id: 'top_eng_1', bookId: 'book_eng_1', title: 'Unit 1: Present & Past Tenses', orderIndex: 1, description: 'Simple, Continuous and Perfect tenses' },
  { id: 'top_eng_2', bookId: 'book_eng_1', title: 'Unit 2: Modals & Conditionals', orderIndex: 2, description: 'First, Second and Third Conditionals' },
  { id: 'top_eng_3', bookId: 'book_eng_1', title: 'Unit 3: Passive Voice & Causatives', orderIndex: 3, description: 'Passive constructions' },
  { id: 'top_mat_1', bookId: 'book_mat_1', title: 'Mavzu 1: Kvadrat tenglamalar va Viyet teoremasi', orderIndex: 1, description: 'Tenglamalar va ildizlar' },
  { id: 'top_mat_2', bookId: 'book_mat_1', title: 'Mavzu 2: Logarifmik ifodalar va tengsizliklar', orderIndex: 2, description: 'Logarifm xossalari' },
  { id: 'top_uzb_1', bookId: 'book_uzb_1', title: '1-qism: Fonetika va orfoepiya', orderIndex: 1, description: 'Tovushlar va urg\'u' },
  { id: 'top_uzb_2', bookId: 'book_uzb_1', title: '2-qism: So\'z turkumlari va morfologiya', orderIndex: 2, description: 'Ot, sifat, fe\'l shakllari' },
];

// Seed Questions (covering all 8 question types)
const SEED_QUESTIONS: Question[] = [
  {
    id: 'q_eng_1',
    teacherId: 'user_teacher_1',
    bookId: 'book_eng_1',
    topicId: 'top_eng_1',
    type: 'single_choice',
    questionText: 'By the time the teacher arrived in the classroom, the students _____ their homework assignment.',
    score: 2,
    difficulty: 'medium',
    tags: ['Grammar', 'Past Perfect', 'B2'],
    options: [
      { id: 'opt_1', text: 'have finished' },
      { id: 'opt_2', text: 'had finished' },
      { id: 'opt_3', text: 'finish' },
      { id: 'opt_4', text: 'were finished' }
    ],
    correctAnswer: 'opt_2',
    explanation: '"By the time" iborasidan keyin o\'tgan zamon harakatidan oldin sodir bo\'lgan voqea uchun Past Perfect (had finished) ishlatiladi.',
    createdAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'q_eng_2',
    teacherId: 'user_teacher_1',
    bookId: 'book_eng_1',
    topicId: 'top_eng_2',
    type: 'true_false',
    questionText: 'The sentence "If I had known about the meeting, I would attend it" is grammatically correct in standard English.',
    score: 1,
    difficulty: 'medium',
    tags: ['Conditionals', 'Mixed Conditionals'],
    options: [
      { id: 'opt_tf_1', text: 'True' },
      { id: 'opt_tf_2', text: 'False' }
    ],
    correctAnswer: 'opt_tf_2',
    explanation: 'Agar Third Conditional bo\'lsa, "I would have attended" bo\'lishi kerak, yoki Mixed conditional holatida hozirgi zamon ifodalanishi kerak.',
    createdAt: '2026-02-01T12:05:00Z',
  },
  {
    id: 'q_eng_3',
    teacherId: 'user_teacher_1',
    bookId: 'book_eng_1',
    topicId: 'top_eng_1',
    type: 'multiple_choice',
    questionText: 'Which of the following verbs can be used in the CONTINUOUS aspect without changing their primary stative meaning? (Select all that apply)',
    score: 3,
    difficulty: 'hard',
    tags: ['Stative Verbs', 'Aspect'],
    options: [
      { id: 'opt_mc_1', text: 'Believe' },
      { id: 'opt_mc_2', text: 'Run' },
      { id: 'opt_mc_3', text: 'Know' },
      { id: 'opt_mc_4', text: 'Write' }
    ],
    correctAnswer: ['opt_mc_2', 'opt_mc_4'],
    explanation: '"Believe" va "Know" stative fe\'llar bo\'lib, continuous zamonlarda ishlatilmaydi. "Run" va "Write" harakat fe\'llaridir.',
    createdAt: '2026-02-01T12:10:00Z',
  },
  {
    id: 'q_eng_4',
    teacherId: 'user_teacher_1',
    bookId: 'book_eng_1',
    topicId: 'top_eng_1',
    type: 'image_question',
    questionText: 'Look at the diagram of the solar system above. Which celestial body is marked as the fourth planet from the Sun?',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80',
    score: 2,
    difficulty: 'easy',
    tags: ['Science in English', 'Visuals'],
    options: [
      { id: 'opt_iq_1', text: 'Venus' },
      { id: 'opt_iq_2', text: 'Mars' },
      { id: 'opt_iq_3', text: 'Jupiter' },
      { id: 'opt_iq_4', text: 'Mercury' }
    ],
    correctAnswer: 'opt_iq_2',
    explanation: 'Quyoshdan masofasi bo\'yicha 4-sayyora — Mars (Qizil sayyora).',
    createdAt: '2026-02-01T12:15:00Z',
  },
  {
    id: 'q_eng_5',
    teacherId: 'user_teacher_1',
    bookId: 'book_eng_1',
    topicId: 'top_eng_1',
    type: 'text_question',
    questionText: 'According to the reading passage, why did renewable energy investments surge in 2025?',
    passageText: 'Renewable energy investments saw an unprecedented surge in 2025, driven largely by regulatory mandates, tumbling battery storage costs, and heightened corporate net-zero pledges. While supply chain bottlenecks briefly threatened delivery schedules, technological advancements in perovskite solar cells ultimately unlocked greater conversion efficiencies.',
    score: 2,
    difficulty: 'medium',
    tags: ['Reading', 'Comprehension'],
    options: [
      { id: 'opt_tq_1', text: 'Because traditional fossil fuels were completely banned worldwide' },
      { id: 'opt_tq_2', text: 'Due to falling battery storage costs, regulatory mandates, and corporate net-zero pledges' },
      { id: 'opt_tq_3', text: 'Due to severe lack of electricity in residential sectors' },
      { id: 'opt_tq_4', text: 'Solely because of government subsidies in developing countries' }
    ],
    correctAnswer: 'opt_tq_2',
    explanation: 'Matnda aniq keltirilgan: "driven largely by regulatory mandates, tumbling battery storage costs, and heightened corporate net-zero pledges".',
    createdAt: '2026-02-01T12:20:00Z',
  },
  {
    id: 'q_eng_6',
    teacherId: 'user_teacher_1',
    bookId: 'book_eng_1',
    topicId: 'top_eng_1',
    type: 'short_answer',
    questionText: 'Write the comparative form of the adjective "good". (One word only)',
    score: 1,
    difficulty: 'easy',
    tags: ['Adjectives', 'Vocabulary'],
    options: [],
    correctAnswer: 'better',
    explanation: '"Good" sifatining qiyosiy darajasi "better", orttirma darajasi "best" hisoblanadi.',
    createdAt: '2026-02-01T12:25:00Z',
  },
  {
    id: 'q_mat_1',
    teacherId: 'user_teacher_1',
    bookId: 'book_mat_1',
    topicId: 'top_mat_1',
    type: 'numeric_answer',
    questionText: 'Tenglamaning ildizlari yig\'indisini toping: x² - 14x + 45 = 0. Faqat son yozing.',
    score: 2,
    difficulty: 'easy',
    tags: ['Algebra', 'Viyet'],
    options: [],
    correctAnswer: 14,
    explanation: 'Viyet teoremasiga ko\'ra, keltirilgan kvadrat tenglama ildizlari yig\'indisi x₁ + x₂ = -p = 14 ga teng.',
    createdAt: '2026-02-05T14:00:00Z',
  },
  {
    id: 'q_mat_2',
    teacherId: 'user_teacher_1',
    bookId: 'book_mat_1',
    topicId: 'top_mat_2',
    type: 'single_choice',
    questionText: 'Ifodaning qiymatini hisoblang: log₂(32) + log₃(81) - lg(100)',
    score: 2,
    difficulty: 'medium',
    tags: ['Logarifm'],
    options: [
      { id: 'opt_m2_1', text: '5' },
      { id: 'opt_m2_2', text: '7' },
      { id: 'opt_m2_3', text: '9' },
      { id: 'opt_m2_4', text: '4' }
    ],
    correctAnswer: 'opt_m2_2',
    explanation: 'log₂(32)=5; log₃(81)=4; lg(100)=2. 5 + 4 - 2 = 7.',
    createdAt: '2026-02-05T14:10:00Z',
  },
  {
    id: 'q_uzb_1',
    teacherId: 'user_teacher_2',
    bookId: 'book_uzb_1',
    topicId: 'top_uzb_1',
    type: 'single_choice',
    questionText: 'Qaysi qatorda faqat jarangli undosh tovushlar qatnashgan so\'z berilgan?',
    score: 2,
    difficulty: 'medium',
    tags: ['Fonetika', 'Ona tili'],
    options: [
      { id: 'opt_u1_1', text: 'Daryo' },
      { id: 'opt_u1_2', text: 'Maktab' },
      { id: 'opt_u1_3', text: 'Kitob' },
      { id: 'opt_u1_4', text: 'Pichoq' }
    ],
    correctAnswer: 'opt_u1_1',
    explanation: '"Daryo" so\'zidagi undoshlar: d, r, y — barchasi jarangli undoshlardir.',
    createdAt: '2026-02-10T13:00:00Z',
  }
];

// Seed Tests
const SEED_TESTS: Test[] = [
  {
    id: 'test_eng_mastery',
    teacherId: 'user_teacher_1',
    teacherName: 'Dilshod Rustamov',
    groupIds: ['group_eng_1', 'group_ielts_1'],
    bookId: 'book_eng_1',
    topicId: 'top_eng_1',
    title: 'English Grammar Mastery — Diagnostic & Unit Test',
    description: 'B2 darajadagi zamonlar, modal fe\'llar va matnni tushunish bo\'yicha kompleks test sinovi.',
    durationMinutes: 20,
    maxAttempts: 2,
    passingPercentage: 70,
    maxScore: 11,
    status: 'active',
    randomizeQuestions: true,
    randomizeOptions: true,
    showResultsImmediately: true,
    showCorrectAnswers: true,
    showExplanations: true,
    questionIds: ['q_eng_1', 'q_eng_2', 'q_eng_3', 'q_eng_4', 'q_eng_5', 'q_eng_6'],
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'test_mat_dtm',
    teacherId: 'user_teacher_1',
    teacherName: 'Dilshod Rustamov',
    groupIds: ['group_mat_1'],
    bookId: 'book_mat_1',
    topicId: 'top_mat_1',
    title: 'Matematika: Tenglamalar va Logarifm — Asosiy Sinov',
    description: 'DTM va milliy sertifikat talablari asosidagi algebraik hisob-kitoblar testi.',
    durationMinutes: 30,
    maxAttempts: 1,
    passingPercentage: 60,
    maxScore: 4,
    status: 'active',
    randomizeQuestions: false,
    randomizeOptions: true,
    showResultsImmediately: true,
    showCorrectAnswers: true,
    showExplanations: true,
    questionIds: ['q_mat_1', 'q_mat_2'],
    createdAt: '2026-02-16T11:00:00Z',
  },
  {
    id: 'test_uzb_cert',
    teacherId: 'user_teacher_2',
    teacherName: 'Malika Karimova',
    groupIds: ['group_uzb_1'],
    bookId: 'book_uzb_1',
    topicId: 'top_uzb_1',
    title: 'Ona tili va Adabiyot: Milliy Sertifikat Standarti',
    description: 'Fonetika, imlo va sintaksis qoidalari bo\'yicha test.',
    durationMinutes: 25,
    maxAttempts: 3,
    passingPercentage: 70,
    maxScore: 2,
    status: 'active',
    randomizeQuestions: true,
    randomizeOptions: false,
    showResultsImmediately: true,
    showCorrectAnswers: true,
    showExplanations: true,
    questionIds: ['q_uzb_1'],
    createdAt: '2026-02-18T14:00:00Z',
  }
];

// Seed Attempts
const SEED_ATTEMPTS: TestAttempt[] = [
  {
    id: 'att_sample_1',
    testId: 'test_eng_mastery',
    studentId: 'user_student_1',
    studentName: 'Ali Valiyev',
    studentPhone: '+998971112233',
    groupId: 'group_eng_1',
    groupName: 'Ingliz tili - Intermediate B2',
    attemptNumber: 1,
    startTime: '2026-02-20T10:00:00Z',
    endTime: '2026-02-20T10:14:32Z',
    durationSeconds: 872,
    status: 'submitted',
    score: 10,
    maxScore: 11,
    percentage: 91,
    isPassed: true,
    answers: {
      'q_eng_1': 'opt_2',
      'q_eng_2': 'opt_tf_2',
      'q_eng_3': ['opt_mc_2', 'opt_mc_4'],
      'q_eng_4': 'opt_iq_2',
      'q_eng_5': 'opt_tq_2',
      'q_eng_6': 'better'
    },
    antiCheatEvents: [
      { id: 'ac_1', attemptId: 'att_sample_1', eventType: 'window_blur', timestamp: '2026-02-20T10:05:12Z', details: 'Foydalanuvchi boshqa oynaga o\'tdi' },
      { id: 'ac_2', attemptId: 'att_sample_1', eventType: 'tab_switch', timestamp: '2026-02-20T10:09:40Z', details: 'Brauzer tabi almashtirildi' }
    ],
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'att_sample_2',
    testId: 'test_eng_mastery',
    studentId: 'user_student_2',
    studentName: 'Madina Umarova',
    studentPhone: '+998992223344',
    groupId: 'group_eng_1',
    groupName: 'Ingliz tili - Intermediate B2',
    attemptNumber: 1,
    startTime: '2026-02-21T11:00:00Z',
    endTime: '2026-02-21T11:18:10Z',
    durationSeconds: 1090,
    status: 'submitted',
    score: 8,
    maxScore: 11,
    percentage: 73,
    isPassed: true,
    answers: {
      'q_eng_1': 'opt_2',
      'q_eng_2': 'opt_tf_1', // wrong
      'q_eng_3': ['opt_mc_2', 'opt_mc_4'],
      'q_eng_4': 'opt_iq_2',
      'q_eng_5': 'opt_tq_2',
      'q_eng_6': 'more good' // wrong
    },
    antiCheatEvents: [],
    createdAt: '2026-02-21T11:00:00Z',
  }
];

// Seed Audit Logs
const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    userId: 'user_admin_1',
    userName: 'Azizbek Rahimov',
    userRole: 'SUPER_ADMIN',
    action: 'PLATFORM_INIT',
    targetType: 'settings',
    details: 'Platforma sozlamalari va ma\'lumotlar bazasi initsializatsiya qilindi',
    ip: '178.218.201.45',
    timestamp: '2026-02-01T08:00:00Z'
  },
  {
    id: 'log_2',
    userId: 'user_teacher_1',
    userName: 'Dilshod Rustamov',
    userRole: 'TEACHER',
    action: 'TEST_CREATE',
    targetType: 'test',
    targetId: 'test_eng_mastery',
    details: 'English Grammar Mastery testi yaratildi va guruhlarga biriktirildi',
    ip: '84.54.120.12',
    timestamp: '2026-02-15T10:05:00Z'
  },
  {
    id: 'log_3',
    userId: 'user_student_1',
    userName: 'Ali Valiyev',
    userRole: 'STUDENT',
    action: 'TEST_SUBMIT',
    targetType: 'attempt',
    targetId: 'att_sample_1',
    details: 'Test topshirildi. Natija: 91%, O\'tdi',
    ip: '213.230.100.89',
    timestamp: '2026-02-20T10:14:35Z'
  }
];

// Seed Settings
const SEED_SETTINGS: PlatformSettings = {
  platformName: 'IlmTest',
  platformDescription: 'Zamonaviy, professional va xavfsiz online test platformasi',
  logoText: 'IlmTest',
  defaultPassingPercentage: 70,
  sessionDurationDays: 30,
  telegramBotToken: '7123456789:AAFrX-sample-production-telegram-token',
  telegramBotUsername: 'ilmtest_uz_bot',
  telegramAdminChatId: '987654321',
  allowLeaderboards: true,
  maintenanceMode: false
};

// Storage helper functions
function getJson<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (err) {
    return defaultVal;
  }
}

function setJson<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    notifySubscribers();
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Reactive store listeners
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function notifySubscribers() {
  listeners.forEach(cb => {
    try { cb(); } catch (e) { console.error(e); }
  });
}

// Initialize seed data if not present
export function initDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(SEED_GROUPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(SEED_BOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TOPICS)) {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(SEED_TOPICS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(SEED_QUESTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTS)) {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(SEED_TESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(SEED_ATTEMPTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to student Ali Valiyev for instant seamless preview, user can switch anytime
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[3]));
  }
}

// Ensure initDatabase runs once on load
if (typeof window !== 'undefined') {
  initDatabase();
}

// Storage API
export const StorageService = {
  // Current user & Auth
  getCurrentUser(): User | null {
    return getJson<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },
  
  setCurrentUser(user: User | null) {
    setJson(STORAGE_KEYS.CURRENT_USER, user);
    if (user) {
      this.recordDeviceSession(user.id);
      this.addAuditLog('USER_LOGIN', 'auth', user.id, `${user.firstName} ${user.lastName} (${user.role}) tizimga kirdi`);
    }
  },
  
  getUsers(): User[] {
    return getJson<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  },

  updateUser(user: User) {
    const users = this.getUsers().map(u => u.id === user.id ? user : u);
    setJson(STORAGE_KEYS.USERS, users);
    const curr = this.getCurrentUser();
    if (curr && curr.id === user.id) {
      setJson(STORAGE_KEYS.CURRENT_USER, user);
    }
    this.addAuditLog('USER_UPDATE', 'student', user.id, `Foydalanuvchi ma'lumotlari yangilandi: ${user.firstName} ${user.lastName}`);
  },

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setJson(STORAGE_KEYS.USERS, users);
    this.addAuditLog('USER_REGISTER', 'auth', newUser.id, `Yangi ${newUser.role}: ${newUser.firstName} ${newUser.lastName} (+998 ${newUser.phone})`);
    return newUser;
  },

  toggleBlockUser(userId: string) {
    const users = this.getUsers().map(u => {
      if (u.id === userId) {
        const next = !u.isBlocked;
        return { ...u, isBlocked: next };
      }
      return u;
    });
    setJson(STORAGE_KEYS.USERS, users);
    this.addAuditLog('USER_BLOCK_TOGGLE', 'student', userId, `Foydalanuvchi blok holati o'zgartirildi: ${userId}`);
  },

  // Device Sessions
  getDeviceSessions(): DeviceSession[] {
    return getJson<DeviceSession[]>(STORAGE_KEYS.SESSIONS, []);
  },

  recordDeviceSession(userId: string): DeviceSession {
    const sessions = this.getDeviceSessions();
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|Android|Mobile/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const deviceType: DeviceSession['deviceType'] = isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop');
    
    let browser = 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    let os = 'Windows';
    if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('Linux')) os = 'Linux';

    const currentSessionId = 'sess_' + Date.now();
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION_ID, currentSessionId);

    const newSession: DeviceSession = {
      id: currentSessionId,
      userId,
      deviceType,
      browser,
      os,
      ip: '178.218.201.45', // standard client simulated IP
      loginTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      isCurrent: true
    };

    // Mark previous current session of this browser as false
    const updated = sessions.map(s => ({ ...s, isCurrent: s.id === currentSessionId }));
    updated.unshift(newSession);
    setJson(STORAGE_KEYS.SESSIONS, updated.slice(0, 50));
    return newSession;
  },

  terminateSession(sessionId: string) {
    const sessions = this.getDeviceSessions().filter(s => s.id !== sessionId);
    setJson(STORAGE_KEYS.SESSIONS, sessions);
    this.addAuditLog('SESSION_REVOKE', 'auth', sessionId, `Qurilma sessiyasi bekor qilindi (${sessionId})`);
  },

  terminateAllOtherSessions(userId: string) {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION_ID);
    const sessions = this.getDeviceSessions().filter(s => s.userId !== userId || s.id === currentId);
    setJson(STORAGE_KEYS.SESSIONS, sessions);
    this.addAuditLog('SESSION_REVOKE_ALL', 'auth', userId, `Foydalanuvchining barcha boshqa qurilmalari tizimdan chiqarildi`);
  },

  // Groups
  getGroups(): Group[] {
    return getJson<Group[]>(STORAGE_KEYS.GROUPS, SEED_GROUPS);
  },

  createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'code'>): Group {
    const groups = this.getGroups();
    const code = 'ILM' + Math.floor(100 + Math.random() * 900);
    const newGroup: Group = {
      ...groupData,
      id: 'group_' + Date.now(),
      code,
      createdAt: new Date().toISOString()
    };
    groups.unshift(newGroup);
    setJson(STORAGE_KEYS.GROUPS, groups);
    this.addAuditLog('GROUP_CREATE', 'group', newGroup.id, `Yangi guruh: "${newGroup.name}" (Kod: ${code})`);
    return newGroup;
  },

  updateGroup(group: Group) {
    const groups = this.getGroups().map(g => g.id === group.id ? group : g);
    setJson(STORAGE_KEYS.GROUPS, groups);
    this.addAuditLog('GROUP_UPDATE', 'group', group.id, `Guruh tahrirlandi: "${group.name}"`);
  },

  deleteGroup(groupId: string) {
    const groups = this.getGroups().filter(g => g.id !== groupId);
    setJson(STORAGE_KEYS.GROUPS, groups);
    this.addAuditLog('GROUP_DELETE', 'group', groupId, `Guruh o'chirildi (${groupId})`);
  },

  joinGroupByCode(code: string, studentId: string): { success: boolean; message: string; group?: Group } {
    const groups = this.getGroups();
    const cleanCode = code.trim().toUpperCase();
    const group = groups.find(g => g.code.toUpperCase() === cleanCode);
    if (!group) {
      return { success: false, message: 'Bunday kodli guruh topilmadi. Kodni tekshirib qayta kiriting.' };
    }
    if (group.studentIds.includes(studentId)) {
      return { success: false, message: 'Siz allaqachon ushbu guruhga a\'zosiz.' };
    }
    group.studentIds.push(studentId);
    setJson(STORAGE_KEYS.GROUPS, groups);
    this.addAuditLog('GROUP_JOIN', 'group', group.id, `O'quvchi (${studentId}) guruhga qo'shildi: ${group.name}`);
    return { success: true, message: `"${group.name}" guruhiga muvaffaqiyatli qo'shildingiz!`, group };
  },

  removeStudentFromGroup(groupId: string, studentId: string) {
    const groups = this.getGroups().map(g => {
      if (g.id === groupId) {
        return { ...g, studentIds: g.studentIds.filter(id => id !== studentId) };
      }
      return g;
    });
    setJson(STORAGE_KEYS.GROUPS, groups);
    this.addAuditLog('GROUP_REMOVE_STUDENT', 'group', groupId, `O'quvchi guruhdan chiqarildi (${studentId})`);
  },

  addStudentToGroup(groupId: string, studentId: string) {
    const groups = this.getGroups().map(g => {
      if (g.id === groupId && !g.studentIds.includes(studentId)) {
        return { ...g, studentIds: [...g.studentIds, studentId] };
      }
      return g;
    });
    setJson(STORAGE_KEYS.GROUPS, groups);
  },

  // Books & Topics
  getBooks(): Book[] {
    return getJson<Book[]>(STORAGE_KEYS.BOOKS, SEED_BOOKS);
  },

  createBook(bookData: Omit<Book, 'id' | 'createdAt'>): Book {
    const books = this.getBooks();
    const newBook: Book = {
      ...bookData,
      id: 'book_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    books.unshift(newBook);
    setJson(STORAGE_KEYS.BOOKS, books);
    this.addAuditLog('BOOK_CREATE', 'settings', newBook.id, `Yangi kitob: "${newBook.title}"`);
    return newBook;
  },

  deleteBook(bookId: string) {
    const books = this.getBooks().filter(b => b.id !== bookId);
    setJson(STORAGE_KEYS.BOOKS, books);
    const topics = this.getTopics().filter(t => t.bookId !== bookId);
    setJson(STORAGE_KEYS.TOPICS, topics);
  },

  getTopics(): Topic[] {
    return getJson<Topic[]>(STORAGE_KEYS.TOPICS, SEED_TOPICS);
  },

  createTopic(topicData: Omit<Topic, 'id'>): Topic {
    const topics = this.getTopics();
    const newTopic: Topic = {
      ...topicData,
      id: 'topic_' + Date.now()
    };
    topics.push(newTopic);
    setJson(STORAGE_KEYS.TOPICS, topics);
    return newTopic;
  },

  deleteTopic(topicId: string) {
    const topics = this.getTopics().filter(t => t.id !== topicId);
    setJson(STORAGE_KEYS.TOPICS, topics);
  },

  // Questions
  getQuestions(): Question[] {
    return getJson<Question[]>(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);
  },

  createQuestion(qData: Omit<Question, 'id' | 'createdAt'>): Question {
    const questions = this.getQuestions();
    const newQ: Question = {
      ...qData,
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString()
    };
    questions.push(newQ);
    setJson(STORAGE_KEYS.QUESTIONS, questions);
    return newQ;
  },

  importQuestions(newQuestions: Omit<Question, 'id' | 'createdAt'>[]): Question[] {
    const questions = this.getQuestions();
    const created: Question[] = newQuestions.map(q => ({
      ...q,
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString()
    }));
    questions.push(...created);
    setJson(STORAGE_KEYS.QUESTIONS, questions);
    this.addAuditLog('QUESTIONS_IMPORT', 'test', 'batch', `${created.length} ta savol import qilindi`);
    return created;
  },

  updateQuestion(q: Question) {
    const questions = this.getQuestions().map(item => item.id === q.id ? q : item);
    setJson(STORAGE_KEYS.QUESTIONS, questions);
  },

  deleteQuestion(id: string) {
    const questions = this.getQuestions().filter(item => item.id !== id);
    setJson(STORAGE_KEYS.QUESTIONS, questions);
  },

  duplicateQuestion(id: string): Question | null {
    const questions = this.getQuestions();
    const original = questions.find(q => q.id === id);
    if (!original) return null;
    const duplicated: Question = {
      ...original,
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      questionText: original.questionText + ' (Nusxa)',
      createdAt: new Date().toISOString()
    };
    questions.push(duplicated);
    setJson(STORAGE_KEYS.QUESTIONS, questions);
    return duplicated;
  },

  // Tests
  getTests(): Test[] {
    return getJson<Test[]>(STORAGE_KEYS.TESTS, SEED_TESTS);
  },

  createTest(testData: Omit<Test, 'id' | 'createdAt'>): Test {
    const tests = this.getTests();
    const newTest: Test = {
      ...testData,
      id: 'test_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    tests.unshift(newTest);
    setJson(STORAGE_KEYS.TESTS, tests);
    this.addAuditLog('TEST_CREATE', 'test', newTest.id, `Yangi test yaratildi: "${newTest.title}"`);
    return newTest;
  },

  updateTest(test: Test) {
    const tests = this.getTests().map(t => t.id === test.id ? test : t);
    setJson(STORAGE_KEYS.TESTS, tests);
    this.addAuditLog('TEST_UPDATE', 'test', test.id, `Test yangilandi: "${test.title}"`);
  },

  duplicateTest(testId: string): Test | null {
    const tests = this.getTests();
    const target = tests.find(t => t.id === testId);
    if (!target) return null;
    const duplicated: Test = {
      ...target,
      id: 'test_' + Date.now(),
      title: target.title + ' (Nusxa)',
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    tests.unshift(duplicated);
    setJson(STORAGE_KEYS.TESTS, tests);
    this.addAuditLog('TEST_DUPLICATE', 'test', duplicated.id, `Testdan nusxa olindi: "${target.title}"`);
    return duplicated;
  },

  deleteTest(testId: string) {
    const tests = this.getTests().filter(t => t.id !== testId);
    setJson(STORAGE_KEYS.TESTS, tests);
    this.addAuditLog('TEST_DELETE', 'test', testId, `Test o'chirildi (${testId})`);
  },

  // Attempts & Test Taking Engine
  getAttempts(): TestAttempt[] {
    return getJson<TestAttempt[]>(STORAGE_KEYS.ATTEMPTS, SEED_ATTEMPTS);
  },

  getAttemptById(id: string): TestAttempt | null {
    const attempts = this.getAttempts();
    return attempts.find(a => a.id === id) || null;
  },

  getActiveAttemptForStudent(testId: string, studentId: string): TestAttempt | null {
    const attempts = this.getAttempts();
    return attempts.find(a => a.testId === testId && a.studentId === studentId && a.status === 'in_progress') || null;
  },

  startTestAttempt(testId: string, student: User, groupId: string, groupName: string): TestAttempt {
    const attempts = this.getAttempts();
    const existing = attempts.find(a => a.testId === testId && a.studentId === student.id && a.status === 'in_progress');
    if (existing) {
      return existing;
    }

    const test = this.getTests().find(t => t.id === testId);
    const questions = this.getQuestions().filter(q => test?.questionIds.includes(q.id));

    // Previous attempts count
    const studentAttemptsCount = attempts.filter(a => a.testId === testId && a.studentId === student.id).length;

    let questionOrder = questions.map(q => q.id);
    if (test?.randomizeQuestions) {
      questionOrder = [...questionOrder].sort(() => Math.random() - 0.5);
    }

    const optionOrders: Record<string, string[]> = {};
    if (test?.randomizeOptions) {
      questions.forEach(q => {
        if (q.options && q.options.length > 0) {
          optionOrders[q.id] = [...q.options.map(o => o.id)].sort(() => Math.random() - 0.5);
        }
      });
    }

    const newAttempt: TestAttempt = {
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      testId,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentPhone: student.phone,
      groupId,
      groupName,
      attemptNumber: studentAttemptsCount + 1,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      status: 'in_progress',
      score: 0,
      maxScore: test?.maxScore || 10,
      percentage: 0,
      isPassed: false,
      answers: {},
      antiCheatEvents: [],
      questionOrder,
      optionOrders,
      createdAt: new Date().toISOString()
    };

    attempts.unshift(newAttempt);
    setJson(STORAGE_KEYS.ATTEMPTS, attempts);
    this.addAuditLog('TEST_START', 'attempt', newAttempt.id, `${student.firstName} ${student.lastName} "${test?.title}" testini boshladi (Urinish: ${newAttempt.attemptNumber})`);
    return newAttempt;
  },

  saveAnswer(attemptId: string, questionId: string, answer: any): TestAttempt | null {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt || attempt.status !== 'in_progress') return null;

    attempt.answers[questionId] = answer;
    setJson(STORAGE_KEYS.ATTEMPTS, attempts);
    return attempt;
  },

  recordAntiCheatEvent(attemptId: string, eventType: AntiCheatEvent['eventType'], details?: string): AntiCheatEvent | null {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt || attempt.status !== 'in_progress') return null;

    const event: AntiCheatEvent = {
      id: 'ac_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      attemptId,
      eventType,
      timestamp: new Date().toISOString(),
      details: details || `Oynadan chiqish aniqlandi: ${eventType}`
    };

    attempt.antiCheatEvents.push(event);
    setJson(STORAGE_KEYS.ATTEMPTS, attempts);
    return event;
  },

  submitTestAttempt(attemptId: string): TestAttempt | null {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) return null;

    const test = this.getTests().find(t => t.id === attempt.testId);
    if (!test) return null;

    const questions = this.getQuestions().filter(q => test.questionIds.includes(q.id));
    
    // Server-side Score Calculation (Authoritative)
    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach(q => {
      maxPossibleScore += (q.score || 1);
      const studentAnswer = attempt.answers[q.id];
      if (studentAnswer === undefined || studentAnswer === null || studentAnswer === '') {
        return; // unanswered
      }

      if (q.type === 'single_choice' || q.type === 'true_false' || q.type === 'image_question' || q.type === 'text_question' || q.type === 'image_options') {
        if (studentAnswer === q.correctAnswer) {
          totalScore += q.score;
        }
      } else if (q.type === 'multiple_choice') {
        // Compare arrays
        const correctSet = new Set(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]);
        const studentSet = new Set(Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]);
        if (correctSet.size === studentSet.size && [...correctSet].every(item => studentSet.has(item))) {
          totalScore += q.score;
        }
      } else if (q.type === 'short_answer') {
        // Case-insensitive trimmed match
        const normStudent = String(studentAnswer).trim().toLowerCase();
        const normCorrect = String(q.correctAnswer).trim().toLowerCase();
        if (normStudent === normCorrect) {
          totalScore += q.score;
        }
      } else if (q.type === 'numeric_answer') {
        const studentNum = Number(studentAnswer);
        const correctNum = Number(q.correctAnswer);
        if (!isNaN(studentNum) && Math.abs(studentNum - correctNum) < 0.0001) {
          totalScore += q.score;
        }
      }
    });

    const now = new Date();
    const startTime = new Date(attempt.startTime);
    const durationSeconds = Math.max(1, Math.floor((now.getTime() - startTime.getTime()) / 1000));
    const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    const isPassed = percentage >= test.passingPercentage;

    attempt.endTime = now.toISOString();
    attempt.durationSeconds = durationSeconds;
    attempt.status = 'submitted';
    attempt.score = totalScore;
    attempt.maxScore = maxPossibleScore;
    attempt.percentage = percentage;
    attempt.isPassed = isPassed;

    setJson(STORAGE_KEYS.ATTEMPTS, attempts);

    this.addAuditLog(
      'TEST_SUBMIT',
      'attempt',
      attempt.id,
      `${attempt.studentName} "${test.title}" testini topshirdi. Ball: ${totalScore}/${maxPossibleScore} (${percentage}%), Holat: ${isPassed ? "O'tdi" : "O'tmadi"}`
    );

    // Send in-app notification to teacher
    this.addNotification({
      userId: test.teacherId,
      title: 'Yangi test natijasi',
      message: `${attempt.studentName} "${test.title}" testini topshirdi: ${percentage}% (${isPassed ? "O'tdi" : "O'tmadi"})`,
      type: isPassed ? 'success' : 'info',
      link: `/teacher/tests/${test.id}`
    });

    return attempt;
  },

  resetAttempt(attemptId: string) {
    const attempts = this.getAttempts();
    const target = attempts.find(a => a.id === attemptId);
    if (!target) return;

    const filtered = attempts.filter(a => a.id !== attemptId);
    setJson(STORAGE_KEYS.ATTEMPTS, filtered);

    this.addAuditLog(
      'ATTEMPT_RESET',
      'attempt',
      attemptId,
      `O'qituvchi o'quvchi (${target.studentName}) natijasini o'chirdi va qayta topshirishga ruxsat berdi`
    );
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getJson<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  },

  addAuditLog(action: string, targetType: AuditLog['targetType'], targetId: string | undefined, details: string) {
    const logs = this.getAuditLogs();
    const currUser = this.getCurrentUser();
    const newLog: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      userId: currUser?.id || 'system',
      userName: currUser ? `${currUser.firstName} ${currUser.lastName}` : 'Tizim',
      userRole: currUser?.role || 'SUPER_ADMIN',
      action,
      targetType,
      targetId,
      details,
      ip: '178.218.201.45',
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    setJson(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500));
  },

  // Notifications
  getNotifications(userId: string): AppNotification[] {
    const all = getJson<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif_1',
        userId: 'user_student_1',
        title: 'Yangi test ochildi',
        message: 'Ingliz tili guruhingiz uchun yangi "English Grammar Mastery" testi joylashtirildi.',
        type: 'info',
        isRead: false,
        createdAt: '2026-02-15T10:10:00Z',
        link: '/tests'
      }
    ]);
    return all.filter(n => n.userId === userId || n.userId === 'all');
  },

  addNotification(notifData: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) {
    const all = getJson<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: AppNotification = {
      ...notifData,
      id: 'notif_' + Date.now(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    all.unshift(newNotif);
    setJson(STORAGE_KEYS.NOTIFICATIONS, all.slice(0, 100));
  },

  markNotificationAsRead(id: string) {
    const all = getJson<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updated = all.map(n => n.id === id ? { ...n, isRead: true } : n);
    setJson(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsAsRead(userId: string) {
    const all = getJson<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updated = all.map(n => (n.userId === userId || n.userId === 'all') ? { ...n, isRead: true } : n);
    setJson(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Settings
  getSettings(): PlatformSettings {
    return getJson<PlatformSettings>(STORAGE_KEYS.SETTINGS, SEED_SETTINGS);
  },

  updateSettings(settings: PlatformSettings) {
    setJson(STORAGE_KEYS.SETTINGS, settings);
    this.addAuditLog('SETTINGS_UPDATE', 'settings', 'global', 'Platforma sozlamalari yangilandi');
  }
};

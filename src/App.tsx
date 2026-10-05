import React, { useState, useEffect } from 'react';
import { User, UserRole, Test, TestAttempt } from './types';
import { StorageService, subscribeToStore } from './services/storage';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TestRunner } from './components/student/TestRunner';
import { ResultView } from './components/student/ResultView';
import { StudentProfile } from './components/student/StudentProfile';

import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { GroupManager } from './components/teacher/GroupManager';
import { BookTopicManager } from './components/teacher/BookTopicManager';
import { QuestionBank } from './components/teacher/QuestionBank';
import { TestEditor } from './components/teacher/TestEditor';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuditLogViewer } from './components/admin/AuditLogViewer';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { DeviceSessionsModal } from './components/devices/DeviceSessionsModal';
import { TelegramSimulatorModal } from './components/telegram/TelegramSimulatorModal';
import { LoadTestModal } from './components/loadtest/LoadTestModal';
import { WordImportModal } from './components/teacher/WordImportModal';
import { TestAnalyticsModal } from './components/teacher/TestAnalyticsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>(currentUser ? (currentUser.role === 'STUDENT' ? 'student' : currentUser.role === 'TEACHER' ? 'teacher' : 'admin') : 'landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [isTelegramSimOpen, setIsTelegramSimOpen] = useState(false);
  const [isLoadTestOpen, setIsLoadTestOpen] = useState(false);
  const [isWordImportOpen, setIsWordImportOpen] = useState(false);
  const [selectedAnalyticsTest, setSelectedAnalyticsTest] = useState<Test | null>(null);

  // Active Test Runner state
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<TestAttempt | null>(null);

  // Result View state
  const [resultTest, setResultTest] = useState<Test | null>(null);
  const [resultAttempt, setResultAttempt] = useState<TestAttempt | null>(null);

  // Subscribe to storage changes (e.g. user switch, attempts update)
  useEffect(() => {
    const unsub = subscribeToStore(() => {
      const user = StorageService.getCurrentUser();
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  const handleSelectRole = (role: UserRole) => {
    const users = StorageService.getUsers();
    const demo = users.find(u => u.role === role);
    if (demo) {
      StorageService.setCurrentUser(demo);
      setCurrentUser(demo);
      if (role === 'STUDENT') setCurrentView('student');
      else if (role === 'TEACHER') setCurrentView('teacher');
      else if (role === 'SUPER_ADMIN') setCurrentView('admin');
    }
  };

  const handleStartTest = (test: Test, attempt: TestAttempt) => {
    setActiveTest(test);
    setActiveAttempt(attempt);
    setCurrentView('test-active');
  };

  const handleFinishTest = (completedAttempt: TestAttempt) => {
    if (activeTest) {
      setResultTest(activeTest);
      setResultAttempt(completedAttempt);
      setActiveTest(null);
      setActiveAttempt(null);
      setCurrentView('test-result');
    }
  };

  const handleViewResult = (test: Test, attempt: TestAttempt) => {
    setResultTest(test);
    setResultAttempt(attempt);
    setCurrentView('test-result');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If currently taking a test, show full screen TestRunner
  if (currentView === 'test-active' && activeTest && activeAttempt) {
    return (
      <TestRunner
        test={activeTest}
        attempt={activeAttempt}
        onFinish={handleFinishTest}
        onExit={() => setCurrentView('student')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDevices={() => setIsDevicesModalOpen(true)}
        onOpenTelegramSim={() => setIsTelegramSimOpen(true)}
        onOpenLoadTest={() => setIsLoadTestOpen(true)}
        onSelectRole={handleSelectRole}
        onNavigate={handleNavigate}
        currentView={currentView}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
        
        {/* Desktop Sidebar (only when logged in) */}
        {currentUser && currentView !== 'landing' && (
          <Sidebar
            currentUser={currentUser}
            currentView={currentView}
            onNavigate={handleNavigate}
            isOpen={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
            onOpenWordImport={() => setIsWordImportOpen(true)}
            onOpenCreateTest={() => handleNavigate('teacher-tests')}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all ${
            currentUser && currentView !== 'landing' ? 'md:ml-64' : 'max-w-7xl mx-auto w-full'
          }`}
        >
          {/* Landing View */}
          {currentView === 'landing' && (
            <LandingPage
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onQuickLogin={handleSelectRole}
              onOpenTelegramSim={() => setIsTelegramSimOpen(true)}
              onOpenLoadTest={() => setIsLoadTestOpen(true)}
            />
          )}

          {/* Student Views */}
          {(currentView === 'student' || currentView === 'student-tests') && currentUser && (
            <StudentDashboard
              currentUser={currentUser}
              onStartTest={handleStartTest}
              onViewResult={handleViewResult}
            />
          )}

          {currentView === 'student-results' && currentUser && (
            <StudentDashboard
              currentUser={currentUser}
              onStartTest={handleStartTest}
              onViewResult={handleViewResult}
            />
          )}

          {currentView === 'student-profile' && currentUser && (
            <StudentProfile
              currentUser={currentUser}
              onOpenDevices={() => setIsDevicesModalOpen(true)}
            />
          )}

          {currentView === 'test-result' && resultTest && resultAttempt && (
            <ResultView
              test={resultTest}
              attempt={resultAttempt}
              onBackToDashboard={() => setCurrentView(currentUser?.role === 'TEACHER' ? 'teacher' : 'student')}
            />
          )}

          {/* Teacher Views */}
          {currentView === 'teacher' && currentUser && (
            <TeacherDashboard
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onOpenCreateTest={() => handleNavigate('teacher-tests')}
              onOpenWordImport={() => setIsWordImportOpen(true)}
              onSelectTestAnalytics={(test) => setSelectedAnalyticsTest(test)}
            />
          )}

          {(currentView === 'teacher-tests' || currentView === 'teacher-analytics') && currentUser && (
            <TestEditor
              currentUser={currentUser}
              onOpenWordImport={() => setIsWordImportOpen(true)}
              onSelectTestAnalytics={(test) => setSelectedAnalyticsTest(test)}
            />
          )}

          {currentView === 'teacher-groups' && currentUser && (
            <GroupManager currentUser={currentUser} />
          )}

          {currentView === 'teacher-books' && currentUser && (
            <BookTopicManager currentUser={currentUser} />
          )}

          {currentView === 'teacher-questions' && currentUser && (
            <QuestionBank currentUser={currentUser} />
          )}

          {/* Admin Views */}
          {(currentView === 'admin' || currentView === 'admin-users' || currentView === 'admin-tests' || currentView === 'admin-settings') && currentUser && (
            <AdminDashboard
              currentUser={currentUser}
              onOpenLoadTest={() => setIsLoadTestOpen(true)}
              onOpenAuditLogs={() => handleNavigate('admin-audit')}
              onOpenTelegramSim={() => setIsTelegramSimOpen(true)}
            />
          )}

          {currentView === 'admin-audit' && currentUser && (
            <AuditLogViewer />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {currentUser && currentView !== 'landing' && (
        <MobileNav
          currentView={currentView}
          onNavigate={handleNavigate}
          userRole={currentUser.role}
        />
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'STUDENT') setCurrentView('student');
          else if (user.role === 'TEACHER') setCurrentView('teacher');
          else if (user.role === 'SUPER_ADMIN') setCurrentView('admin');
        }}
      />

      <DeviceSessionsModal
        isOpen={isDevicesModalOpen}
        onClose={() => setIsDevicesModalOpen(false)}
        currentUser={currentUser}
      />

      <TelegramSimulatorModal
        isOpen={isTelegramSimOpen}
        onClose={() => setIsTelegramSimOpen(false)}
      />

      <LoadTestModal
        isOpen={isLoadTestOpen}
        onClose={() => setIsLoadTestOpen(false)}
      />

      <WordImportModal
        isOpen={isWordImportOpen}
        onClose={() => setIsWordImportOpen(false)}
        onSuccess={(count) => {
          handleNavigate('teacher-questions');
        }}
      />

      {selectedAnalyticsTest && (
        <TestAnalyticsModal
          isOpen={true}
          onClose={() => setSelectedAnalyticsTest(null)}
          test={selectedAnalyticsTest}
        />
      )}

    </div>
  );
}

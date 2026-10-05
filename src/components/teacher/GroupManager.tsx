import React, { useState, useEffect } from 'react';
import {
  Users2,
  Plus,
  Copy,
  Check,
  Trash2,
  UserPlus,
  BookOpen,
  Award,
  FileCheck2,
  X,
  Search
} from 'lucide-react';
import { Group, User, Test } from '../../types';
import { StorageService, subscribeToStore } from '../../services/storage';

interface GroupManagerProps {
  currentUser: User;
}

export const GroupManager: React.FC<GroupManagerProps> = ({ currentUser }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Ingliz tili');
  const [level, setLevel] = useState('B2 Intermediate');

  const loadData = () => {
    const g = StorageService.getGroups();
    setGroups(g);
    setAllUsers(StorageService.getUsers());
    setAllTests(StorageService.getTests());
    if (selectedGroup) {
      const refreshed = g.find(item => item.id === selectedGroup.id);
      if (refreshed) setSelectedGroup(refreshed);
    } else if (g.length > 0) {
      setSelectedGroup(g[0]);
    }
  };

  useEffect(() => {
    loadData();
    return subscribeToStore(loadData);
  }, []);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newG = StorageService.createGroup({
      teacherId: currentUser.id,
      teacherName: `${currentUser.firstName} ${currentUser.lastName}`,
      name: name.trim(),
      description: description.trim(),
      course,
      level,
      studentIds: []
    });

    setName('');
    setDescription('');
    setShowCreateModal(false);
    setSelectedGroup(newG);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!selectedGroup) return;
    if (confirm('Rostdan ham ushbu o\'quvchini guruhdan chiqarmoqchimisiz?')) {
      StorageService.removeStudentFromGroup(selectedGroup.id, studentId);
    }
  };

  const handleAddExistingStudent = (studentId: string) => {
    if (!selectedGroup) return;
    StorageService.addStudentToGroup(selectedGroup.id, studentId);
    setShowAddStudentModal(false);
  };

  const groupStudents = selectedGroup
    ? allUsers.filter(u => selectedGroup.studentIds.includes(u.id))
    : [];

  const groupTests = selectedGroup
    ? allTests.filter(t => t.groupIds.includes(selectedGroup.id))
    : [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-600" />
            Guruhlar va Kodlar Boshqaruvi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            O'quvchilar guruh kodi orqali a'zo bo'ladi yoki o'qituvchi ularni qo'lda biriktirishi mumkin.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yangi guruh yaratish
        </button>
      </div>

      {/* Main Grid: Groups List & Group Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Group Cards List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Guruhlar ro'yxati ({groups.length})
          </div>

          <div className="space-y-2.5">
            {groups.map((group) => {
              const isSelected = selectedGroup?.id === group.id;
              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      {group.code}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {group.studentIds.length} ta o'quvchi
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {group.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {group.course} • {group.level}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 cols: Selected Group Details & Roster */}
        {selectedGroup && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Group Banner */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedGroup.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Kurs: <strong>{selectedGroup.course}</strong> • Daraja: <strong>{selectedGroup.level}</strong>
                  </div>
                </div>

                {/* Group Code Card */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Guruh kodi</div>
                    <div className="font-mono font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                      {selectedGroup.code}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyCode(selectedGroup.code)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-indigo-600 shadow-xs transition"
                    title="Kodni nusxalash"
                  >
                    {copiedCode === selectedGroup.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Group Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                  <div className="text-lg font-black text-slate-900 dark:text-white">{groupStudents.length}</div>
                  <div className="text-[10px] text-slate-400">O'quvchilar soni</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                  <div className="text-lg font-black text-slate-900 dark:text-white">{groupTests.length}</div>
                  <div className="text-[10px] text-slate-400">Biriktirilgan testlar</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                  <div className="text-lg font-black text-emerald-600">82%</div>
                  <div className="text-[10px] text-slate-400">O'rtacha o'zlashtirish</div>
                </div>
              </div>
            </div>

            {/* Students Roster in this Group */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Guruh o'quvchilari ({groupStudents.length})
                  </h4>
                  <p className="text-xs text-slate-400">
                    O'quvchilar ushbu guruhga kiritilgan barcha testlarni yechish huquqiga ega
                  </p>
                </div>

                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 flex items-center gap-1.5 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  O'quvchi qo'shish
                </button>
              </div>

              {groupStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Ushbu guruhda hali o'quvchilar yo'q. O'quvchilarga <strong>{selectedGroup.code}</strong> kodini bering yoki qo'lda qo'shing.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {groupStudents.map((st) => (
                    <div key={st.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={st.firstName}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                            {st.firstName} {st.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {st.phone} {st.telegramUsername ? `• @${st.telegramUsername}` : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveStudent(st.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition"
                        title="Guruhdan chiqarish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Yangi guruh ochish
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Guruh nomi *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: IELTS Intensive 7.5+"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kurs / Fan
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="Ingliz tili"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Daraja (Level)
                </label>
                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="B2 Intermediate"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Guruh haqida qisqacha ma'lumot..."
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  Guruhni yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                O'quvchini guruhga biriktirish
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
              {allUsers.filter(u => u.role === 'STUDENT' && !selectedGroup.studentIds.includes(u.id)).map((st) => (
                <div key={st.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {st.firstName} {st.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400">{st.phone}</div>
                  </div>
                  <button
                    onClick={() => handleAddExistingStudent(st.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Qo'shish
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

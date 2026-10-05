import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, FolderPlus, HelpCircle, FileCheck2, ChevronRight, X } from 'lucide-react';
import { Book, Topic, User } from '../../types';
import { StorageService, subscribeToStore } from '../../services/storage';

interface BookTopicManagerProps {
  currentUser: User;
}

export const BookTopicManager: React.FC<BookTopicManagerProps> = ({ currentUser }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Modals
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');

  const loadData = () => {
    const b = StorageService.getBooks();
    const t = StorageService.getTopics();
    setBooks(b);
    setTopics(t);
    if (selectedBook) {
      const refreshed = b.find(item => item.id === selectedBook.id);
      if (refreshed) setSelectedBook(refreshed);
    } else if (b.length > 0) {
      setSelectedBook(b[0]);
    }
  };

  useEffect(() => {
    loadData();
    return subscribeToStore(loadData);
  }, []);

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    const newB = StorageService.createBook({
      teacherId: currentUser.id,
      title: bookTitle.trim(),
      description: bookDesc.trim(),
      coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80'
    });

    setBookTitle('');
    setBookDesc('');
    setShowAddBookModal(false);
    setSelectedBook(newB);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !topicTitle.trim()) return;

    const currentTopicsForBook = topics.filter(t => t.bookId === selectedBook.id);
    StorageService.createTopic({
      bookId: selectedBook.id,
      title: topicTitle.trim(),
      description: topicDesc.trim(),
      orderIndex: currentTopicsForBook.length + 1
    });

    setTopicTitle('');
    setTopicDesc('');
    setShowAddTopicModal(false);
  };

  const handleDeleteBook = (bookId: string) => {
    if (confirm('Ushbu kitob va uning barcha mavzularini o\'chirishni tasdiqlaysizmi?')) {
      StorageService.deleteBook(bookId);
      if (selectedBook?.id === bookId) setSelectedBook(null);
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    if (confirm('Mavzuni o\'chirishni tasdiqlaysizmi?')) {
      StorageService.deleteTopic(topicId);
    }
  };

  const bookTopics = selectedBook ? topics.filter(t => t.bookId === selectedBook.id) : [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Kitoblar va Mavzular Strukturasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mavzular bo'yicha savollar banki va testlar biriktiriladi (Ierarxik ta'lim daraxti).
          </p>
        </div>

        <button
          onClick={() => setShowAddBookModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yangi kitob qo'shish
        </button>
      </div>

      {/* Grid: Books on Left, Topics on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Books List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Mavjud kitoblar ({books.length})
          </div>

          <div className="space-y-2">
            {books.map((book) => {
              const isSelected = selectedBook?.id === book.id;
              const count = topics.filter(t => t.bookId === book.id).length;

              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={book.coverUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80'}
                      alt={book.title}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {book.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {count} ta mavzu (Units)
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 text-slate-400 ${isSelected ? 'text-indigo-600' : ''}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Book & Topics Detail */}
        {selectedBook ? (
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedBook.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedBook.description || 'Mavzular bo\'yicha testlar to\'plami'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddTopicModal(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 transition"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    Mavzu qo'shish
                  </button>

                  <button
                    onClick={() => handleDeleteBook(selectedBook.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Kitobni o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Topics Tree */}
              <div className="space-y-2">
                {bookTopics.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Ushbu kitobda hali mavzular yaratilmagan. Yuqoridagi "Mavzu qo'shish" tugmasini bosing.
                  </div>
                ) : (
                  bookTopics.map((topic, idx) => (
                    <div
                      key={topic.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                            {topic.title}
                          </div>
                          {topic.description && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {topic.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            Kitobni tanlang yoki yangi kitob yarating
          </div>
        )}

      </div>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Yangi kitob qo'shish
              </h3>
              <button onClick={() => setShowAddBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kitob nomi *
                </label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="Masalan: Ona tili va adabiyot darsligi"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Qisqacha tavsif
                </label>
                <textarea
                  rows={3}
                  value={bookDesc}
                  onChange={(e) => setBookDesc(e.target.value)}
                  placeholder="Mavzular va darslik haqida..."
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  Kitobni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Mavzu (Unit) qo'shish
              </h3>
              <button onClick={() => setShowAddTopicModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mavzu sarlavhasi *
                </label>
                <input
                  type="text"
                  required
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="Masalan: Unit 5: Phrasal Verbs"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Izoh yoki tavsif
                </label>
                <input
                  type="text"
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  placeholder="Qoidalar va tushunchalar..."
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  Mavzuni qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

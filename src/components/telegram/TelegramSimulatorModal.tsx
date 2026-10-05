import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Check, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { TelegramService } from '../../services/telegramBot';
import { StorageService } from '../../services/storage';

interface TelegramSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramSimulatorModal: React.FC<TelegramSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ id: string; sender: 'user' | 'bot'; text: string; time: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [adminChatId, setAdminChatId] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const refreshMessages = () => {
    setMessages(TelegramService.getSimulatedBotMessages());
  };

  useEffect(() => {
    if (isOpen) {
      refreshMessages();
      const settings = StorageService.getSettings();
      setBotToken(settings.telegramBotToken || '');
      setAdminChatId(settings.telegramAdminChatId || '');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showConfig]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    TelegramService.addSimulatedBotMessage('user', text);
    setInputText('');
    refreshMessages();

    // Generate bot reply
    setTimeout(() => {
      const reply = TelegramService.handleBotCommand(text);
      TelegramService.addSimulatedBotMessage('bot', reply);
      refreshMessages();
    }, 400);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = StorageService.getSettings();
    StorageService.updateSettings({
      ...settings,
      telegramBotToken: botToken.trim(),
      telegramAdminChatId: adminChatId.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md h-[600px] flex flex-col bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden text-slate-100">
        
        {/* Telegram Header */}
        <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                IlmTest Bot
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] text-sky-400">@ilmtest_uz_bot • rasmiy bot</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 rounded-xl transition ${
                showConfig ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
              title="Bot sozlamalari (Token & Chat ID)"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Bot Configuration Drawer */}
        {showConfig ? (
          <div className="p-5 bg-slate-800/95 space-y-4 overflow-y-auto flex-1 animate-in fade-in">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5" />
              Real Telegram Bot Sozlamalari
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              BotFather orqali olingan token va admin chat ID sini kiriting. Test topshirilganda bot avtomatik sizning Telegramingizga xabar jo'natadi.
            </p>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                Sozlamalar muvaffaqiyatli saqlandi!
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="123456789:ABCdefGhIJKlmNoPQRstuVWxYZ"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Chat ID
                </label>
                <input
                  type="text"
                  value={adminChatId}
                  onChange={(e) => setAdminChatId(e.target.value)}
                  placeholder="987654321"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-700 transition"
                >
                  Yopish
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Telegram Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
                        isBot
                          ? 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700'
                          : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-xs'
                      }`}
                      dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                    />
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Command Pills */}
            <div className="px-3 py-2 bg-slate-800/80 border-t border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {['/start', '/stats', '/results', '/users', '/help'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    TelegramService.addSimulatedBotMessage('user', cmd);
                    refreshMessages();
                    setTimeout(() => {
                      const rep = TelegramService.handleBotCommand(cmd);
                      TelegramService.addSimulatedBotMessage('bot', rep);
                      refreshMessages();
                    }, 350);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-700/80 hover:bg-sky-600/30 hover:text-sky-300 text-slate-300 font-mono transition shrink-0"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-800 border-t border-slate-700 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Xabar yoki buyruq yozing (/help)..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-sky-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

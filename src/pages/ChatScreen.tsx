import React, { useRef, useEffect } from 'react';
import { Message, AppStatus } from '@/types';
import { ConfidenceThermometer } from '@/components/ConfidenceThermometer';
import { TypingIndicator } from '@/components/TypingIndicator';

interface ChatScreenProps {
  confidence: number;
  messages: Message[];
  isTyping: boolean;
  status: AppStatus;
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: (e?: React.FormEvent) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  confidence,
  messages,
  isTyping,
  status,
  inputText,
  setInputText,
  onSendMessage,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <>
      <ConfidenceThermometer value={confidence} />

      <div className="flex-1 w-full max-w-2xl overflow-y-auto chat-scroll p-6 pb-32 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20'
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && status === AppStatus.CHATTING && <TypingIndicator />}

        {status === AppStatus.ANALYZING && (
          <div className="flex justify-center py-10 animate-fade-in">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">🍿</div>
              </div>
              <p className="mt-4 text-indigo-400 font-bold animate-pulse">Eternizando sua sessão...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {status !== AppStatus.ANALYZING && (
        <div className="absolute bottom-0 w-full max-w-2xl p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
          <form
            onSubmit={onSendMessage}
            className="flex items-center gap-3 p-2 rounded-2xl glass border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-2xl"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Manda a real..."
              className="flex-1 bg-transparent px-4 py-3 outline-none text-sm placeholder:text-slate-600"
              disabled={status !== AppStatus.CHATTING || isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || status !== AppStatus.CHATTING || isTyping}
              className="bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-500 active:scale-95 disabled:opacity-30 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
};

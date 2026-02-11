import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { AppStatus } from '@/types';
import { AuthScreen } from '@/pages/AuthScreen';
import { HistoryScreen } from '@/pages/HistoryScreen';
import { ChatScreen } from '@/pages/ChatScreen';
import { VerdictCard } from '@/components/VerdictCard';

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const {
    messages,
    inputText,
    setInputText,
    status,
    setStatus,
    isTyping,
    confidence,
    verdict,
    sendMessage,
    resetChat
  } = useChat(user?.uid);

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div></div>;

  if (!user) return <AuthScreen />;

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <header className="px-6 pt-12 pb-4 md:py-4 flex items-center justify-between border-b border-white/5 glass z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setStatus(AppStatus.CHATTING)} className="flex items-center gap-3 outline-none group">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform" />
            <h1 className="font-black tracking-tighter text-xl uppercase italic">Me Tire do Tédio</h1>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStatus(AppStatus.HISTORY)}
            className={`text-[10px] font-black uppercase transition-colors tracking-widest ${status === AppStatus.HISTORY ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Histórico
          </button>
          <div className="w-px h-3 bg-white/10" />
          <button
            onClick={logout}
            className="text-[10px] font-black uppercase text-red-500/70 hover:text-red-400 transition-colors tracking-widest"
          >
            Sair
          </button>
          {user.photoURL && (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-white/10" />
          )}
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden flex flex-col items-center min-h-0">
        {status === AppStatus.HISTORY ? (
          <HistoryScreen userId={user.uid} onBack={() => setStatus(AppStatus.CHATTING)} />
        ) : status === AppStatus.FINISHED && verdict ? (
          <VerdictCard verdict={verdict} onReset={resetChat} />
        ) : (
          <ChatScreen
            confidence={confidence}
            messages={messages}
            isTyping={isTyping}
            status={status}
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={(e) => { e?.preventDefault(); sendMessage(); }}
          />
        )}
      </main>
    </div>
  );
};

export default App;

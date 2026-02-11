
import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from './services/geminiService';
import { Message, Verdict, AppStatus } from './types';
import { VerdictCard } from './components/VerdictCard';
import { auth, db, googleProvider } from './services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';

const gemini = new GeminiService();

const TypingIndicator = () => (
  <div className="flex justify-start animate-fade-in">
    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

const ConfidenceThermometer: React.FC<{ value: number }> = ({ value }) => {
  const getStatusText = (v: number) => {
    if (v < 30) return 'Sondando o terreno...';
    if (v < 60) return 'Entendendo sua vibe...';
    if (v < 85) return 'Refinando a busca...';
    return '🎯 Veredito pronto!';
  };

  return (
    <div className="w-full max-w-2xl px-6 pt-4 animate-fade-in">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Termômetro Anti-Tédio</span>
        <span className="text-[10px] font-black text-slate-500">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.4)]"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-500 mt-1 font-medium italic text-right">
        {getStatusText(value)}
      </p>
    </div>
  );
};

const AuthScreen: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError('Falha ao autenticar com o Google. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md p-10 rounded-3xl glass border border-white/10 shadow-2xl animate-fade-in flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/30 transform -rotate-6">
            <span className="text-3xl">🍿</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ME TIRE DO TÉDIO</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Seu curador cinéfilo está pronto. <br/> 
            Entre com o Google para salvar suas sessões e começar o papo.
          </p>
        </div>
        
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login com Google
            </>
          )}
        </button>
        
        {error && <p className="text-red-400 text-[10px] font-bold uppercase text-center mt-6 tracking-widest">{error}</p>}
        
        <div className="mt-12 flex items-center gap-2 opacity-30 grayscale">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">GRV DEVELOPER</span>
        </div>
      </div>
    </div>
  );
};

const HistoryScreen: React.FC<{ userId: string; onBack: () => void }> = ({ userId, onBack }) => {
  const [history, setHistory] = useState<Verdict[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const q = query(collection(db, `users/${userId}/history`), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Verdict));
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className="flex-1 w-full max-w-4xl overflow-y-auto chat-scroll p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black italic">Minhas Sessões</h2>
        <button onClick={onBack} className="text-xs font-black uppercase text-indigo-400 hover:underline">Voltar ao Chat</button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div></div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-white/5">
          <p className="text-slate-500 font-medium">Você ainda não tem recomendações salvas.</p>
          <button onClick={onBack} className="mt-4 text-xs font-black uppercase text-indigo-400">Começar agora</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div key={item.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Data desconhecida'}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Filme</h4>
                  <p className="font-bold text-white truncate text-lg">{item.movie.title}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Série</h4>
                  <p className="font-bold text-white truncate text-lg">{item.series.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isTyping, setIsTyping] = useState(false);
  const [confidence, setConfidence] = useState(25);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
      if (u) {
        reset();
      }
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const saveVerdict = async (v: Verdict) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/history`), {
        ...v,
        createdAt: Timestamp.now()
      });
    } catch (e) {
      console.error("Error saving verdict: ", e);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || status !== AppStatus.CHATTING || isTyping) return;

    const userMessage: Message = { role: 'user', text: inputText };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await gemini.getChatResponse(newHistory);
      setConfidence(response.confidence);
      
      const updatedHistory = [...newHistory, { role: 'model', text: response.text } as Message];
      setMessages(updatedHistory);

      if (response.confidence >= 85) {
        setIsTyping(true);
        setStatus(AppStatus.ANALYZING);
        const finalVerdict = await gemini.getVerdict(updatedHistory);
        setVerdict(finalVerdict);
        setStatus(AppStatus.FINISHED);
        await saveVerdict(finalVerdict);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Ih, deu ruim na conexão. Tenta de novo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const reset = () => {
    setVerdict(null);
    setConfidence(25);
    setMessages([
      { role: 'model', text: 'E aí! Sou seu guia oficial pra sair desse tédio. Pra gente começar: você tá numa vibe de querer explodir a cabeça com algo louco ou só quer relaxar e esquecer os boletos?' }
    ]);
    setStatus(AppStatus.CHATTING);
    setIsTyping(false);
  };

  if (!authChecked) return <div className="h-screen bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div></div>;

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
            onClick={() => signOut(auth)}
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
          <VerdictCard verdict={verdict} onReset={reset} />
        ) : (
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
                  onSubmit={handleSendMessage}
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
        )}
      </main>
    </div>
  );
};

export default App;

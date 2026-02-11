import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError('Falha ao autenticar com o Google. Tente novamente.');
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

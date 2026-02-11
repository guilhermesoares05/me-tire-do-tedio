import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 h-[100dvh]">
      <div className="w-full max-w-md p-10 rounded-3xl glass border border-white/10 shadow-2xl animate-fade-in flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-500/20 border border-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/10 transform rotate-12">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            404
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-2">
            Ops! Parece que você se perdeu no multiverso.
          </p>
          <p className="text-slate-500 text-xs italic">
            Essa página não existe.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5 uppercase tracking-widest text-xs"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

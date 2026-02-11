import React from 'react';
import { useHistory } from '@/hooks/useHistory';

export const HistoryScreen: React.FC<{ userId: string; onBack: () => void }> = ({ userId, onBack }) => {
  const { history, loading } = useHistory(userId);

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

import React, { useState } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { useFavorites } from '@/hooks/useFavorites';
import { GeminiService } from '@/services/geminiService';

const gemini = new GeminiService();

export const HistoryScreen: React.FC<{ userId: string; onBack: () => void }> = ({ userId, onBack }) => {
  const { history, loading: historyLoading, addHistoryItem } = useHistory(userId);
  const { favorites, loading: favoritesLoading } = useFavorites(userId);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRecommendation = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const verdict = await gemini.getRecommendationFromHistory(history, favorites);
      await addHistoryItem(verdict);
    } catch (error) {
      console.error("Failed to generate recommendation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const initialLoading = historyLoading || favoritesLoading;

  return (
    <div className="flex-1 w-full max-w-4xl overflow-y-auto chat-scroll p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black italic">Minhas Sessões</h2>
        <div className="flex gap-4 items-center">
            <button
              onClick={handleGenerateRecommendation}
              disabled={isGenerating || initialLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                'Nova Recomendação 🎲'
              )}
            </button>
            <button onClick={onBack} className="text-xs font-black uppercase text-indigo-400 hover:underline">Voltar ao Chat</button>
        </div>
      </div>

      {initialLoading && !history.length ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div></div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-white/5">
          <p className="text-slate-500 font-medium">Você ainda não tem recomendações salvas.</p>
          <button onClick={onBack} className="mt-4 text-xs font-black uppercase text-indigo-400">Começar agora</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div key={item.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group cursor-default animate-fade-in">
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

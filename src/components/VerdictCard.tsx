
import React from 'react';
import { Verdict } from '@/types';

interface VerdictCardProps {
  verdict: Verdict;
  onReset: () => void;
}

const RecommendationBlock: React.FC<{ label: string; data: any }> = ({ label, data }) => (
  <div className="flex-1 p-6 rounded-2xl glass border-t border-white/10 animate-fade-in flex flex-col h-full shadow-2xl">
    <div className="flex items-center gap-2 mb-4">
      <span className="px-3 py-1 text-[10px] uppercase font-black tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white shadow-lg shadow-indigo-500/20">
        {label}
      </span>
      <h3 className="text-xl font-bold text-white truncate">{data.title}</h3>
    </div>
    
    <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow italic">
      "{data.justification}"
    </p>
    
    <div className="pt-4 border-t border-white/5 bg-white/2 -mx-6 -mb-6 p-6 rounded-b-2xl">
      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">A Vibe:</span>
      <p className="text-indigo-400 font-bold text-base">✨ {data.vibe}</p>
    </div>
  </div>
);

export const VerdictCard: React.FC<VerdictCardProps> = ({ verdict, onReset }) => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto p-6 h-full overflow-y-auto chat-scroll animate-fade-in">
      <div className="text-center py-4">
        <h2 className="text-4xl font-black bg-gradient-to-r from-white via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-2">
          Veredito Final
        </h2>
        <p className="text-slate-400 font-medium">Pode confiar, eu sei o que eu tô falando. 😉</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecommendationBlock label="O Filme" data={verdict.movie} />
        <RecommendationBlock label="A Série" data={verdict.series} />
      </div>

      <button
        onClick={onReset}
        className="mt-4 px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all duration-300 self-center shadow-xl shadow-white/10"
      >
        Novo Veredito
      </button>
    </div>
  );
};

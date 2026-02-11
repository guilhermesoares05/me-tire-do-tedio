import React from 'react';

export const ConfidenceThermometer: React.FC<{ value: number }> = ({ value }) => {
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

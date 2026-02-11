import React from 'react';

export const TypingIndicator: React.FC = () => (
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

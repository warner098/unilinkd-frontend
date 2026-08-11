import React from 'react';

export default function ToastContainer({ toast, onClose }) {
  if (!toast || !toast.message) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  return (
    <div className="fixed bottom-6 right-6 z-[100] transition-all duration-300 animate-float">
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center justify-between gap-4 max-w-sm ${
        isError 
          ? 'bg-rose-950/90 text-rose-100 border-rose-500/40 shadow-rose-950/50'
          : isWarning
          ? 'bg-amber-950/90 text-amber-100 border-amber-500/40 shadow-amber-950/50'
          : 'bg-[#0E1322]/95 text-white border-indigo-500/40 shadow-indigo-950/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner ${
            isError ? 'bg-rose-500/20 text-rose-400' : isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
          }`}>
            {toast.icon || (isError ? '⚠️' : isWarning ? '🔔' : '✨')}
          </div>
          <p className="text-xs font-extrabold leading-snug">{toast.message}</p>
        </div>

        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

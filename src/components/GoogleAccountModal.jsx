import React from 'react';

export default function GoogleAccountModal({ isOpen, onClose, onSelectAccount }) {
  if (!isOpen) return null;

  const accounts = [
    {
      nombre: 'CARLOS JAREN PINCAY PARRALES',
      correo: 'pincay-carlos7490@unesum.edu.ec',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      semestre: '5to Semestre'
    },
    {
      nombre: 'Carlos Jaren',
      correo: 'jarengamer156@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      semestre: '3er Semestre'
    },
    {
      nombre: 'Dancito',
      correo: 'pincayparralesmarcosalvino@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      semestre: '4to Semestre'
    },
    {
      nombre: 'Kevin Pacheco Rodriguez',
      correo: '8al1es@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      semestre: '6to Semestre'
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        
        {/* CABECERA OFICIAL DE GOOGLE */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="text-sm font-semibold text-slate-700">Acceder con Google</span>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* TÍTULO */}
        <div className="text-left space-y-1 mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Elige una cuenta</h3>
          <p className="text-xs text-slate-500">para continuar en <span className="font-semibold text-indigo-600">unilinkd.netlify.app</span></p>
        </div>

        {/* LISTA DE CUENTAS GOOGLE */}
        <div className="space-y-1 divide-y divide-slate-100 text-left mb-6">
          {accounts.map((acc, index) => (
            <button
              key={index}
              onClick={() => onSelectAccount(acc)}
              className="w-full py-3 px-2 flex items-center gap-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer text-left group"
            >
              <img src={acc.avatar} alt={acc.nombre} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-indigo-500" />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {acc.nombre}
                </h4>
                <p className="text-xs text-slate-500 truncate">{acc.correo}</p>
              </div>
            </button>
          ))}
        </div>

        {/* PIE Y POLÍTICAS */}
        <div className="pt-4 border-t border-slate-100 text-left text-[11px] text-slate-400 leading-relaxed">
          Para continuar, Google compartirá tu nombre, dirección de correo electrónico y foto de perfil con UniLinkd.
        </div>

      </div>
    </div>
  );
}

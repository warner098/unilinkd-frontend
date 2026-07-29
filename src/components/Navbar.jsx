import React from 'react';

export default function Navbar({ onOpenAuth, onNavigate, onOpenProfile, onOpenAdmin, onOpenNotifications, user, pendingCount = 0, unreadNotifCount = 0 }) {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO UNILINKD */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg 
              className="w-full h-full text-indigo-600 transition-transform group-hover:scale-105" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="unilinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <path 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                stroke="url(#unilinkGradient)" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            UniLink<span className="text-indigo-600">d</span>
          </span>
        </a>

        {/* MENÚ CENTRAL */}
        <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium text-sm">
          {user ? (
            <>
              <a href="#soporte" className="hover:text-indigo-600 transition-colors">Soporte</a>
              <a href="#faq" className="hover:text-indigo-600 transition-colors">Preguntas frecuentes</a>
              <a href="#contacto" className="hover:text-indigo-600 transition-colors">Contacto</a>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('proyectos')} 
                className="hover:text-indigo-600 transition-colors font-medium text-sm"
              >
                Proyectos
              </button>
              <button 
                onClick={() => onNavigate('estudiantes')} 
                className="hover:text-indigo-600 transition-colors font-medium text-sm"
              >
                Estudiantes
              </button>
              <a href="#como-funciona" className="hover:text-indigo-600 transition-colors">¿Cómo funciona?</a>
            </>
          )}
        </nav>

        {/* BOTONES DE ACCESO */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* BOTÓN DE CAMPANA DE NOTIFICACIONES */}
              <button
                onClick={onOpenNotifications}
                title="Ver notificaciones"
                className="relative bg-gray-100 hover:bg-gray-200 text-gray-700 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="text-base">🔔</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full font-extrabold flex items-center justify-center animate-pulse border border-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* BOTÓN PANEL ADMIN (SOLO VISIBLE SI ES ADMINISTRADOR) */}
              {user.rol === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  title="Panel de Administración"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full transition-all shadow-md shadow-amber-100 flex items-center gap-1.5 cursor-pointer hover:scale-105 relative"
                >
                  <span>👑 Panel Admin</span>
                  {pendingCount > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse border border-white">
                      🔔 {pendingCount}
                    </span>
                  )}
                </button>
              )}

              {/* Botón de usuario interactivizado para abrir el modal */}
              <button 
                onClick={onOpenProfile}
                title="Editar mi perfil"
                className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full shadow-sm hover:bg-indigo-50/80 hover:border-indigo-200 transition-all text-left cursor-pointer group"
              >
                {user.fotoUrl ? (
                  <img src={user.fotoUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {user.nombre}
                </span>
                {user.rol === 'admin' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-md">
                    ADMIN
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-full transition-all cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full font-semibold text-sm transition-all"
              >
                Iniciar sesión
              </button>

              <button 
                onClick={() => onOpenAuth('register')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-md shadow-indigo-100 hover:scale-105"
              >
                Unirse ahora
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
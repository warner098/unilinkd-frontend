import React from 'react';

export default function Navbar({ 
  onOpenAuth, 
  onNavigate, 
  onOpenProfile, 
  onOpenAdmin, 
  onOpenNotifications, 
  onOpenMyPublications, 
  user, 
  pendingCount = 0, 
  unreadNotifCount = 0 
}) {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* LOGO UNILINKD CON GLOW & HOVER PULSE */}
        <a href="#" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-2 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <svg 
              className="w-full h-full text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                stroke="currentColor" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="text-2xl font-black tracking-tight text-slate-900 font-heading">
            UniLink<span className="text-indigo-600">d</span>
          </span>
        </a>

        {/* MENÚ CENTRAL DE NAVEGACIÓN */}
        <nav className="hidden md:flex items-center gap-8 text-slate-600 font-semibold text-sm">
          {user ? (
            <>
              <a href="#soporte" className="hover:text-indigo-600 transition-colors py-1 relative group">
                Soporte
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
              <a href="#faq" className="hover:text-indigo-600 transition-colors py-1 relative group">
                Preguntas frecuentes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
              <a href="#contacto" className="hover:text-indigo-600 transition-colors py-1 relative group">
                Contacto
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('proyectos')} 
                className="hover:text-indigo-600 transition-colors font-semibold text-sm cursor-pointer py-1 relative group"
              >
                Proyectos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>
              <button 
                onClick={() => onNavigate('estudiantes')} 
                className="hover:text-indigo-600 transition-colors font-semibold text-sm cursor-pointer py-1 relative group"
              >
                Estudiantes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>
              <a href="#como-funciona" className="hover:text-indigo-600 transition-colors py-1 relative group">
                ¿Cómo funciona?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            </>
          )}
        </nav>

        {/* BOTONES DE ACCESO Y SESIÓN */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              
              {/* BOTÓN MIS PUBLICACIONES */}
              {onOpenMyPublications && (
                <button
                  onClick={onOpenMyPublications}
                  title="Ver mis publicaciones"
                  className="bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-700 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all border border-indigo-200/60 flex items-center gap-1.5 cursor-pointer hover:scale-105 shadow-xs"
                >
                  <span className="text-sm">📂</span> Mis Publicaciones
                </button>
              )}

              {/* BOTÓN CAMPANA DE NOTIFICACIONES */}
              <button
                onClick={onOpenNotifications}
                title="Centro de notificaciones"
                className="relative bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 hover:border-indigo-200 hover:scale-105"
              >
                <span className="text-base">🔔</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-4.5 h-4.5 rounded-full font-black flex items-center justify-center animate-pulse border-2 border-white shadow-xs">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* BOTÓN PANEL ADMIN (SOLO SI ROL IS ADMIN) */}
              {user.rol === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  title="Panel de Administración"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer hover:scale-105 relative"
                >
                  <span>👑 Panel Admin</span>
                  {pendingCount > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse border border-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )}

              {/* BOTÓN DE MI PERFIL */}
              <button 
                onClick={onOpenProfile}
                title="Editar mi perfil"
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl shadow-xs hover:bg-white hover:border-indigo-300 transition-all text-left cursor-pointer group"
              >
                {user.fotoUrl ? (
                  <img src={user.fotoUrl} alt="Avatar" className="w-7 h-7 rounded-xl object-cover ring-2 ring-indigo-500/30" />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {user.nombre}
                </span>
                {user.rol === 'admin' && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-md border border-amber-200">
                    ADMIN
                  </span>
                )}
              </button>

              {/* CERRAR SESIÓN */}
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-slate-700 hover:bg-slate-100 px-4.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Iniciar sesión
              </button>

              <button 
                onClick={() => onOpenAuth('register')}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md shadow-indigo-500/25 hover:scale-105 cursor-pointer"
              >
                Unirse ahora ✨
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
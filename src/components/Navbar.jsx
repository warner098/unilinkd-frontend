import React from 'react';

export default function Navbar({ 
  onOpenAuth, 
  onNavigate, 
  onOpenProfile, 
  onOpenAdmin, 
  onOpenNotifications, 
  onOpenMyPublications, 
  onOpenChatHub,
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
    <header className="sticky top-0 z-50 glass-nav-dark transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* LOGO UNILINKD CON ESTÉTICA AWWWARDS */}
        <a href="#" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-2 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 border border-white/20">
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

          <span className="text-2xl font-black tracking-tight text-white font-heading">
            UniLink<span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">d</span>
          </span>
        </a>

        {/* MENÚ CENTRAL DE NAVEGACIÓN MINIMALISTA */}
        <nav className="hidden md:flex items-center gap-8 text-slate-400 font-medium text-xs tracking-wider uppercase">
          {user ? (
            <>
              <a href="#soporte" className="hover:text-white transition-colors py-1 relative group">
                Soporte
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
              <a href="#faq" className="hover:text-white transition-colors py-1 relative group">
                Preguntas frecuentes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
              <a href="#contacto" className="hover:text-white transition-colors py-1 relative group">
                Contacto
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('proyectos')} 
                className="hover:text-white transition-colors font-medium text-xs uppercase tracking-wider cursor-pointer py-1 relative group"
              >
                Proyectos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>
              <button 
                onClick={() => onNavigate('estudiantes')} 
                className="hover:text-white transition-colors font-medium text-xs uppercase tracking-wider cursor-pointer py-1 relative group"
              >
                Estudiantes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>
              <a href="#como-funciona" className="hover:text-white transition-colors py-1 relative group">
                ¿Cómo funciona?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            </>
          )}
        </nav>

        {/* BOTONES GHOST & ACCIONES */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              
              {/* BOTÓN GHOST MIS PUBLICACIONES */}
              {onOpenMyPublications && (
                <button
                  onClick={onOpenMyPublications}
                  title="Ver mis publicaciones"
                  className="btn-ghost-glow text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">📂</span> Mis Publicaciones
                </button>
              )}

              {/* BOTÓN CHAT HUB & MENSAJES */}
              {onOpenChatHub && (
                <button
                  onClick={onOpenChatHub}
                  title="Abrir Chat Hub & Mensajes"
                  className="btn-ghost-glow text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">💬</span> Mensajes
                </button>
              )}

              {/* BOTÓN CAMPANA DE NOTIFICACIONES */}
              <button
                onClick={onOpenNotifications}
                title="Centro de notificaciones"
                className="relative btn-ghost-glow w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
              >
                <span className="text-base">🔔</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4.5 h-4.5 rounded-full font-black flex items-center justify-center animate-pulse border-2 border-[#07090E]">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* BOTÓN PANEL ADMIN (SOLO SI ES ADMIN) */}
              {user.rol === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  title="Panel de Administración"
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                >
                  <span>👑 Panel Admin</span>
                  {pendingCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )}

              {/* BOTÓN PERFIL DE USUARIO */}
              <button 
                onClick={onOpenProfile}
                title="Editar mi perfil"
                className="flex items-center gap-2.5 btn-ghost-glow px-3.5 py-1.5 rounded-xl cursor-pointer group"
              >
                {user.fotoUrl ? (
                  <img src={user.fotoUrl} alt="Avatar" className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/40" />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                  {user.nombre}
                </span>
                {user.rol === 'admin' && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-400/30">
                    ADMIN
                  </span>
                )}
              </button>

              {/* CERRAR SESIÓN */}
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-slate-300 hover:text-white btn-ghost-glow px-4.5 py-2 rounded-xl font-bold text-xs cursor-pointer"
              >
                Iniciar sesión
              </button>

              <button 
                onClick={() => onOpenAuth('register')}
                className="btn-accent-gradient px-5 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer"
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
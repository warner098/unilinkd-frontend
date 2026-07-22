import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenAuth }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error al leer el usuario:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO UNILINKD CON ISOTIPO ÚNICO */}
        <a href="#" className="flex items-center gap-2.5 group">
          {/* Ícono de conexión estilo infinito / enlace */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg 
              className="w-full h-full text-indigo-600 transition-transform group-hover:scale-105" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="unilinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" /> {/* Azul */}
                  <stop offset="100%" stopColor="#7C3AED" /> {/* Morado */}
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

          {/* Texto del Nombre */}
          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            UniLink<span className="text-indigo-600">d</span>
          </span>
        </a>

        {/* MENÚ CENTRAL */}
        <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium text-sm">
          <a href="#proyectos" className="hover:text-indigo-600 transition-colors">Proyectos</a>
          <a href="#proyectos" className="hover:text-indigo-600 transition-colors">Estudiantes</a>
          <a href="#como-funciona" className="hover:text-indigo-600 transition-colors">¿Cómo funciona?</a>
        </nav>

        {/* BOTONES DE ACCESO / USUARIO LOGUEADO */}
        <div className="flex items-center gap-3">
          {user ? (
            /* VISTA CON SESIÓN INICIADA */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full shadow-sm">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {user.nombre}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-full transition-all"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            /* VISTA SIN SESIÓN (TUS BOTONES ORIGINALES) */
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
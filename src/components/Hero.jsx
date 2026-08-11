import React, { useState } from 'react';

export default function Hero({ onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('Ingeniería & Software');

  const categorias = [
    { nombre: 'Ingeniería & Software', icono: '💻' },
    { nombre: 'Medicina & Salud', icono: '🩺' },
    { nombre: 'Economía & Finanzas', icono: '📊' },
    { nombre: 'Derecho & Legal', icono: '⚖️' },
    { nombre: 'Diseño & Arquitectura', icono: '🎨' },
    { nombre: 'Marketing & Comunicación', icono: '📢' },
    { nombre: 'Administración', icono: '💼' },
    { nombre: 'Investigación & Ciencia', icono: '🔬' },
  ];

  return (
    <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
      
      {/* GLOW ORBS AMBIENTALES DE FONDO */}
      <div className="glow-orb w-[500px] h-[500px] bg-blue-600/20 -top-20 -left-20 animate-pulse-glow"></div>
      <div className="glow-orb w-[450px] h-[450px] bg-violet-600/20 bottom-0 right-0 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* COLUMNA IZQUIERDA: MENSAJE PRINCIPAL */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/15 backdrop-blur-md px-4 py-2 rounded-full text-indigo-300 text-xs font-extrabold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>🎓 La Red Profesional y Universitaria N° 1</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight font-heading">
            Conecta, Colabora e Impulsa tus <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">Proyectos Universitarios</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            UniLinkd conecta a estudiantes multidisciplinarios de todas las áreas: desde software, medicina y economía hasta derecho y diseño. Construye tu portafolio, encuentra ayuda técnica o postula tus habilidades hoy.
          </p>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-wrap items-center gap-3.5 pt-4">
            <button 
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-black px-7 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/25 transition-all text-sm hover:scale-105 cursor-pointer border border-white/20"
            >
              Comenzar Gratis ✨
            </button>
            
            <a 
              href="#seccion-explorar"
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-6 py-3.5 rounded-2xl backdrop-blur-md transition-all text-sm border border-white/15 cursor-pointer hover:scale-105"
            >
              Explorar Ofertas Activas 🔍
            </a>
          </div>

          {/* DATOS RÁPIDOS / TRUST */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-heading">+100%</p>
              <p className="text-xs text-slate-400 font-medium">Multidisciplinario</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">Verificados</p>
              <p className="text-xs text-slate-400 font-medium font-heading">Proyectos & Tareas</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">Moderado</p>
              <p className="text-xs text-slate-400 font-medium">Por Administradores</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: EXPLORADOR DE ÁREAS GLASSMARPHISM */}
        <div className="lg:col-span-5 glass-card-dark rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10 text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white font-heading">
              Explora por área de estudio
            </h2>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              8 Categorías
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Selecciona tu especialidad para descubrir proyectos activos y estudiantes destacados:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {categorias.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(cat.nombre)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === cat.nombre
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30 scale-105'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:border-indigo-400/50 hover:bg-white/10'
                }`}
              >
                <span>{cat.icono}</span>
                <span>{cat.nombre}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>¿Publicaste tu perfil?</span>
            <span className="text-indigo-400 font-bold">
              Únete a la comunidad de UniLinkd →
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
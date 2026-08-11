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
    <section className="relative overflow-hidden py-24 px-6 bg-[#07090E] text-white bg-grid-pattern-dark border-b border-white/5">
      
      {/* ORBES DE LUZ AMBIENTAL */}
      <div className="glow-orb-dark w-[600px] h-[600px] bg-indigo-600/20 -top-30 -left-30"></div>
      <div className="glow-orb-dark w-[500px] h-[500px] bg-violet-600/15 bottom-0 right-0"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* COLUMNA IZQUIERDA: OVERSIZED TYPOGRAPHY AWWWARDS */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>PROYECTOS & COLABORACIÓN UNIVERSITARIA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight font-heading">
            Conecta. <br />
            Colabora. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Impulsa tu carrera.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl">
            UniLinkd une a estudiantes multidisciplinarios de todas las facultades: desarrollo, medicina, economía, derecho y diseño. Construye tu portafolio verificado hoy.
          </p>

          {/* BOTONES GHOST & ACCENT */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button 
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="btn-accent-gradient font-black px-8 py-4 rounded-2xl text-sm cursor-pointer"
            >
              Comenzar Gratis ✨
            </button>
            
            <a 
              href="#seccion-explorar"
              className="btn-ghost-glow font-bold px-7 py-4 rounded-2xl text-sm cursor-pointer"
            >
              Explorar Ofertas Activas 🔍
            </a>
          </div>

          {/* DATOS RÁPIDOS EN BENTO TILES */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-heading">+100%</p>
              <p className="text-xs text-slate-400 font-medium font-mono-code">Multidisciplinario</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">Verificados</p>
              <p className="text-xs text-slate-400 font-medium font-mono-code">Proyectos & Tareas</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-heading">Moderado</p>
              <p className="text-xs text-slate-400 font-medium font-mono-code">Por Administradores</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: BENTO CARD DE CATEGORÍAS */}
        <div className="lg:col-span-5 bento-card-glow p-8 relative text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white font-heading">
              Explora por especialidad
            </h2>
            <span className="text-xs font-mono-code font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              8 Categorías
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Selecciona tu facultad o materia para descubrir iniciativas activas:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {categorias.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(cat.nombre)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === cat.nombre
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:border-indigo-400/50 hover:bg-white/10'
                }`}
              >
                <span>{cat.icono}</span>
                <span>{cat.nombre}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>¿Eres estudiante o tutor?</span>
            <span className="text-indigo-400 font-bold">
              Únete a UniLinkd →
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
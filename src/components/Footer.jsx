import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* BANNER CTA DE CIERRE */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ¿Listo para dar tus primeros pasos profesionales?
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Únete a UniLinkd, conecta con tus compañeros universitarios y empieza a armar la experiencia que necesitas para tu futuro.
            </p>
            <div className="pt-2">
              <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-7 py-3 rounded-full text-xs sm:text-sm transition-all shadow-md hover:scale-105">
                Crear cuenta gratis →
              </button>
            </div>
          </div>
        </div>

        {/* CONTENIDO DEL FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-slate-800 text-left">
          
          {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-black text-sm px-2.5 py-1 rounded-lg">U</span>
              <span className="text-lg font-extrabold text-white tracking-tight">UniLinkd</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              La plataforma que conecta a estudiantes universitarios para colaborar, aprender y dar sus primeros pasos al mundo laboral.
            </p>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Navegación</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#proyectos" className="hover:text-white transition-colors">Proyectos</a></li>
              <li><a href="#proyectos" className="hover:text-white transition-colors">Estudiantes / Ayudantes</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">¿Cómo funciona?</a></li>
            </ul>
          </div>

          {/* COLUMNA 3: COMUNIDAD */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Comunidad</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Universidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Normas de la comunidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
            </ul>
          </div>

        </div>

        {/* DERECHOS */}
        <div className="pt-8 border-t border-slate-800/60 text-center md:text-left text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} UniLinkd. Todos los derechos reservados.</p>
          <p className="text-slate-500">Diseñado para estudiantes universitarios 🎓</p>
        </div>

      </div>
    </footer>
  );
}
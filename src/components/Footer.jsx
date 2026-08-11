import React from 'react';

export default function Footer({ onOpenAuth }) {
  return (
    <footer className="bg-[#07090E] text-white pt-16 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* BANNER BENTO CTA DE CIERRE */}
        <div className="bento-hero p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">
              ¿Listo para dar tus primeros pasos profesionales?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Únete a UniLinkd, conecta con tus compañeros universitarios y empieza a armar el portafolio que impulsará tu carrera.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className="btn-accent-gradient font-black px-7 py-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer"
              >
                Crear cuenta gratis →
              </button>
            </div>
          </div>
        </div>

        {/* CONTENIDO DEL FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-white/10 text-left">
          
          {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">U</span>
              <span className="text-lg font-black text-white font-heading">UniLinkd</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              La plataforma que conecta a estudiantes universitarios para colaborar, aprender y dar sus primeros pasos al mundo laboral.
            </p>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300">Navegación</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-normal">
              <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#seccion-explorar" className="hover:text-white transition-colors">Proyectos</a></li>
              <li><a href="#seccion-explorar" className="hover:text-white transition-colors">Estudiantes / Ayudantes</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">¿Cómo funciona?</a></li>
            </ul>
          </div>

          {/* COLUMNA 3: COMUNIDAD */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300">Comunidad</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-normal">
              <li><a href="#" className="hover:text-white transition-colors">Universidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Normas de la comunidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300">Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-normal">
              <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
            </ul>
          </div>

        </div>

        {/* DERECHOS */}
        <div className="pt-8 border-t border-white/5 text-center md:text-left text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} UniLinkd. Todos los derechos reservados.</p>
          <p className="text-slate-500 font-mono-code text-[11px]">Diseñado para estudiantes universitarios 🎓</p>
        </div>

      </div>
    </footer>
  );
}
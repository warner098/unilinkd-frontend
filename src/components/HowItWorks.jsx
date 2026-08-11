import React from 'react';

export default function HowItWorks() {
  const pasos = [
    {
      numero: '01',
      titulo: 'Crea tu perfil universitario',
      descripcion: 'Regístrate con tu correo personal o institucional. Añade tu carrera, semestre y las habilidades o materias que dominas.',
      icono: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      numero: '02',
      titulo: 'Publica o encuentra apoyo',
      descripcion: 'Sube un proyecto donde necesites colaboradores o explora perfiles de compañeros para pedirles ayuda puntual.',
      icono: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      numero: '03',
      titulo: 'Colabora y suma experiencia',
      descripcion: 'Trabaja en equipo, recibe retroalimentación y empieza a construir tu primer portafolio profesional verificado.',
      icono: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section id="como-funciona" className="py-20 px-6 bg-slate-50 relative border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto space-y-14 text-center relative z-10">
        
        {/* ENCABEZADO */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 px-4 py-1.5 rounded-full text-indigo-700 text-xs font-extrabold shadow-xs">
            <span>⚡ Paso a Paso</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
            ¿Cómo funciona UniLinkd?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal">
            Tres sencillos pasos para conectar con estudiantes de todas las facultades.
          </p>
        </div>

        {/* TARJETAS DE PASOS GLASSMARPHISM ELEVADAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
          {pasos.map((paso, index) => (
            <div 
              key={index}
              className="glass-card rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group border border-slate-200/80 hover:border-indigo-300"
            >
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                    {paso.icono}
                  </div>
                  <span className="text-4xl font-black bg-gradient-to-r from-slate-200 to-indigo-200 bg-clip-text text-transparent font-heading">
                    {paso.numero}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {paso.titulo}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {paso.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
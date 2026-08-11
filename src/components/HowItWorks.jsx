import React from 'react';

export default function HowItWorks() {
  const pasos = [
    {
      numero: '01',
      titulo: 'Crea tu perfil universitario',
      descripcion: 'Regístrate con tu correo institucional o personal. Añade tu carrera, semestre y las tecnologías o habilidades que dominas.',
      icono: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      numero: '02',
      titulo: 'Publica o encuentra apoyo',
      descripcion: 'Sube un proyecto donde necesites colaboradores o explora perfiles de compañeros para pedirles tutorías o ayuda puntual.',
      icono: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      numero: '03',
      titulo: 'Colabora y suma experiencia',
      descripcion: 'Trabaja en equipo, recibe retroalimentación y empieza a construir tu primer portafolio profesional verificado.',
      icono: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section id="como-funciona" className="py-24 px-6 bg-[#07090E] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto space-y-14 text-center relative z-10">
        
        {/* ENCABEZADO OVERSIZED */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
            <span>⚡ PASO A PASO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
            ¿Cómo funciona UniLinkd?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-normal">
            Tres pasos clave para conectar con estudiantes de todas las facultades.
          </p>
        </div>

        {/* TARJETAS DE PASOS BENTO-BOX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
          {pasos.map((paso, index) => (
            <div 
              key={index}
              className="bento-card p-8 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
                    {paso.icono}
                  </div>
                  <span className="text-4xl font-black bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent font-heading">
                    {paso.numero}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white font-heading">
                  {paso.titulo}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
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
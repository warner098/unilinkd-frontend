import React from 'react';

export default function HowItWorks() {
  const pasos = [
    {
      numero: '01',
      titulo: 'Crea tu perfil universitario',
      descripcion: 'Regístrate con tu correo personal o institucional. Añade tu carrera, semestre y las habilidades o materias que dominas.',
      icono: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      numero: '02',
      titulo: 'Publica o encuentra apoyo',
      descripcion: 'Sube un proyecto donde necesites colaboradores o explora perfiles de compañeros para pedirles ayuda puntual.',
      icono: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      numero: '03',
      titulo: 'Colabora y suma experiencia',
      descripcion: 'Trabaja en equipo, califica la experiencia y empieza a construir tu primer portafolio para el mundo laboral.',
      icono: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section id="como-funciona" className="py-20 px-6 bg-slate-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-12 text-center">
        
        {/* ENCABEZADO */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-semibold">
            <span>⚡ Paso a Paso</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            ¿Cómo funciona UniLinkd?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Tres sencillos pasos para empezar a conectar con estudiantes de todas las facultades.
          </p>
        </div>

        {/* TARJETAS DE PASOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
          {pasos.map((paso, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
                    {paso.icono}
                  </div>
                  <span className="text-3xl font-black text-indigo-200">
                    {paso.numero}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0F172A]">
                  {paso.titulo}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
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
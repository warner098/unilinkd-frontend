import React from 'react';

export default function Features() {
  const soluciones = [
    {
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      titulo: 'Adiós a los grupos a ciegas',
      problema: 'Buscar compañeros en grupos informales suele terminar en equipos desintegrados.',
      solucion: 'Encuentra colaboradores comprometidos según sus habilidades reales, carrera y experiencia previa.'
    },
    {
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      titulo: 'Sinergia Multidisciplinaria',
      problema: 'Es difícil conectar con estudiantes de otras facultades para proyectos complejos.',
      solucion: 'Conecta a un estudiante de Medicina con uno de Software, Economía o Derecho en un solo clic.'
    },
    {
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      titulo: 'Portafolio Temprano Verificado',
      problema: 'Muchos estudiantes se gradúan sin proyectos visibles para el mercado laboral.',
      solucion: 'Muestra proyectos reales completados y colaboraciones antes de salir a trabajar.'
    },
    {
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titulo: 'Servicios e Intercambio Académico',
      problema: 'Necesitas ayuda en materias puntuales y no sabes a quién acudir de confianza.',
      solucion: 'Encuentra compañeros que ofrecen tutorías o servicios, o monetiza tus propios conocimientos.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#07090E] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto text-center space-y-14 relative z-10">
        
        {/* ENCABEZADO OVERSIZED */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
            <span>💡 ARQUITECTURA DEL PROYECTO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
            Diseñado para la comunidad universitaria
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-normal max-w-2xl mx-auto">
            Centralizamos la colaboración, el talento y las oportunidades académicas en un entorno seguro y transparente.
          </p>
        </div>

        {/* GRID DE MÓDULOS BENTO-BOX */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {soluciones.map((item, index) => (
            <div 
              key={index}
              className="bento-card p-7 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
                  {item.icono}
                </div>

                <h3 className="text-lg font-extrabold text-white font-heading">
                  {item.titulo}
                </h3>
                
                <p className="text-xs text-rose-300 font-bold bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20">
                  <span className="font-extrabold">Reto:</span> {item.problema}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  <span className="font-extrabold text-emerald-400">Solución:</span> {item.solucion}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
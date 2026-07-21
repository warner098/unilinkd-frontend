import React from 'react';

export default function Features() {
  const soluciones = [
    {
      icono: (
        <svg className="w-6 h-6 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      titulo: 'Adiós a los grupos a ciegas',
      problema: 'Buscar compañeros en grupos de WhatsApp o redes informales suele terminar en equipos desintegrados.',
      solucion: 'Encuentra colaboradores comprometidos basándote en sus habilidades reales, carrera y experiencia previa.'
    },
    {
      icono: (
        <svg className="w-6 h-6 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      titulo: 'Sinergia Multidisciplinaria',
      problema: 'Es difícil conectar con estudiantes de otras facultades para proyectos complejos o emprendimientos.',
      solucion: 'Conecta a un estudiante de Medicina con uno de Sistemas, Economía o Diseño en un solo lugar.'
    },
    {
      icono: (
        <svg className="w-6 h-6 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      titulo: 'Portafolio Temprano Verificado',
      problema: 'Muchos estudiantes se gradúan sin experiencia práctica ni proyectos visibles para el mercado.',
      solucion: 'Muestra trabajos completados, colaboraciones académicas y servicios prestados antes de salir a trabajar.'
    },
    {
      icono: (
        <svg className="w-6 h-6 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titulo: 'Servicios e Intercambio Académico',
      problema: 'A veces necesitas ayuda específica en una materia (ej: redacción, análisis estadístico) y no sabes a quién acudir.',
      solucion: 'Encuentra compañeros que ofrecen asesorías o servicios puntuales, o monetiza tus propios conocimientos.'
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        
        {/* ENCABEZADO DE SECCIÓN CORREGIDO */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-semibold">
            <span>💡 ¿Por qué UniLinkd?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Diseñado para resolver los problemas reales del entorno universitario
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Centralizamos la colaboración, el talento y las oportunidades académicas en un espacio seguro y profesional.
          </p>
        </div>

        {/* GRID DE CARDS CON HOVER CORREGIDO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {soluciones.map((item, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Contenedor del ícono: cambia a fondo azul y fuerza el ícono a ser blanco al pasar el mouse */}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                  {item.icono}
                </div>

                <h3 className="text-lg font-bold text-[#0F172A]">
                  {item.titulo}
                </h3>
                
                <p className="text-xs text-rose-600 font-medium bg-rose-50 px-2.5 py-1.5 rounded-md border border-rose-100">
                  <span className="font-bold">Problema:</span> {item.problema}
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-emerald-600">Solución:</span> {item.solucion}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
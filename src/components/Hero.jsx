import React, { useState } from 'react';

export default function Hero() {
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
    <section className="bg-white border-b border-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* COLUMNA IZQUIERDA: MENSAJE PRINCIPAL */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-semibold">
            <span>🎓 La red profesional universitaria</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
            Encuentra el equipo, proyecto o servicio ideal para ti
          </h1>

          <p className="text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
            UniLinkd conecta estudiantes de todas las disciplinas: desde medicina y economía hasta derecho y tecnología. Construye tu portafolio, colabora en proyectos reales o busca personas que te ayuden en lo que necesites.
          </p>

          {/* TRIPLE BOTÓN DE ACCIÓN (PROYECTOS / BUSCAR SERVICIO / OFRECER SERVICIO) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-md shadow-indigo-100 transition-all text-sm">
              Explorar proyectos
            </button>
            
            <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-6 py-3 rounded-full transition-all text-sm border border-indigo-200">
              Buscar un servicio
            </button>

            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-full transition-all text-sm hover:bg-gray-50">
              Ofrecer un servicio
            </button>
          </div>

          {/* DATOS RÁPIDOS / TRUST */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 text-left">
            <div>
              <p className="text-2xl font-extrabold text-indigo-600">+100%</p>
              <p className="text-xs text-gray-500 font-medium">Multidisciplinario</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0F172A]">Proyectos</p>
              <p className="text-xs text-gray-500 font-medium">Académicos & Startups</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0F172A]">Servicios</p>
              <p className="text-xs text-gray-500 font-medium">Entre estudiantes</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: EXPLORADOR DE ÁREAS */}
        <div className="lg:col-span-5 bg-gray-50/80 border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#0F172A] mb-2 text-left">
            Explora por área de estudio
          </h2>
          <p className="text-xs text-gray-500 mb-6 text-left">
            Selecciona una disciplina para descubrir talento, tareas y proyectos activos:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {categorias.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(cat.nombre)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                  activeTab === cat.nombre
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <span>{cat.icono}</span>
                <span>{cat.nombre}</span>
              </button>
            ))}
          </div>

          {/* TEXTO INFERIOR CORREGIDO A ÁREAS */}
          <div className="mt-6 pt-5 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
            <span>¿Buscas otra especialidad?</span>
            <a href="#areas" className="text-indigo-600 font-semibold hover:underline">
              Ver todas las áreas →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
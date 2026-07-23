import React, { useState } from 'react';

// Datos de ejemplo para estructurar la interfaz
const mockEstudiantes = [
  {
    id: 1,
    nombre: 'Carlos Pincay',
    carrera: 'Tecnologías de la Información',
    semestre: '6to Semestre',
    rol: 'Administración de Bases de Datos & Backend',
    habilidades: ['MongoDB', 'Express', 'Node.js', 'SQL'],
    descripcion: 'Ofrezco ayuda y asesoría en optimización de bases de datos relacionales, consultas complejas y APIs REST.',
    disponible: true
  },
  {
    id: 2,
    nombre: 'María José',
    carrera: 'Ingeniería Software',
    semestre: '8vo Semestre',
    rol: 'Frontend Developer',
    habilidades: ['React', 'Tailwind CSS', 'Figma'],
    descripcion: 'Diseño interfaces modernas e integraciones fluidas con React. Disponible para tutorías de maquetación.',
    disponible: true
  }
];

const mockProyectos = [
  {
    id: 1,
    titulo: 'Sistema de Exámenes Online Anti-Cheating',
    materia: 'Sistemas Distribuidos',
    vacantes: '2 Colaboradores',
    tecnologias: ['React', 'Node.js', 'WebSockets'],
    descripcion: 'Buscamos estudiantes de Backend para integrar controles de verificación en tiempo real y detección de eventos.'
  },
  {
    id: 2,
    titulo: 'Plataforma Web de Gestión Universitaria',
    materia: 'Base de Datos Avanzada',
    vacantes: '1 Diseñador UI/UX',
    tecnologias: ['MongoDB', 'Express', 'Tailwind'],
    descripcion: 'Proyecto en marcha para conectar estudiantes y docentes. Necesitamos apoyo en maquetación de componentes.'
  }
];

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('servicios');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BANNER DE BIENVENIDA */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Espacio Universitario
            </span>
            <h1 className="text-3xl font-black mt-2">
              ¡Bienvenido de nuevo, {user?.nombre || 'Estudiante'}! 👋
            </h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              Explora ofertas de colaboración, encuentra ayuda técnica con otros compañeros o postula tus habilidades a proyectos activos.
            </p>
          </div>
          <button className="bg-white text-indigo-600 font-bold px-5 py-3 rounded-2xl hover:bg-indigo-50 transition-all shadow-md text-sm whitespace-nowrap">
            + Publicar Servicio o Proyecto
          </button>
        </div>

        {/* NAVEGACIÓN ENTRE SECCIONES (TABS) */}
        <div className="flex border-b border-gray-200 justify-center sm:justify-start gap-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('servicios')}
            className={`pb-4 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'servicios'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🤝 Estudiantes & Servicios
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
              {mockEstudiantes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('proyectos')}
            className={`pb-4 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'proyectos'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🚀 Proyectos & Tareas (Buscando ayuda)
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {mockProyectos.length}
            </span>
          </button>
        </div>

        {/* CONTENIDO: SERVICIOS DE ESTUDIANTES */}
        {activeTab === 'servicios' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEstudiantes.map((est) => (
              <div key={est.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      ● Disponible
                    </span>
                    <span className="text-xs font-medium text-gray-400">{est.semestre}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {est.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{est.nombre}</h3>
                      <p className="text-xs text-indigo-600 font-medium">{est.rol}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs mt-4 leading-relaxed">
                    {est.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {est.habilidades.map((hab, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-1 rounded-md">
                        {hab}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-6 w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors">
                  Contactar por Ayuda
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CONTENIDO: PROYECTOS / TAREAS */}
        {activeTab === 'proyectos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProyectos.map((proj) => (
              <div key={proj.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {proj.materia}
                    </span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                      {proj.vacantes}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-lg mt-4">{proj.titulo}</h3>
                  <p className="text-gray-600 text-xs mt-2 leading-relaxed">
                    {proj.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.tecnologias.map((tec, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-2 py-1 rounded-md">
                        {tec}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-sm">
                  Unirme al Proyecto
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
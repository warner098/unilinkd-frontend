import React, { useState } from 'react';

export default function ContentSection() {
  const [activeTab, setActiveTab] = useState('proyectos');

  // PROYECTOS / CONVOCATORIAS REALISTAS (NIVEL ESTUDIANTIL/INICIAL)
  const proyectos = [
    {
      id: 1,
      titulo: 'Grupo de estudio y práctica para Programación Web',
      areaPrincipal: 'Ingeniería & Software',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      descripcion: 'Buscamos compañeros de primeros semestres para practicar maquetación en HTML/CSS y armar un proyecto sencillo para la materia.',
      buscando: ['Estudiantes de HTML/CSS', 'Lógica de Programación'],
      autor: 'Carlos P. (3er Semestre)',
      fecha: 'Hace 2 horas',
    },
    {
      id: 2,
      titulo: 'Búsqueda de diseñador para presentación de Exposición',
      areaPrincipal: 'Diseño & Comunicación',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      descripcion: 'Necesitamos a alguien que nos ayude a organizar las diapositivas y el diseño visual para una defensa de proyecto final.',
      buscando: ['Diseño de Diapositivas', 'Canva / PowerPoint'],
      autor: 'Sofi R. (4to Semestre - Administración)',
      fecha: 'Hace 5 horas',
    },
    {
      id: 3,
      titulo: 'Redacción y revisión bibliográfica para investigación',
      areaPrincipal: 'Derecho & Ciencias Sociales',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      descripcion: 'Armando un grupo para organizar fuentes, aplicar normas APA y redactar el marco teórico de un ensayo académico.',
      buscando: ['Redacción', 'Normas APA'],
      autor: 'Mateo L. (2do Semestre - Derecho)',
      fecha: 'Ayer',
    },
  ];

  // PERFILES DE ESTUDIANTES / TALENTO (EJEMPLO CAROL MERCHÁN)
  const perfiles = [
    {
      id: 1,
      nombre: 'Carol Merchán',
      carrera: 'Diseño Gráfico & Multimedia',
      semestre: '5to Semestre',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      estrellas: '5.0',
      resenas: 12,
      descripcion: 'Apasionada por el diseño limpio y prototipado. Ofrezco ayuda en creación de diapositivas, organización visual de proyectos y vectores.',
      categorias: ['Diseño UI', 'Canva/Figma', 'Presentaciones', 'Ilustración'],
    },
    {
      id: 2,
      nombre: 'Kevin Lucas',
      carrera: 'Ingeniería en Tecnologías de la Información',
      semestre: '4to Semestre',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      estrellas: '4.9',
      resenas: 8,
      descripcion: 'Te ayudo a entender temas de lógica de programación, bases de datos básicas (SQL) y resolución de ejercicios prácticos.',
      categorias: ['JavaScript', 'HTML/CSS', 'Base de Datos', 'Tutoría'],
    },
    {
      id: 3,
      nombre: 'Sammy Lawrence',
      carrera: 'Administración & Marketing',
      semestre: '6to Semestre',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      estrellas: '5.0',
      resenas: 15,
      descripcion: 'Sólida experiencia en revisión de ortografía, formato de trabajos académicos, normas APA y estructuración de informes.',
      categorias: ['Normas APA', 'Redacción', 'Excel Básico', 'Organización'],
    },
  ];

  return (
    <section id="proyectos" className="py-20 px-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ENCABEZADO Y PESTAÑAS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-semibold">
              <span>🔥 Explora e Iníciate en el Mundo Laboral</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Conecta, aprende y gana tus primeras experiencias
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Encuentra iniciativas sencillas para colaborar o contacta a compañeros dispuestos a darte una mano.
            </p>
          </div>

          {/* BOTONES INTERACTIVOS DE PESTAÑA (ESTILIZADOS Y FINOS) */}
          <div className="inline-flex bg-gray-100/80 p-1 rounded-xl self-start md:self-auto border border-gray-200/80">
            <button
              onClick={() => setActiveTab('proyectos')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'proyectos'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <span>🚀</span> Proyectos Estudiantiles
            </button>

            <button
              onClick={() => setActiveTab('perfiles')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'perfiles'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <span>👤</span> Estudiantes / Ayudantes
            </button>
          </div>
        </div>

        {/* TAB 1: PROYECTOS NIVEL ESTUDIANTIL */}
        {activeTab === 'proyectos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {proyectos.map((p) => (
              <div 
                key={p.id} 
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${p.badgeColor}`}>
                      {p.areaPrincipal}
                    </span>
                    <span className="text-xs text-gray-400">{p.fecha}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] hover:text-indigo-600 transition-colors">
                    {p.titulo}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {p.descripcion}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Apoyo / Habilidades buscadas:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.buscando.map((rol, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">
                          +{rol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">{p.autor}</span>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                    Unirme →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TARJETAS DE PERFILES */}
        {activeTab === 'perfiles' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {perfiles.map((student) => (
              <div 
                key={student.id} 
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Encabezado del Perfil con Foto */}
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={student.avatar} 
                      alt={student.nombre} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] group-hover:text-indigo-600 transition-colors">
                        {student.nombre}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {student.carrera}
                      </p>
                      <p className="text-[11px] text-indigo-600 font-semibold">
                        {student.semestre}
                      </p>
                    </div>
                  </div>

                  {/* Calificación en Estrellas */}
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1 rounded-lg w-fit">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="text-xs font-bold text-amber-900">{student.estrellas}</span>
                    <span className="text-[11px] text-amber-700">({student.resenas} colaboraciones)</span>
                  </div>

                  {/* Descripción / Lo que sabe hacer */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {student.descripcion}
                  </p>

                  {/* Categorías / Habilidades */}
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Categorías & Áreas:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.categorias.map((cat, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-100/60">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botón de Contacto directo */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Disponible
                  </span>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full text-xs transition-all shadow-sm">
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
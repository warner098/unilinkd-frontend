import React, { useState, useEffect } from 'react';

export default function ContentSection({ activeTab, setActiveTab, onOpenPublicationModal, user }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [dbProjects, setDbProjects] = useState([]);
  const [dbServices, setDbServices] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  // Estado para la barra de búsqueda por texto
  const [searchQuery, setSearchQuery] = useState('');

  // Categorías de filtro
  const categorias = [
    'Todas',
    'Programación / Software',
    'Matemáticas',
    'Ciencias',
    'Diseño & Multimedia',
    'Derecho',
    'Otras'
  ];

  // CARGAR PROYECTOS DESDE EL BACKEND
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const url = selectedCategory === 'Todas' 
        ? 'http://localhost:5000/api/projects'
        : `http://localhost:5000/api/projects?categoria=${encodeURIComponent(selectedCategory)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDbProjects(data);
      } else {
        setDbProjects([]);
      }
    } catch (err) {
      console.error('Error al obtener proyectos:', err);
      setDbProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  // CARGAR SERVICIOS DESDE EL BACKEND
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await fetch('http://localhost:5000/api/services');
      if (res.ok) {
        const data = await res.json();
        setDbServices(data);
      } else {
        setDbServices([]);
      }
    } catch (err) {
      console.error('Error al obtener servicios:', err);
      setDbServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  useEffect(() => {
    fetchServices();
  }, []);

  // Comprobar si el usuario actual es el dueño O si es Administrador
  const canDelete = (item) => {
    if (!user) return false;
    if (user.rol === 'admin') return true;

    const currentUserId = user.id || user._id;
    const currentUserName = user.nombre ? user.nombre.trim().toLowerCase() : '';

    if (currentUserId && item.autorId && currentUserId.toString() === item.autorId.toString()) {
      return true;
    }

    const itemAuthor = (item.autor || item.nombreEstudiante || '').trim().toLowerCase();
    if (currentUserName && itemAuthor && currentUserName === itemAuthor) {
      return true;
    }

    return false;
  };

  // ELIMINAR PROYECTO
  const handleDeleteProject = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          autorNombre: user?.nombre,
          userRol: user?.rol
        })
      });

      if (res.ok) {
        setDbProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
      } else {
        const data = await res.json();
        alert(data.msg || 'No se pudo eliminar el proyecto');
      }
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
      alert('Error de conexión al eliminar');
    }
  };

  // ELIMINAR SERVICIO
  const handleDeleteService = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          autorNombre: user?.nombre,
          userRol: user?.rol
        })
      });

      if (res.ok) {
        setDbServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
      } else {
        const data = await res.json();
        alert(data.msg || 'No se pudo eliminar el servicio');
      }
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      alert('Error de conexión al eliminar');
    }
  };

  // Filtrar Servicios por texto de búsqueda
  const filteredServices = dbServices.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = (s.nombreEstudiante || '').toLowerCase().includes(q);
    const matchSpec = (s.areaEspecialidad || '').toLowerCase().includes(q);
    const matchDesc = (s.descripcion || '').toLowerCase().includes(q);
    const matchTags = (s.etiquetas || []).some((t) => t.toLowerCase().includes(q));
    return matchName || matchSpec || matchDesc || matchTags;
  });

  // Filtrar Proyectos por texto de búsqueda
  const filteredProjects = dbProjects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchTitle = (p.titulo || '').toLowerCase().includes(q);
    const matchAuthor = (p.autor || '').toLowerCase().includes(q);
    const matchDesc = (p.descripcion || '').toLowerCase().includes(q);
    const matchCat = (p.categoriaPrincipal || '').toLowerCase().includes(q);
    const matchTags = (p.etiquetas || []).some((t) => t.toLowerCase().includes(q));
    return matchTitle || matchAuthor || matchDesc || matchCat || matchTags;
  });

  return (
    <section id="seccion-explorar" className="py-20 px-4 sm:px-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ENCABEZADO Y PESTAÑAS PRINCIPALES */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-bold">
              <span>🔥 Explora e Iníciate en el Mundo Laboral</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Conecta, aprende y gana tus primeras experiencias
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Encuentra iniciativas sencillas para colaborar o contacta a compañeros dispuestos a darte una mano.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* BOTÓN PUBLICAR */}
            {onOpenPublicationModal && (
              <button
                onClick={onOpenPublicationModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
              >
                <span>+</span> Publicar Servicio o Proyecto
              </button>
            )}

            {/* BOTONES INTERACTIVOS DE PESTAÑA */}
            <div className="inline-flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/80">
              <button
                onClick={() => setActiveTab('proyectos')}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'proyectos'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <span>🚀</span> Proyectos Estudiantiles
              </button>

              <button
                onClick={() => setActiveTab('estudiantes')}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'estudiantes'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <span>👤</span> Estudiantes / Ayudantes
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE FILTROS POR CATEGORÍA Y BUSCADOR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          {activeTab === 'proyectos' ? (
            <div className="flex flex-wrap gap-2 items-center text-left">
              <span className="text-xs font-extrabold text-gray-500 mr-1 uppercase tracking-wider">
                Categorías:
              </span>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              Estudiantes & Tutores Universitarios
            </span>
          )}

          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, título o etiqueta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* TAB 1: PROYECTOS / CONVOCATORIAS */}
        {activeTab === 'proyectos' && (
          loadingProjects ? (
            <div className="py-12 text-center text-gray-400 text-xs font-semibold">Cargando proyectos...</div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredProjects.map((p) => (
                <div 
                  key={p._id || p.id} 
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                        {p.categoriaPrincipal || 'General'}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {p.colaboradoresBuscados || 'Colaboradores'}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#0F172A] group-hover:text-indigo-600 transition-colors">
                      {p.titulo}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {p.descripcion}
                    </p>

                    {p.mediaUrl && p.mediaUrl.startsWith('data:image') && (
                      <div className="mt-2">
                        <img src={p.mediaUrl} alt={p.titulo} className="w-full h-36 object-cover rounded-xl border border-gray-100" />
                      </div>
                    )}

                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-indigo-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg transition-colors"
                      >
                        <span>💻 Repositorio GitHub/GitLab</span> →
                      </a>
                    )}

                    {p.etiquetas && p.etiquetas.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Habilidades / Temas:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.etiquetas.map((rol, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-semibold">
                              +{rol}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 font-medium">Por: {p.autor || 'Estudiante'}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* BOTÓN ELIMINAR EXCLUSIVO DEL DUEÑO O ADMINISTRADOR */}
                      {canDelete(p) && (
                        <button
                          onClick={() => handleDeleteProject(p._id || p.id)}
                          title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi proyecto"}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>🗑️</span> Eliminar
                        </button>
                      )}

                      <button className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                        Unirme →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🚀
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">
                {searchQuery ? 'No se encontraron proyectos' : 'Aún no hay proyectos publicados'}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {searchQuery 
                  ? `No se encontraron coincidencias para "${searchQuery}".`
                  : 'No hay convocatorias activas en esta categoría. ¡Publica tu proyecto para empezar!'}
              </p>
              {onOpenPublicationModal && (
                <button
                  onClick={onOpenPublicationModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
                >
                  + Publicar Proyecto
                </button>
              )}
            </div>
          )
        )}

        {/* TAB 2: SERVICIOS DE ESTUDIANTES */}
        {activeTab === 'estudiantes' && (
          loadingServices ? (
            <div className="py-12 text-center text-gray-400 text-xs font-semibold">Cargando estudiantes...</div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredServices.map((student) => (
                <div 
                  key={student._id || student.id} 
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      {student.fotoUrl ? (
                        <img 
                          src={student.fotoUrl} 
                          alt={student.nombreEstudiante} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-black shadow-inner">
                          {(student.nombreEstudiante || 'E').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-[#0F172A] group-hover:text-indigo-600 transition-colors">
                          {student.nombreEstudiante}
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          {student.areaEspecialidad}
                        </p>
                        <p className="text-[11px] text-indigo-600 font-extrabold">
                          {student.semestre}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {student.descripcion}
                    </p>

                    {student.etiquetas && student.etiquetas.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Habilidades / Categorías:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {student.etiquetas.map((cat, i) => (
                            <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-100/60">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Disponible
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {/* BOTÓN ELIMINAR EXCLUSIVO DEL DUEÑO O ADMINISTRADOR */}
                      {canDelete(student) && (
                        <button
                          onClick={() => handleDeleteService(student._id || student.id)}
                          title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi servicio"}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>🗑️</span>
                        </button>
                      )}

                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-full text-xs transition-all shadow-xs cursor-pointer">
                        Contactar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🤝
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">
                {searchQuery ? 'No se encontraron estudiantes' : 'Aún no hay estudiantes registrados ofreciendo servicios'}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {searchQuery 
                  ? `No hay estudiantes o tutores que coincidan con "${searchQuery}".`
                  : 'Ofrece tus tutorías o habilidades para figurar en este apartado.'}
              </p>
              {onOpenPublicationModal && (
                <button
                  onClick={onOpenPublicationModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
                >
                  + Ofrecer Servicio / Tutoría
                </button>
              )}
            </div>
          )
        )}

      </div>
    </section>
  );
}
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function ContentSection({ activeTab, setActiveTab, onOpenPublicationModal, user }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [dbProjects, setDbProjects] = useState([]);
  const [dbServices, setDbServices] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categorias = [
    'Todas',
    'Programación / Software',
    'Matemáticas',
    'Ciencias',
    'Diseño & Multimedia',
    'Derecho',
    'Otras'
  ];

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const url = selectedCategory === 'Todas' 
        ? `${API_BASE_URL}/api/projects`
        : `${API_BASE_URL}/api/projects?categoria=${encodeURIComponent(selectedCategory)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        setDbProjects(await res.json());
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

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/services`);
      if (res.ok) {
        setDbServices(await res.json());
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

  const handleDeleteProject = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
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
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
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
    }
  };

  const filteredServices = dbServices.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (s.nombreEstudiante || '').toLowerCase().includes(q) ||
           (s.areaEspecialidad || '').toLowerCase().includes(q) ||
           (s.descripcion || '').toLowerCase().includes(q) ||
           (s.etiquetas || []).some((t) => t.toLowerCase().includes(q));
  });

  const filteredProjects = dbProjects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (p.titulo || '').toLowerCase().includes(q) ||
           (p.autor || '').toLowerCase().includes(q) ||
           (p.descripcion || '').toLowerCase().includes(q) ||
           (p.categoriaPrincipal || '').toLowerCase().includes(q) ||
           (p.etiquetas || []).some((t) => t.toLowerCase().includes(q));
  });

  return (
    <section id="seccion-explorar" className="py-24 px-4 sm:px-6 bg-[#07090E] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* ENCABEZADO Y PESTAÑAS BENTO */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
              <span>🔥 EXPLORA PUBLICACIONES EN VIVO</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
              Descubre proyectos e iniciativas activas
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-normal">
              Encuentra oportunidades para aportar tus habilidades o contacta a compañeros tutores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {onOpenPublicationModal && (
              <button
                onClick={onOpenPublicationModal}
                className="btn-accent-gradient font-black px-5 py-3 rounded-2xl text-xs sm:text-sm cursor-pointer"
              >
                <span>+</span> Publicar Servicio o Proyecto
              </button>
            )}

            <div className="inline-flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('proyectos')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'proyectos'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🚀</span> Proyectos Estudiantiles
              </button>

              <button
                onClick={() => setActiveTab('estudiantes')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'estudiantes'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>👤</span> Estudiantes / Ayudantes
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE FILTROS EN BENTO GRID */}
        <div className="bento-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {activeTab === 'proyectos' ? (
            <div className="flex flex-wrap gap-2 items-center text-left">
              <span className="text-xs font-mono-code font-bold text-slate-400 mr-1 uppercase tracking-wider">
                Categorías:
              </span>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs font-mono-code font-bold text-slate-400 uppercase tracking-wider">
              Estudiantes & Tutores Universitarios Verificados
            </span>
          )}

          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, título o etiqueta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-white/10 text-xs bg-slate-900 text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* TAB 1: PROYECTOS / CONVOCATORIAS */}
        {activeTab === 'proyectos' && (
          loadingProjects ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">Cargando proyectos...</div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredProjects.map((p) => (
                <div 
                  key={p._id || p.id} 
                  className="bento-card p-6 flex flex-col justify-between space-y-4 hover:scale-[1.01]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {p.categoriaPrincipal || 'General'}
                      </span>
                      <span className="text-[11px] text-amber-300 font-extrabold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {p.colaboradoresBuscados || 'Colaboradores'}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-white font-heading">
                      {p.titulo}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                      {p.descripcion}
                    </p>

                    {p.mediaUrl && p.mediaUrl.startsWith('data:image') && (
                      <div>
                        <img src={p.mediaUrl} alt={p.titulo} className="w-full h-40 object-cover rounded-xl border border-white/10" />
                      </div>
                    )}

                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl"
                      >
                        <span>💻 Repositorio GitHub/GitLab</span> →
                      </a>
                    )}

                    {p.etiquetas && p.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.etiquetas.map((rol, i) => (
                          <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg font-bold">
                            +{rol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 font-bold">Por: {p.autor || 'Estudiante'}</span>
                    
                    <div className="flex items-center gap-2">
                      {canDelete(p) && (
                        <button
                          onClick={() => handleDeleteProject(p._id || p.id)}
                          title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi proyecto"}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                        >
                          <span>🗑️</span>
                        </button>
                      )}

                      <button className="btn-accent-gradient font-black text-xs px-4 py-2 rounded-xl cursor-pointer">
                        Unirme →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bento-card p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                🚀
              </div>
              <h3 className="text-lg font-extrabold text-white font-heading">
                {searchQuery ? 'No se encontraron proyectos' : 'Aún no hay proyectos publicados'}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {searchQuery 
                  ? `No se encontraron coincidencias para "${searchQuery}".`
                  : 'No hay convocatorias activas en esta categoría. ¡Publica tu proyecto para empezar!'}
              </p>
            </div>
          )
        )}

        {/* TAB 2: SERVICIOS DE ESTUDIANTES */}
        {activeTab === 'estudiantes' && (
          loadingServices ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">Cargando estudiantes...</div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredServices.map((student) => (
                <div 
                  key={student._id || student.id} 
                  className="bento-card p-6 flex flex-col justify-between space-y-4 hover:scale-[1.01]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      {student.fotoUrl ? (
                        <img 
                          src={student.fotoUrl} 
                          alt={student.nombreEstudiante} 
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-black shadow-inner">
                          {(student.nombreEstudiante || 'E').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-extrabold text-white font-heading">
                          {student.nombreEstudiante}
                        </h3>
                        <p className="text-xs text-indigo-400 font-bold mt-0.5">
                          {student.areaEspecialidad}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono-code font-semibold">
                          {student.semestre}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                      {student.descripcion}
                    </p>

                    {student.etiquetas && student.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {student.etiquetas.map((cat, i) => (
                          <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg font-bold">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Disponible
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {canDelete(student) && (
                        <button
                          onClick={() => handleDeleteService(student._id || student.id)}
                          title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi servicio"}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                        >
                          <span>🗑️</span>
                        </button>
                      )}

                      <button className="btn-accent-gradient font-black px-4 py-2 rounded-xl text-xs cursor-pointer">
                        Contactar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bento-card p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                🤝
              </div>
              <h3 className="text-lg font-extrabold text-white font-heading">
                {searchQuery ? 'No se encontraron estudiantes' : 'Aún no hay estudiantes ofreciendo servicios'}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {searchQuery 
                  ? `No hay estudiantes o tutores que coincidan con "${searchQuery}".`
                  : 'Ofrece tus tutorías o habilidades para figurar en este apartado.'}
              </p>
            </div>
          )
        )}

      </div>
    </section>
  );
}
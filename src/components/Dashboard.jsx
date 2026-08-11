import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function Dashboard({ user, onOpenPublicationModal, onOpenAdmin, onEditPublication, initialDashboardTab = 'servicios' }) {
  const [activeTab, setActiveTab] = useState(initialDashboardTab);
  
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  
  const [myServices, setMyServices] = useState([]);
  const [myProjects, setMyProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialDashboardTab) {
      setActiveTab(initialDashboardTab);
    }
  }, [initialDashboardTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userId = user?.id || user?._id || '';
      const userName = user?.nombre || '';

      const [resServices, resProjects, resMyServices, resMyProjects] = await Promise.all([
        fetch(`${API_BASE_URL}/api/services?estado=aprobado`),
        fetch(`${API_BASE_URL}/api/projects?estado=aprobado`),
        fetch(`${API_BASE_URL}/api/services?autorId=${userId}&autorNombre=${encodeURIComponent(userName)}`),
        fetch(`${API_BASE_URL}/api/projects?autorId=${userId}&autorNombre=${encodeURIComponent(userName)}`)
      ]);

      if (resServices.ok) setServices(await resServices.json());
      else setServices([]);

      if (resProjects.ok) setProjects(await resProjects.json());
      else setProjects([]);

      if (resMyServices.ok) setMyServices(await resMyServices.json());
      else setMyServices([]);

      if (resMyProjects.ok) setMyProjects(await resMyProjects.json());
      else setMyProjects([]);

    } catch (error) {
      console.error('Error al cargar datos desde el backend:', error);
      setServices([]);
      setProjects([]);
      setMyServices([]);
      setMyProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Verificar si el usuario actual es el creador O si es Administrador
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
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
        setMyProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
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
        setServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
        setMyServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
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
  const filteredServices = services.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = (s.nombreEstudiante || '').toLowerCase().includes(q);
    const matchSpec = (s.areaEspecialidad || '').toLowerCase().includes(q);
    const matchDesc = (s.descripcion || '').toLowerCase().includes(q);
    const matchTags = (s.etiquetas || []).some((t) => t.toLowerCase().includes(q));
    return matchName || matchSpec || matchDesc || matchTags;
  });

  // Filtrar Proyectos por texto de búsqueda
  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchTitle = (p.titulo || '').toLowerCase().includes(q);
    const matchAuthor = (p.autor || '').toLowerCase().includes(q);
    const matchDesc = (p.descripcion || '').toLowerCase().includes(q);
    const matchCat = (p.categoriaPrincipal || '').toLowerCase().includes(q);
    const matchTags = (p.etiquetas || []).some((t) => t.toLowerCase().includes(q));
    return matchTitle || matchAuthor || matchDesc || matchCat || matchTags;
  });

  const totalMyPublications = myServices.length + myProjects.length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      
      {/* GLOW ORBS AMBIENTALES DE FONDO */}
      <div className="glow-orb w-96 h-96 bg-indigo-500/10 top-10 left-1/4"></div>
      <div className="glow-orb w-80 h-80 bg-blue-500/10 top-40 right-1/4"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* BANNER FUTURISTA DE BIENVENIDA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl shadow-indigo-950/20 border border-slate-800">
          
          {/* LUCES DE FONDO DEL BANNER */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-violet-600/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border border-indigo-500/30 backdrop-blur-md">
                  ✨ Espacio Universitario UniLinkd
                </span>
                {user?.rol === 'admin' && (
                  <span className="bg-amber-400 text-amber-950 text-[11px] font-black uppercase px-3 py-1 rounded-full border border-amber-300 shadow-sm flex items-center gap-1">
                    👑 Administrador
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading">
                ¡Bienvenido de nuevo, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">{user?.nombre || 'Estudiante'}</span>! 👋
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
                Conecta con estudiantes universitarios, solicita colaboración técnica para tus proyectos o postula tus tutorías a la comunidad.
              </p>

              {/* STATS CHIPS ACCESIBLES */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{services.length} Servicios Activos</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  <span>{projects.length} Proyectos Buscando Ayuda</span>
                </div>
              </div>
            </div>
            
            {/* BOTONES ACCIÓN DEL BANNER */}
            <div className="flex flex-wrap lg:flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {user?.rol === 'admin' && onOpenAdmin && (
                <button 
                  onClick={onOpenAdmin}
                  className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-5 py-3 rounded-2xl transition-all shadow-lg shadow-amber-400/20 text-xs sm:text-sm whitespace-nowrap cursor-pointer hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>👑</span> Panel Admin
                </button>
              )}
              
              <button 
                onClick={() => setActiveTab('mis-publicaciones')}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-5 py-3 rounded-2xl border border-white/20 transition-all shadow-md backdrop-blur-md text-xs sm:text-sm whitespace-nowrap cursor-pointer hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>📂</span> Mis Publicaciones ({totalMyPublications})
              </button>

              <button 
                onClick={onOpenPublicationModal}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-black px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 text-xs sm:text-sm whitespace-nowrap cursor-pointer hover:scale-105 flex items-center justify-center gap-2 border border-white/20"
              >
                <span>+</span> Publicar Servicio o Proyecto
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA GENERAL Y PESTAÑAS ELEGANTES */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* BOTONES PESTAÑAS CON DISEÑO DE PILL ENCAPSULADO */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('servicios')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'servicios'
                  ? 'bg-white text-indigo-600 shadow-md shadow-slate-200/80 border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>🤝</span> Estudiantes & Servicios
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'servicios' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {filteredServices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('proyectos')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'proyectos'
                  ? 'bg-white text-indigo-600 shadow-md shadow-slate-200/80 border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>🚀</span> Proyectos & Tareas
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'proyectos' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {filteredProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mis-publicaciones')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'mis-publicaciones'
                  ? 'bg-white text-amber-700 shadow-md shadow-slate-200/80 border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>📂</span> Mis Publicaciones
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'mis-publicaciones' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {totalMyPublications}
              </span>
            </button>
          </div>

          {/* CAMPO BUSCADOR POR TEXTO */}
          {activeTab !== 'mis-publicaciones' && (
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, título, especialidad o etiqueta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕ Limpiar
                </button>
              )}
            </div>
          )}

        </div>

        {/* INDICADOR DE CARGA */}
        {loading && (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto shadow-md"></div>
            <p className="text-xs font-bold text-slate-500">Cargando publicaciones...</p>
          </div>
        )}

        {/* TAB 1: SERVICIOS DE ESTUDIANTES PÚBLICOS */}
        {!loading && activeTab === 'servicios' && (
          filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredServices.map((est) => (
                <div key={est._id || est.id} className="glass-card rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group border border-slate-200/80 hover:border-indigo-300">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Disponible
                      </span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100/80 px-2.5 py-0.5 rounded-lg border border-slate-200/50">
                        {est.semestre}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 mt-5">
                      {est.fotoUrl ? (
                        <img src={est.fotoUrl} alt={est.nombreEstudiante} className="w-13 h-13 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md" />
                      ) : (
                        <div className="w-13 h-13 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md">
                          {(est.nombreEstudiante || 'E').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors font-heading">
                          {est.nombreEstudiante}
                        </h3>
                        <p className="text-xs text-indigo-600 font-bold mt-0.5">{est.areaEspecialidad}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs mt-4 leading-relaxed bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                      {est.descripcion}
                    </p>

                    {est.etiquetas && est.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {est.etiquetas.map((hab, idx) => (
                          <span key={idx} className="bg-indigo-50/80 text-indigo-700 border border-indigo-100 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            {hab}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.02]">
                      Contactar por Ayuda
                    </button>

                    {/* BOTÓN EDITAR */}
                    {canDelete(est) && onEditPublication && (
                      <button
                        onClick={() => onEditPublication(est, 'servicio')}
                        title="Editar mi servicio"
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-3 rounded-xl transition-colors cursor-pointer"
                      >
                        <span>✏️</span>
                      </button>
                    )}

                    {/* BOTÓN ELIMINAR */}
                    {canDelete(est) && (
                      <button
                        onClick={() => handleDeleteService(est._id || est.id)}
                        title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi servicio"}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-3 rounded-xl transition-colors cursor-pointer"
                      >
                        <span>🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner">
                🤝
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 font-heading">
                {searchQuery ? 'No se encontraron resultados' : 'Aún no hay servicios ofrecidos'}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {searchQuery 
                  ? `No hay estudiantes o servicios que coincidan con "${searchQuery}". Intenta con otros términos.`
                  : 'Sé el primero en ofrecer tus conocimientos, tutorías o asesorías a la comunidad estudiantil.'}
              </p>
              <button 
                onClick={onOpenPublicationModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105"
              >
                + Ofrecer Mi Servicio / Tutoría
              </button>
            </div>
          )
        )}

        {/* TAB 2: PROYECTOS / TAREAS PÚBLICOS */}
        {!loading && activeTab === 'proyectos' && (
          filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {filteredProjects.map((proj) => (
                <div key={proj._id || proj.id} className="glass-card rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group border border-slate-200/80 hover:border-indigo-300">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
                        {proj.categoriaPrincipal || 'General'}
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
                        {proj.colaboradoresBuscados || 'Colaboradores'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-xl mt-4 group-hover:text-indigo-600 transition-colors font-heading">
                      {proj.titulo}
                    </h3>
                    
                    <p className="text-slate-600 text-xs mt-2.5 leading-relaxed bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                      {proj.descripcion}
                    </p>

                    {proj.mediaUrl && proj.mediaUrl.startsWith('data:image') && (
                      <div className="mt-3">
                        <img src={proj.mediaUrl} alt={proj.titulo} className="w-full h-48 object-cover rounded-2xl border border-slate-200 shadow-sm" />
                      </div>
                    )}

                    {proj.repoUrl && (
                      <a 
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100 hover:underline"
                      >
                        <span>💻 Repositorio GitHub/GitLab</span> →
                      </a>
                    )}

                    {proj.etiquetas && proj.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {proj.etiquetas.map((tec, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            {tec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 font-bold">Por: {proj.autor || 'Estudiante'}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* BOTÓN EDITAR */}
                      {canDelete(proj) && onEditPublication && (
                        <button
                          onClick={() => onEditPublication(proj, 'proyecto')}
                          title="Editar mi proyecto"
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>✏️</span> Editar
                        </button>
                      )}

                      {/* BOTÓN ELIMINAR */}
                      {canDelete(proj) && (
                        <button
                          onClick={() => handleDeleteProject(proj._id || proj.id)}
                          title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi proyecto"}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                        >
                          <span>🗑️</span>
                        </button>
                      )}

                      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer hover:scale-105">
                        Unirme al Proyecto
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner">
                🚀
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 font-heading">
                {searchQuery ? 'No se encontraron resultados' : 'Aún no hay proyectos publicados'}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {searchQuery 
                  ? `No hay proyectos que coincidan con "${searchQuery}". Intenta con otros términos.`
                  : '¿Necesitas ayuda con un proyecto o materia? Crea una publicación y conecta con compañeros.'}
              </p>
              <button 
                onClick={onOpenPublicationModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-105"
              >
                + Publicar Un Proyecto
              </button>
            </div>
          )
        )}

        {/* TAB 3: MIS PUBLICACIONES */}
        {!loading && activeTab === 'mis-publicaciones' && (
          <div className="space-y-8 text-left">
            
            {/* MIS PROYECTOS */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-200/80 pb-3 flex items-center gap-2 font-heading">
                <span>🚀</span> Mis Proyectos ({myProjects.length})
              </h3>

              {myProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myProjects.map((p) => {
                    const isPending = p.estado === 'pendiente';
                    const isApproved = p.estado === 'aprobado';
                    const isRejected = p.estado === 'rechazado';

                    return (
                      <div key={p._id || p.id} className="glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 relative border border-slate-200 hover:border-indigo-300 transition-all duration-300">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                              {p.categoriaPrincipal}
                            </span>
                            
                            {/* BADGE DE ESTADO */}
                            {isPending && (
                              <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> ⏳ En Revisión
                              </span>
                            )}
                            {isApproved && (
                              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ✅ Aprobado & Público
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-xs font-extrabold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span> ⚠️ Rechazado
                              </span>
                            )}
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-lg font-heading">{p.titulo}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">{p.descripcion}</p>

                          {/* MOTIVO DE RECHAZO SI APLICA */}
                          {isRejected && (
                            <div className="bg-rose-50 border border-rose-200/80 p-4 rounded-2xl text-xs text-rose-900">
                              <span className="font-extrabold text-rose-700 block mb-1">📌 Motivo indicado por el Administrador:</span>
                              "{p.motivoRechazo || 'Información no adecuada o incompleta'}"
                              <span className="block mt-2 text-[11px] font-bold text-rose-800">
                                👉 Haz clic en "Editar Proyecto" para realizar los ajustes necesarios.
                              </span>
                            </div>
                          )}

                          {p.mediaUrl && p.mediaUrl.startsWith('data:image') && (
                            <div>
                              <img src={p.mediaUrl} alt={p.titulo} className="w-full h-40 object-cover rounded-2xl border border-slate-200 shadow-sm" />
                            </div>
                          )}

                          {p.etiquetas && p.etiquetas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {p.etiquetas.map((t, i) => (
                                <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2.5 py-1 rounded-lg font-bold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* BOTONES DE EDICIÓN Y ELIMINACIÓN */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => onEditPublication(p, 'proyecto')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 hover:scale-105"
                          >
                            <span>✏️</span> Editar Proyecto
                          </button>

                          <button
                            onClick={() => handleDeleteProject(p._id || p.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>🗑️</span> Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-4">No has publicado ningún proyecto todavía.</p>
              )}
            </div>

            {/* MIS SERVICIOS */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-200/80 pb-3 flex items-center gap-2 font-heading">
                <span>🤝</span> Mis Servicios ({myServices.length})
              </h3>

              {myServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myServices.map((s) => {
                    const isPending = s.estado === 'pendiente';
                    const isApproved = s.estado === 'aprobado';
                    const isRejected = s.estado === 'rechazado';

                    return (
                      <div key={s._id || s.id} className="glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 relative border border-slate-200 hover:border-indigo-300 transition-all duration-300">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                              {s.semestre}
                            </span>

                            {/* BADGE DE ESTADO */}
                            {isPending && (
                              <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> ⏳ En Revisión
                              </span>
                            )}
                            {isApproved && (
                              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ✅ Aprobado & Público
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-xs font-extrabold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span> ⚠️ Rechazado
                              </span>
                            )}
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-lg font-heading">{s.areaEspecialidad}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">{s.descripcion}</p>

                          {/* MOTIVO DE RECHAZO SI APLICA */}
                          {isRejected && (
                            <div className="bg-rose-50 border border-rose-200/80 p-4 rounded-2xl text-xs text-rose-900">
                              <span className="font-extrabold text-rose-700 block mb-1">📌 Motivo indicado por el Administrador:</span>
                              "{s.motivoRechazo || 'Información no adecuada o incompleta'}"
                              <span className="block mt-2 text-[11px] font-bold text-rose-800">
                                👉 Haz clic en "Editar Servicio" para corregirlo y enviarlo a revisión nuevamente.
                              </span>
                            </div>
                          )}

                          {s.etiquetas && s.etiquetas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {s.etiquetas.map((t, i) => (
                                <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2.5 py-1 rounded-lg font-bold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* BOTONES DE EDICIÓN Y ELIMINACIÓN */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => onEditPublication(s, 'servicio')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 hover:scale-105"
                          >
                            <span>✏️</span> Editar Servicio
                          </button>

                          <button
                            onClick={() => handleDeleteService(s._id || s.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>🗑️</span> Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-4">No has publicado ningún servicio todavía.</p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
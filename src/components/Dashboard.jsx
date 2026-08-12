import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function Dashboard({ user, onOpenPublicationModal, onOpenAdmin, onEditPublication, onRequestHelp, onOpenServiceChats, initialDashboardTab = 'servicios' }) {
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
      }
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
    }
  };

  const handleDeleteService = async (id) => {
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
      }
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
    }
  };

  const filteredServices = services.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (s.nombreEstudiante || '').toLowerCase().includes(q) ||
           (s.areaEspecialidad || '').toLowerCase().includes(q) ||
           (s.descripcion || '').toLowerCase().includes(q) ||
           (s.etiquetas || []).some((t) => t.toLowerCase().includes(q));
  });

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (p.titulo || '').toLowerCase().includes(q) ||
           (p.autor || '').toLowerCase().includes(q) ||
           (p.descripcion || '').toLowerCase().includes(q) ||
           (p.categoriaPrincipal || '').toLowerCase().includes(q) ||
           (p.etiquetas || []).some((t) => t.toLowerCase().includes(q));
  });

  const totalMyPublications = myServices.length + myProjects.length;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 bg-grid-pattern-dark relative">
      
      {/* ORBES DE LUZ AMBIENTAL EN DEEP DARK */}
      <div className="glow-orb-dark w-[600px] h-[600px] bg-indigo-600/20 top-10 left-1/4"></div>
      <div className="glow-orb-dark w-[500px] h-[500px] bg-blue-600/15 top-60 right-10"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* HERO Y PANEL BENTO-BOX (MÓDULOS ASIMÉTRICOS DE ALTO IMPACTO) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MÓDULO HÉROE PRINCIPAL (OVERSIZED TYPOGRAPHY) */}
          <div className="lg:col-span-8 bento-hero p-8 sm:p-10 flex flex-col justify-between space-y-6 relative overflow-hidden">
            
            {/* LUZ DE BRUSH EN ESQUINA */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-500/30 to-violet-600/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10 text-left">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-indigo-500/15 text-indigo-300 text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border border-indigo-500/30 backdrop-blur-md">
                  ✨ Espacio Universitario UniLinkd
                </span>
                {user?.rol === 'admin' && (
                  <span className="bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                    👑 Administrador
                  </span>
                )}
              </div>

              {/* OVERSIZED TYPOGRAPHY EN CABECERA */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-heading leading-tight">
                Bienvenido, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                  {user?.nombre || 'Estudiante'}
                </span>
              </h1>

              <p className="text-slate-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Conecta con estudiantes universitarios, solicita colaboración técnica para tus proyectos o postula tus habilidades a la comunidad.
              </p>
            </div>

            {/* BOTONES GHOST & ACCENT */}
            <div className="flex flex-wrap gap-3.5 pt-4 relative z-10">
              {user?.rol === 'admin' && onOpenAdmin && (
                <button 
                  onClick={onOpenAdmin}
                  className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm cursor-pointer transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>👑</span> Panel Admin
                </button>
              )}

              <button 
                onClick={() => setActiveTab('mis-publicaciones')}
                className="btn-ghost-glow font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm cursor-pointer flex items-center gap-2"
              >
                <span>📂</span> Mis Publicaciones ({totalMyPublications})
              </button>

              <button 
                onClick={onOpenPublicationModal}
                className="btn-accent-gradient font-black px-6 py-3 rounded-2xl text-xs sm:text-sm cursor-pointer flex items-center gap-2"
              >
                <span>+</span> Publicar Servicio o Proyecto
              </button>
            </div>
          </div>

          {/* MÓDULOS BENTO LATERALES (METRIC TILES) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            
            <div className="bento-card-glow p-6 text-left space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code font-bold text-slate-400 uppercase tracking-wider">Servicios Activos</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-4xl font-black text-white font-heading">{services.length}</p>
              <p className="text-xs text-slate-400">Tutorías y asesorías verificadas listas para contactar.</p>
            </div>

            <div className="bento-card-glow p-6 text-left space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code font-bold text-slate-400 uppercase tracking-wider">Proyectos Activos</span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
              </div>
              <p className="text-4xl font-black text-indigo-300 font-heading">{projects.length}</p>
              <p className="text-xs text-slate-400">Iniciativas buscando colaboradores multidisciplinarios.</p>
            </div>

          </div>

        </div>

        {/* NAVEGACIÓN PESTAÑAS EN BENTO GRID */}
        <div className="bento-card p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900/80 rounded-2xl border border-white/5">
            <button
              onClick={() => setActiveTab('servicios')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'servicios'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🤝</span> Estudiantes & Servicios
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'servicios' ? 'bg-indigo-400/20 text-indigo-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {filteredServices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('proyectos')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'proyectos'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🚀</span> Proyectos & Tareas
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'proyectos' ? 'bg-indigo-400/20 text-indigo-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {filteredProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mis-publicaciones')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'mis-publicaciones'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📂</span> Mis Publicaciones
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'mis-publicaciones' ? 'bg-indigo-400/20 text-indigo-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {totalMyPublications}
              </span>
            </button>
          </div>

          {/* BUSCADOR ESTILO DEEP DARK */}
          {activeTab !== 'mis-publicaciones' && (
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, título, especialidad o etiqueta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-white/10 text-xs bg-slate-900/90 text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
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
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Cargando publicaciones en vivo...</p>
          </div>
        )}

        {/* TAB 1: SERVICIOS PÚBLICOS EN BENTO GRID */}
        {!loading && activeTab === 'servicios' && (
          filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredServices.map((est) => (
                <div key={est._id || est.id} className="bento-card p-6 flex flex-col justify-between space-y-5 hover:scale-[1.01]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Disponible
                      </span>
                      <span className="text-xs font-mono-code font-bold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-white/5">
                        {est.semestre}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {est.fotoUrl ? (
                        <img src={est.fotoUrl} alt={est.nombreEstudiante} className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-inner">
                          {(est.nombreEstudiante || 'E').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-white text-base font-heading">
                          {est.nombreEstudiante}
                        </h3>
                        <p className="text-xs text-indigo-400 font-bold mt-0.5">{est.areaEspecialidad}</p>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                      {est.descripcion}
                    </p>

                    {est.etiquetas && est.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {est.etiquetas.map((hab, idx) => (
                          <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            {hab}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    {user && canDelete(est) ? (
                      <button 
                        onClick={() => onOpenServiceChats && onOpenServiceChats(est._id || est.id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer text-center hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                      >
                        <span>💬</span> Ver Peticiones del Servicio
                      </button>
                    ) : (
                      <button 
                        onClick={() => onRequestHelp && onRequestHelp(est)}
                        className="flex-1 btn-accent-gradient font-black text-xs py-2.5 rounded-xl cursor-pointer text-center hover:scale-[1.02] transition-transform"
                      >
                        Contactar por Ayuda
                      </button>
                    )}

                    {canDelete(est) && onEditPublication && (
                      <button
                        onClick={() => onEditPublication(est, 'servicio')}
                        title="Editar mi servicio"
                        className="btn-ghost-glow text-xs font-bold p-2.5 rounded-xl cursor-pointer"
                      >
                        <span>✏️</span>
                      </button>
                    )}

                    {canDelete(est) && (
                      <button
                        onClick={() => handleDeleteService(est._id || est.id)}
                        title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi servicio"}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold p-2.5 rounded-xl cursor-pointer"
                      >
                        <span>🗑️</span>
                      </button>
                    )}
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
                {searchQuery ? 'No se encontraron resultados' : 'Aún no hay servicios ofrecidos'}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {searchQuery 
                  ? `No hay estudiantes o servicios que coincidan con "${searchQuery}".`
                  : 'Sé el primero en ofrecer tus conocimientos o tutorías a la comunidad estudiantil.'}
              </p>
            </div>
          )
        )}

        {/* TAB 2: PROYECTOS PÚBLICOS EN BENTO GRID */}
        {!loading && activeTab === 'proyectos' && (
          filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {filteredProjects.map((proj) => (
                <div key={proj._id || proj.id} className="bento-card p-6 flex flex-col justify-between space-y-5 hover:scale-[1.01]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        {proj.categoriaPrincipal || 'General'}
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                        {proj.colaboradoresBuscados || 'Colaboradores'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-xl font-heading">
                      {proj.titulo}
                    </h3>
                    
                    <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                      {proj.descripcion}
                    </p>

                    {proj.mediaUrl && proj.mediaUrl.startsWith('data:image') && (
                      <div>
                        <img src={proj.mediaUrl} alt={proj.titulo} className="w-full h-48 object-cover rounded-xl border border-white/10" />
                      </div>
                    )}

                    {proj.repoUrl && (
                      <a 
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl"
                      >
                        <span>💻 Repositorio GitHub/GitLab</span> →
                      </a>
                    )}

                    {proj.etiquetas && proj.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.etiquetas.map((tec, idx) => (
                          <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            {tec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 font-bold">Por: {proj.autor || 'Estudiante'}</span>
                    
                    <div className="flex items-center gap-2">
                      {canDelete(proj) && onEditPublication && (
                        <button
                          onClick={() => onEditPublication(proj, 'proyecto')}
                          title="Editar mi proyecto"
                          className="btn-ghost-glow text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                        >
                          <span>✏️</span>
                        </button>
                      )}

                      {canDelete(proj) && (
                        <button
                          onClick={() => handleDeleteProject(proj._id || proj.id)}
                          title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi proyecto"}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                        >
                          <span>🗑️</span>
                        </button>
                      )}

                      <button className="btn-accent-gradient font-black text-xs px-4 py-2 rounded-xl cursor-pointer">
                        Unirme al Proyecto
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bento-card p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                🚀
              </div>
              <h3 className="text-lg font-extrabold text-white font-heading">
                {searchQuery ? 'No se encontraron proyectos' : 'Aún no hay proyectos publicados'}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {searchQuery 
                  ? `No se encontraron coincidencias para "${searchQuery}".`
                  : '¿Necesitas ayuda con un proyecto? Crea una publicación y conecta con compañeros.'}
              </p>
            </div>
          )
        )}

        {/* TAB 3: MIS PUBLICACIONES EN BENTO GRID */}
        {!loading && activeTab === 'mis-publicaciones' && (
          <div className="space-y-8 text-left">
            
            {/* MIS PROYECTOS */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white border-b border-white/10 pb-3 flex items-center gap-2 font-heading">
                <span>🚀</span> Mis Proyectos ({myProjects.length})
              </h3>

              {myProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myProjects.map((p) => {
                    const isPending = p.estado === 'pendiente';
                    const isApproved = p.estado === 'aprobado';
                    const isRejected = p.estado === 'rechazado';

                    return (
                      <div key={p._id || p.id} className="bento-card p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                              {p.categoriaPrincipal}
                            </span>
                            
                            {isPending && (
                              <span className="text-xs font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span> ⏳ En Revisión
                              </span>
                            )}
                            {isApproved && (
                              <span className="text-xs font-extrabold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> ✅ Aprobado & Público
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-xs font-extrabold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-400"></span> ⚠️ Rechazado
                              </span>
                            )}
                          </div>

                          <h4 className="font-extrabold text-white text-lg font-heading">{p.titulo}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">{p.descripcion}</p>

                          {isRejected && (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-200">
                              <span className="font-extrabold text-rose-400 block mb-1">📌 Motivo indicado por el Administrador:</span>
                              "{p.motivoRechazo || 'Información no adecuada o incompleta'}"
                              <span className="block mt-2 text-[11px] font-bold text-rose-300">
                                👉 Haz clic en "Editar Proyecto" para corregirlo y volverlo a enviar.
                              </span>
                            </div>
                          )}

                          {p.etiquetas && p.etiquetas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {p.etiquetas.map((t, i) => (
                                <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg font-bold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                          <button
                            onClick={() => onEditPublication(p, 'proyecto')}
                            className="btn-accent-gradient font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                          >
                            <span>✏️</span> Editar Proyecto
                          </button>

                          <button
                            onClick={() => handleDeleteProject(p._id || p.id)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-extrabold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1"
                          >
                            <span>🗑️</span> Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4">No has publicado ningún proyecto todavía.</p>
              )}
            </div>

            {/* MIS SERVICIOS */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-black text-white border-b border-white/10 pb-3 flex items-center gap-2 font-heading">
                <span>🤝</span> Mis Servicios ({myServices.length})
              </h3>

              {myServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myServices.map((s) => {
                    const isPending = s.estado === 'pendiente';
                    const isApproved = s.estado === 'aprobado';
                    const isRejected = s.estado === 'rechazado';

                    return (
                      <div key={s._id || s.id} className="bento-card p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                              {s.semestre}
                            </span>

                            {isPending && (
                              <span className="text-xs font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span> ⏳ En Revisión
                              </span>
                            )}
                            {isApproved && (
                              <span className="text-xs font-extrabold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> ✅ Aprobado & Público
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-xs font-extrabold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-400"></span> ⚠️ Rechazado
                              </span>
                            )}
                          </div>

                          <h4 className="font-extrabold text-white text-lg font-heading">{s.areaEspecialidad}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">{s.descripcion}</p>

                          {isRejected && (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-200">
                              <span className="font-extrabold text-rose-400 block mb-1">📌 Motivo indicado por el Administrador:</span>
                              "{s.motivoRechazo || 'Información no adecuada o incompleta'}"
                              <span className="block mt-2 text-[11px] font-bold text-rose-300">
                                👉 Haz clic en "Editar Servicio" para corregirlo y enviarlo a revisión nuevamente.
                              </span>
                            </div>
                          )}

                          {s.etiquetas && s.etiquetas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {s.etiquetas.map((t, i) => (
                                <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg font-bold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                          <button
                            onClick={() => onEditPublication(s, 'servicio')}
                            className="btn-accent-gradient font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                          >
                            <span>✏️</span> Editar Servicio
                          </button>

                          <button
                            onClick={() => handleDeleteService(s._id || s.id)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-extrabold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1"
                          >
                            <span>🗑️</span> Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4">No has publicado ningún servicio todavía.</p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
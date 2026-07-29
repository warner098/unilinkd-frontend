import React, { useState, useEffect } from 'react';

export default function Dashboard({ user, onOpenPublicationModal, onOpenAdmin }) {
  const [activeTab, setActiveTab] = useState('servicios');
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para la barra de búsqueda por nombre, título o etiqueta
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resServices, resProjects] = await Promise.all([
        fetch('http://localhost:5000/api/services'),
        fetch('http://localhost:5000/api/projects')
      ]);

      if (resServices.ok) {
        const servData = await resServices.json();
        setServices(servData);
      } else {
        setServices([]);
      }

      if (resProjects.ok) {
        const projData = await resProjects.json();
        setProjects(projData);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error al cargar datos desde el backend:', error);
      setServices([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
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
        setServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
      } else {
        const data = await res.json();
        alert(data.msg || 'No se pudo eliminar el servicio');
      }
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      alert('Error de conexión al eliminar');
    }
  };

  // Filtrar Servicios en tiempo real por término de búsqueda
  const filteredServices = services.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = (s.nombreEstudiante || '').toLowerCase().includes(q);
    const matchSpec = (s.areaEspecialidad || '').toLowerCase().includes(q);
    const matchDesc = (s.descripcion || '').toLowerCase().includes(q);
    const matchTags = (s.etiquetas || []).some((t) => t.toLowerCase().includes(q));
    return matchName || matchSpec || matchDesc || matchTags;
  });

  // Filtrar Proyectos en tiempo real por término de búsqueda
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BANNER DE BIENVENIDA */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Espacio Universitario
              </span>
              {user?.rol === 'admin' && (
                <span className="bg-amber-400 text-amber-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full border border-amber-300">
                  👑 Administrador
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black mt-2">
              ¡Bienvenido de nuevo, {user?.nombre || 'Estudiante'}! 👋
            </h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              Explora ofertas de colaboración, encuentra ayuda técnica con otros compañeros o postula tus habilidades a proyectos activos.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {user?.rol === 'admin' && onOpenAdmin && (
              <button 
                onClick={onOpenAdmin}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold px-4 py-3 rounded-2xl transition-all shadow-md text-sm whitespace-nowrap cursor-pointer hover:scale-105"
              >
                👑 Panel Admin
              </button>
            )}
            <button 
              onClick={onOpenPublicationModal}
              className="bg-white text-indigo-600 font-extrabold px-5 py-3 rounded-2xl hover:bg-indigo-50 transition-all shadow-md text-sm whitespace-nowrap cursor-pointer hover:scale-105"
            >
              + Publicar Servicio o Proyecto
            </button>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA GENERAL Y PESTAÑAS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          
          {/* BOTONES PESTAÑA */}
          <div className="flex justify-center sm:justify-start gap-4 text-sm font-extrabold">
            <button
              onClick={() => setActiveTab('servicios')}
              className={`pb-2 px-2 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'servicios'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🤝 Estudiantes & Servicios
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {filteredServices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('proyectos')}
              className={`pb-2 px-2 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'proyectos'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🚀 Proyectos & Tareas (Buscando ayuda)
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {filteredProjects.length}
              </span>
            </button>
          </div>

          {/* CAMPO BUSCADOR POR NOMBRE / CATEGORÍA / ETIQUETA */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, título, especialidad o etiqueta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
              >
                ✕ Limpiar
              </button>
            )}
          </div>

        </div>

        {/* INDICADOR DE CARGA */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-gray-500">Cargando publicaciones...</p>
          </div>
        )}

        {/* CONTENIDO: SERVICIOS DE ESTUDIANTES */}
        {!loading && activeTab === 'servicios' && (
          filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredServices.map((est) => (
                <div key={est._id || est.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        ● Disponible
                      </span>
                      <span className="text-xs font-medium text-gray-400">{est.semestre}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      {est.fotoUrl ? (
                        <img src={est.fotoUrl} alt={est.nombreEstudiante} className="w-12 h-12 rounded-full object-cover border border-indigo-100" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                          {(est.nombreEstudiante || 'E').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{est.nombreEstudiante}</h3>
                        <p className="text-xs text-indigo-600 font-semibold">{est.areaEspecialidad}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mt-4 leading-relaxed">
                      {est.descripcion}
                    </p>

                    {est.etiquetas && est.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {est.etiquetas.map((hab, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-1 rounded-md">
                            {hab}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer">
                      Contactar por Ayuda
                    </button>

                    {/* BOTÓN ELIMINAR EXCLUSIVO DEL DUEÑO O ADMINISTRADOR */}
                    {canDelete(est) && (
                      <button
                        onClick={() => handleDeleteService(est._id || est.id)}
                        title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi servicio"}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🤝
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">
                {searchQuery ? 'No se encontraron resultados' : 'Aún no hay servicios ofrecidos'}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {searchQuery 
                  ? `No hay estudiantes o servicios que coincidan con "${searchQuery}". Intenta con otros términos.`
                  : 'Sé el primero en ofrecer tus conocimientos, tutorías o asesorías a la comunidad estudiantil.'}
              </p>
              <button 
                onClick={onOpenPublicationModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
              >
                + Ofrecer Mi Servicio / Tutoría
              </button>
            </div>
          )
        )}

        {/* CONTENIDO: PROYECTOS / TAREAS */}
        {!loading && activeTab === 'proyectos' && (
          filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {filteredProjects.map((proj) => (
                <div key={proj._id || proj.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        {proj.categoriaPrincipal || 'General'}
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        {proj.colaboradoresBuscados || 'Colaboradores'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-lg mt-4">{proj.titulo}</h3>
                    <p className="text-gray-600 text-xs mt-2 leading-relaxed">
                      {proj.descripcion}
                    </p>

                    {proj.mediaUrl && proj.mediaUrl.startsWith('data:image') && (
                      <div className="mt-3">
                        <img src={proj.mediaUrl} alt={proj.titulo} className="w-full h-44 object-cover rounded-xl border border-gray-100" />
                      </div>
                    )}

                    {proj.repoUrl && (
                      <a 
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-indigo-600 hover:underline"
                      >
                        <span>💻 Ver Repositorio GitHub/GitLab</span> →
                      </a>
                    )}

                    {proj.etiquetas && proj.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {proj.etiquetas.map((tec, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-2 py-1 rounded-md">
                            {tec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 font-medium">Por: {proj.autor || 'Estudiante'}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* BOTÓN ELIMINAR EXCLUSIVO DEL DUEÑO O ADMINISTRADOR */}
                      {canDelete(proj) && (
                        <button
                          onClick={() => handleDeleteProject(proj._id || proj.id)}
                          title={user?.rol === 'admin' ? "Eliminar como Admin" : "Eliminar mi proyecto"}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>🗑️</span> Eliminar
                        </button>
                      )}

                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer">
                        Unirme al Proyecto
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🚀
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">
                {searchQuery ? 'No se encontraron resultados' : 'Aún no hay proyectos publicados'}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {searchQuery 
                  ? `No hay proyectos que coincidan con "${searchQuery}". Intenta con otros términos.`
                  : '¿Necesitas ayuda con un proyecto o materia? Crea una publicación y conecta con compañeros.'}
              </p>
              <button 
                onClick={onOpenPublicationModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 cursor-pointer"
              >
                + Publicar Un Proyecto
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

export default function AdminTagsModal({ isOpen, onClose, onUpdate }) {
  const [activeAdminTab, setActiveAdminTab] = useState('revision'); // 'revision' | 'etiquetas' | 'proyectos' | 'servicios'
  
  const [tags, setTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);

  const [pendingProjects, setPendingProjects] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [newTagName, setNewTagName] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('Programación / Software');
  const [newTagType, setNewTagType] = useState('ambos');

  const categorias = [
    'Programación / Software',
    'Matemáticas',
    'Ciencias',
    'Diseño & Multimedia',
    'Derecho',
    'Otras'
  ];

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resTags, resProjects, resServices, resPendingProjects, resPendingServices] = await Promise.all([
        fetch('http://localhost:5000/api/tags'),
        fetch('http://localhost:5000/api/projects?estado=aprobado'),
        fetch('http://localhost:5000/api/services?estado=aprobado'),
        fetch('http://localhost:5000/api/projects?estado=pendiente'),
        fetch('http://localhost:5000/api/services?estado=pendiente')
      ]);

      if (resTags.ok) setTags(await resTags.json());
      if (resProjects.ok) setProjects(await resProjects.json());
      if (resServices.ok) setServices(await resServices.json());
      if (resPendingProjects.ok) setPendingProjects(await resPendingProjects.json());
      if (resPendingServices.ok) setPendingServices(await resPendingServices.json());
    } catch (err) {
      console.error('Error al cargar datos del Panel Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPending = pendingProjects.length + pendingServices.length;

  // APROBAR PROYECTO
  const handleApproveProject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'aprobado' })
      });
      if (res.ok) {
        alert('¡Proyecto Aprobado con éxito! Ahora es visible públicamente. ✅');
        setPendingProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
        if (onUpdate) onUpdate(); // Refrescar interfaz principal reactivamente
      } else {
        alert('Error al aprobar el proyecto.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // RECHAZAR PROYECTO
  const handleRejectProject = async (id) => {
    if (!window.confirm('¿Deseas rechazar y eliminar esta solicitud de proyecto?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRol: 'admin' })
      });
      if (res.ok) {
        setPendingProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // APROBAR SERVICIO
  const handleApproveService = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'aprobado' })
      });
      if (res.ok) {
        alert('¡Servicio Aprobado con éxito! Ahora es visible públicamente. ✅');
        setPendingServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
        if (onUpdate) onUpdate(); // Refrescar interfaz principal reactivamente
      } else {
        alert('Error al aprobar el servicio.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // RECHAZAR SERVICIO
  const handleRejectService = async (id) => {
    if (!window.confirm('¿Deseas rechazar y eliminar esta solicitud de servicio?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRol: 'admin' })
      });
      if (res.ok) {
        setPendingServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // AGREGAR ETIQUETA OFICIAL
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newTagName.trim(),
          categoria: newTagCategory,
          tipo: newTagType
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error al agregar etiqueta');

      setTags([...tags, data]);
      setNewTagName('');
      if (onUpdate) onUpdate();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // ELIMINAR ETIQUETA OFICIAL
  const handleDeleteTag = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta etiqueta oficial?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tags/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTags(tags.filter((t) => (t._id || t.id) !== id));
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        alert(data.msg || 'Error al eliminar');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // ELIMINAR PROYECTO APROBADO
  const handleDeleteProject = async (id) => {
    if (!window.confirm('👑 ¿Confirmas eliminar este proyecto publicado de la plataforma?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRol: 'admin' })
      });
      if (res.ok) {
        setProjects(projects.filter((p) => (p._id || p.id) !== id));
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // ELIMINAR SERVICIO APROBADO
  const handleDeleteService = async (id) => {
    if (!window.confirm('👑 ¿Confirmas eliminar este servicio publicado de la plataforma?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRol: 'admin' })
      });
      if (res.ok) {
        setServices(services.filter((s) => (s._id || s.id) !== id));
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* ENCABEZADO */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full text-amber-800 text-xs font-extrabold">
            <span>👑 Panel de Control del Administrador</span>
          </div>
          <h3 className="text-2xl font-extrabold text-[#0F172A]">
            Centro de Moderación & Aprobaciones
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Revisa a detalle las solicitudes enviadas por los estudiantes antes de aprobarlas para su publicación.
          </p>
        </div>

        {/* PESTAÑAS DEL PANEL ADMIN */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveAdminTab('revision')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeAdminTab === 'revision'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>⏳</span> Revisión Pendiente
            {totalPending > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                {totalPending}
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setActiveAdminTab('etiquetas')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'etiquetas'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏷️ Etiquetas ({tags.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveAdminTab('proyectos')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'proyectos'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🚀 Aprobados: Proyectos ({projects.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveAdminTab('servicios')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'servicios'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🤝 Aprobados: Servicios ({services.length})
          </button>
        </div>

        {/* MENSAJE DE ERROR */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* PESTAÑA 1: REVISIÓN PENDIENTE (SOLICITUDES EN ESPERA) */}
        {activeAdminTab === 'revision' && (
          <div className="space-y-6 text-left">
            
            {/* SECCIÓN 1: PROYECTOS PENDIENTES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🚀</span> Solicitudes de Proyectos ({pendingProjects.length})
                </h4>
              </div>

              {pendingProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingProjects.map((p) => (
                    <div key={p._id || p.id} className="bg-indigo-50/40 border border-indigo-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                            {p.categoriaPrincipal}
                          </span>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            ⏳ Pendiente de Aprobación
                          </span>
                        </div>

                        <div>
                          <h5 className="font-extrabold text-gray-900 text-base">{p.titulo}</h5>
                          <p className="text-xs text-gray-500 font-semibold mt-0.5">Por: {p.autor}</p>
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
                          {p.descripcion}
                        </p>

                        {/* VISTA PREVIA DE IMAGEN DE PC SI EXISTE */}
                        {p.mediaUrl && p.mediaUrl.startsWith('data:image') && (
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Imagen Adjuntada:</span>
                            <img src={p.mediaUrl} alt={p.titulo} className="w-full h-36 object-cover rounded-xl border border-gray-200 shadow-2xs" />
                          </div>
                        )}

                        {p.repoUrl && (
                          <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:underline block">
                            💻 Repositorio: {p.repoUrl}
                          </a>
                        )}

                        {p.etiquetas && p.etiquetas.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.etiquetas.map((t, idx) => (
                              <span key={idx} className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* BOTONES DE ACCIÓN APROBAR / RECHAZAR */}
                      <div className="pt-3 border-t border-indigo-100 flex gap-2">
                        <button
                          onClick={() => handleApproveProject(p._id || p.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          ✅ Aprobar Publicación
                        </button>
                        <button
                          onClick={() => handleRejectProject(p._id || p.id)}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-xs px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-3 italic">No hay solicitudes de proyectos pendientes.</p>
              )}
            </div>

            {/* SECCIÓN 2: SERVICIOS PENDIENTES */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🤝</span> Solicitudes de Servicios ({pendingServices.length})
                </h4>
              </div>

              {pendingServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingServices.map((s) => (
                    <div key={s._id || s.id} className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {s.semestre}
                          </span>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            ⏳ Pendiente de Aprobación
                          </span>
                        </div>

                        <div>
                          <h5 className="font-extrabold text-gray-900 text-base">{s.areaEspecialidad}</h5>
                          <p className="text-xs text-emerald-700 font-semibold mt-0.5">Estudiante: {s.nombreEstudiante}</p>
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
                          {s.descripcion}
                        </p>

                        {s.etiquetas && s.etiquetas.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {s.etiquetas.map((t, idx) => (
                              <span key={idx} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* BOTONES DE ACCIÓN APROBAR / RECHAZAR */}
                      <div className="pt-3 border-t border-emerald-100 flex gap-2">
                        <button
                          onClick={() => handleApproveService(s._id || s.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          ✅ Aprobar Servicio
                        </button>
                        <button
                          onClick={() => handleRejectService(s._id || s.id)}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-xs px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-3 italic">No hay solicitudes de servicios pendientes.</p>
              )}
            </div>

          </div>
        )}

        {/* PESTAÑA 2: ETIQUETAS OFICIALES */}
        {activeAdminTab === 'etiquetas' && (
          <div className="space-y-6">
            <form onSubmit={handleAddTag} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-left">
              <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                + Agregar Nueva Etiqueta Oficial:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nombre (ej. Docker, SPSS, Rust)"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <select
                  value={newTagCategory}
                  onChange={(e) => setNewTagCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={newTagType}
                  onChange={(e) => setNewTagType(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="ambos">Aplica para Ambos</option>
                  <option value="proyecto">Solo Proyectos</option>
                  <option value="servicio">Solo Servicios</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                + Guardar Etiqueta Oficial
              </button>
            </form>

            <div className="text-left space-y-3">
              <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Catálogo Oficial Registrado ({tags.length})
              </h4>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2.5 bg-gray-50 border border-gray-100 rounded-2xl">
                {tags.map((t) => (
                  <span
                    key={t._id || t.id}
                    className="bg-white border border-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2 shadow-2xs"
                  >
                    <span>{t.nombre}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                      {t.categoria}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(t._id || t.id)}
                      className="text-rose-500 hover:text-rose-700 font-extrabold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: PROYECTOS APROBADOS */}
        {activeAdminTab === 'proyectos' && (
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Proyectos Públicos Aprobados ({projects.length}):
            </h4>
            {projects.length > 0 ? (
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {projects.map((p) => (
                  <div key={p._id || p.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          {p.categoriaPrincipal}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">Por: {p.autor}</span>
                      </div>
                      <h5 className="text-sm font-bold text-gray-900">{p.titulo}</h5>
                      <p className="text-xs text-gray-500 line-clamp-1">{p.descripcion}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(p._id || p.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-8 text-center">No hay proyectos aprobados aún.</p>
            )}
          </div>
        )}

        {/* PESTAÑA 4: SERVICIOS APROBADOS */}
        {activeAdminTab === 'servicios' && (
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Servicios Públicos Aprobados ({services.length}):
            </h4>
            {services.length > 0 ? (
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {services.map((s) => (
                  <div key={s._id || s.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          {s.semestre}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">Estudiante: {s.nombreEstudiante}</span>
                      </div>
                      <h5 className="text-sm font-bold text-gray-900">{s.areaEspecialidad}</h5>
                      <p className="text-xs text-gray-500 line-clamp-1">{s.descripcion}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteService(s._id || s.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-8 text-center">No hay servicios aprobados aún.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

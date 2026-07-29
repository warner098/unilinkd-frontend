import React, { useState, useEffect } from 'react';

export default function AdminTagsModal({ isOpen, onClose }) {
  const [activeAdminTab, setActiveAdminTab] = useState('etiquetas'); // 'etiquetas' | 'proyectos' | 'servicios'
  const [tags, setTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);

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
      const [resTags, resProjects, resServices] = await Promise.all([
        fetch('http://localhost:5000/api/tags'),
        fetch('http://localhost:5000/api/projects'),
        fetch('http://localhost:5000/api/services')
      ]);

      if (resTags.ok) setTags(await resTags.json());
      if (resProjects.ok) setProjects(await resProjects.json());
      if (resServices.ok) setServices(await resServices.json());
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
      } else {
        const data = await res.json();
        alert(data.msg || 'Error al eliminar');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // MODERACIÓN: ELIMINAR PROYECTO COMO ADMIN
  const handleDeleteProject = async (id) => {
    if (!window.confirm('👑 ¿Confirmas eliminar este proyecto de la plataforma?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRol: 'admin' })
      });
      if (res.ok) {
        setProjects(projects.filter((p) => (p._id || p.id) !== id));
      } else {
        const data = await res.json();
        alert(data.msg || 'No se pudo eliminar el proyecto');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // MODERACIÓN: ELIMINAR SERVICIO COMO ADMIN
  const handleDeleteService = async (id) => {
    if (!window.confirm('👑 ¿Confirmas eliminar este servicio de la plataforma?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRol: 'admin' })
      });
      if (res.ok) {
        setServices(services.filter((s) => (s._id || s.id) !== id));
      } else {
        const data = await res.json();
        alert(data.msg || 'No se pudo eliminar el servicio');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
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
            Moderación & Gestión Global
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Gestiona las etiquetas oficiales o modera y elimina cualquier proyecto o servicio inapropiado.
          </p>
        </div>

        {/* PESTAÑAS DEL PANEL ADMIN */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveAdminTab('etiquetas')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'etiquetas'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏷️ Etiquetas ({tags.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab('proyectos')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'proyectos'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🚀 Moderar Proyectos ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab('servicios')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'servicios'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🤝 Moderar Servicios ({services.length})
          </button>
        </div>

        {/* MENSAJE DE ERROR */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* PESTAÑA 1: ETIQUETAS OFICIALES */}
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

        {/* PESTAÑA 2: MODERAR PROYECTOS */}
        {activeAdminTab === 'proyectos' && (
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Todos los Proyectos Activos ({projects.length}):
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
                      🗑️ Eliminar Proyecto
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-8 text-center">No hay proyectos activos registrados.</p>
            )}
          </div>
        )}

        {/* PESTAÑA 3: MODERAR SERVICIOS */}
        {activeAdminTab === 'servicios' && (
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Todos los Servicios Activos ({services.length}):
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
                      🗑️ Eliminar Servicio
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-8 text-center">No hay servicios activos registrados.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

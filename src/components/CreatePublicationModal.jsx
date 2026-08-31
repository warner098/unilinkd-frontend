import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function CreatePublicationModal({ isOpen, onClose, user, onSuccess }) {
  const [activeTab, setActiveTab] = useState('proyecto'); // 'proyecto' | 'servicio'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Catálogo de etiquetas oficiales desde MongoDB
  const [officialTags, setOfficialTags] = useState([]);
  const [projectSearchTag, setProjectSearchTag] = useState('');
  const [serviceSearchTag, setServiceSearchTag] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // ---------- ESTADO PROYECTO ----------
  const [projectData, setProjectData] = useState({
    titulo: '',
    descripcion: '',
    categoriaPrincipal: 'Programación / Software',
    colaboradoresBuscados: '2 Colaboradores',
    mediaUrl: '',
    referencias: '',
    repoUrl: '',
    etiquetas: ['React', 'Node.js']
  });

  // ---------- ESTADO SERVICIO ----------
  const [serviceData, setServiceData] = useState({
    nombreEstudiante: '',
    areaEspecialidad: '',
    descripcion: '',
    semestre: '1er Semestre',
    etiquetas: ['JavaScript', 'React']
  });

  // Cargar etiquetas oficiales desde el backend
  useEffect(() => {
    const fetchOfficialTags = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tags`);
        if (res.ok) {
          const data = await res.json();
          setOfficialTags(data);
        }
      } catch (err) {
        console.error('Error al cargar etiquetas oficiales:', err);
      }
    };
    if (isOpen) {
      fetchOfficialTags();
    }
  }, [isOpen]);

  // Precargar datos del usuario al abrir modal
  useEffect(() => {
    if (user) {
      setServiceData((prev) => ({
        ...prev,
        nombreEstudiante: user.nombre || '',
        semestre: user.semestre || '1er Semestre'
      }));
    }
    setErrorMsg('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Filtrar sugerencias oficiales para Proyecto
  const filteredProjectSuggestions = officialTags.filter((t) => {
    const matchCategory = t.categoria === projectData.categoriaPrincipal || t.categoria === 'Otras';
    const matchSearch = t.nombre.toLowerCase().includes(projectSearchTag.toLowerCase().trim());
    const notAlreadySelected = !projectData.etiquetas.includes(t.nombre);
    return matchCategory && matchSearch && notAlreadySelected;
  });

  // Filtrar sugerencias oficiales para Servicio
  const filteredServiceSuggestions = officialTags.filter((t) => {
    const matchSearch = t.nombre.toLowerCase().includes(serviceSearchTag.toLowerCase().trim());
    const notAlreadySelected = !serviceData.etiquetas.includes(t.nombre);
    return matchSearch && notAlreadySelected;
  });

  // Alternar etiquetas en Proyecto
  const toggleProjectTag = (tag) => {
    if (projectData.etiquetas.includes(tag)) {
      setProjectData({
        ...projectData,
        etiquetas: projectData.etiquetas.filter((t) => t !== tag)
      });
    } else {
      setProjectData({
        ...projectData,
        etiquetas: [...projectData.etiquetas, tag]
      });
    }
  };

  // Alternar etiquetas en Servicio
  const toggleServiceTag = (tag) => {
    if (serviceData.etiquetas.includes(tag)) {
      setServiceData({
        ...serviceData,
        etiquetas: serviceData.etiquetas.filter((t) => t !== tag)
      });
    } else {
      setServiceData({
        ...serviceData,
        etiquetas: [...serviceData.etiquetas, tag]
      });
    }
  };

  const parseResponseData = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    throw new Error('El servidor devolvió una respuesta no válida. Asegúrate de que el backend esté ejecutándose.');
  };

  // ENVIAR FORMULARIO PROYECTO
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...projectData,
          autor: user?.nombre || 'Estudiante UniLinkd',
          autorId: user?.id || user?._id,
          userRol: user?.rol
        })
      });

      const data = await parseResponseData(response);
      if (!response.ok) throw new Error(data.msg || 'Error al publicar el proyecto');

      if (user?.rol === 'admin') {
        alert('¡Proyecto / Convocatoria aprobada y publicada con éxito! 🚀');
      } else {
        alert('¡Tu proyecto ha sido enviado con éxito! Está en estado de revisión y aparecerá disponible cuando el Administrador lo apruebe. ⏳');
      }

      setLoading(false);
      if (onSuccess) onSuccess('proyecto', data);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  // ENVIAR FORMULARIO SERVICIO
  const handleSubmitService = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...serviceData,
          nombreEstudiante: serviceData.nombreEstudiante || user?.nombre || 'Estudiante',
          autorId: user?.id || user?._id,
          fotoUrl: user?.fotoUrl || '',
          userRol: user?.rol
        })
      });

      const data = await parseResponseData(response);
      if (!response.ok) throw new Error(data.msg || 'Error al publicar el servicio');

      if (user?.rol === 'admin') {
        alert('¡Servicio / Tutoría aprobada y publicada con éxito! 👤');
      } else {
        alert('¡Tu servicio ha sido enviado con éxito! Está en estado de revisión y aparecerá disponible cuando el Administrador lo apruebe. ⏳');
      }

      setLoading(false);
      if (onSuccess) onSuccess('servicio', data);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bento-card-glow bg-[#0C0F19]/95 text-white border border-white/10 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 cursor-pointer"
        >
          ✕
        </button>

        {/* ENCABEZADO */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
            <span>✨ NUEVA PUBLICACIÓN EN UNILINKD</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
            ¿Qué deseas publicar hoy?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {user?.rol === 'admin' 
              ? 'Tus publicaciones como Administrador se aprobarán automáticamente.' 
              : 'Tu solicitud será revisada por el Administrador antes de publicarse.'}
          </p>
        </div>

        {/* PESTAÑAS DEL MODAL */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('proyecto')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'proyecto'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🚀</span> Publicar Proyecto / Convocatoria
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('servicio')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'servicio'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>👤</span> Ofrecer Servicio / Asesoría
          </button>
        </div>

        {/* MENSAJE DE ERROR */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* FORMULARIO PESTAÑA 1: PROYECTO */}
        {activeTab === 'proyecto' && (
          <form onSubmit={handleSubmitProject} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                Nombre del Proyecto / Convocatoria *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Sistema de Exámenes Anti-Cheating o Grupo de estudio de Cálculo"
                value={projectData.titulo}
                onChange={(e) => setProjectData({ ...projectData, titulo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                  Categoría Principal *
                </label>
                <select
                  value={projectData.categoriaPrincipal}
                  onChange={(e) => setProjectData({ ...projectData, categoriaPrincipal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="Programación / Software" className="bg-slate-900 text-white">Programación / Software</option>
                  <option value="Matemáticas" className="bg-slate-900 text-white">Matemáticas</option>
                  <option value="Ciencias" className="bg-slate-900 text-white">Ciencias</option>
                  <option value="Diseño & Multimedia" className="bg-slate-900 text-white">Diseño & Multimedia</option>
                  <option value="Derecho" className="bg-slate-900 text-white">Derecho</option>
                  <option value="Otras" className="bg-slate-900 text-white">Otras</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                  Colaboradores Buscados
                </label>
                <input
                  type="text"
                  placeholder="Ej. 2 Colaboradores Backend, 1 Diseñador"
                  value={projectData.colaboradoresBuscados}
                  onChange={(e) => setProjectData({ ...projectData, colaboradoresBuscados: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* CAMPO CONDICIONAL: REPOSITORIO GITHUB/GITLAB */}
            {projectData.categoriaPrincipal === 'Programación / Software' && (
              <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 animate-fade-in">
                <label className="block text-xs font-extrabold text-indigo-300 uppercase mb-1 flex items-center gap-1.5">
                  <span>💻</span> Link al Repositorio (GitHub / GitLab)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/tu-usuario/tu-proyecto"
                  value={projectData.repoUrl}
                  onChange={(e) => setProjectData({ ...projectData, repoUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                Descripción del Proyecto *
              </label>
              <textarea
                required
                rows="3"
                placeholder="Explica de qué trata el proyecto, los objetivos y qué ayuda necesitas exactamente."
                value={projectData.descripcion}
                onChange={(e) => setProjectData({ ...projectData, descripcion: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                  Imagen o Video Demostrativo
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Pega una URL o elige de tu PC →"
                    value={projectData.mediaUrl}
                    onChange={(e) => setProjectData({ ...projectData, mediaUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <label className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-extrabold px-3 py-2 rounded-xl cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 shadow-xs">
                    <span>📁</span> Desde PC
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert('La imagen seleccionada no debe superar los 5MB.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProjectData({ ...projectData, mediaUrl: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {projectData.mediaUrl && projectData.mediaUrl.startsWith('data:image') && (
                  <div className="mt-2 flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-1.5 rounded-xl">
                    <img src={projectData.mediaUrl} alt="Vista previa" className="w-9 h-9 object-cover rounded-lg border border-emerald-200" />
                    <span className="text-[11px] font-bold text-emerald-800 flex-1">✓ Imagen seleccionada</span>
                    <button
                      type="button"
                      onClick={() => setProjectData({ ...projectData, mediaUrl: '' })}
                      className="text-xs text-rose-600 font-bold hover:text-rose-800 px-1 cursor-pointer"
                    >
                      × Quitar
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Referencias / Documentación (URL / Texto)
                </label>
                <input
                  type="text"
                  placeholder="Links a Papers, Google Drive, Notion, etc."
                  value={projectData.referencias}
                  onChange={(e) => setProjectData({ ...projectData, referencias: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* AUTOCOMPLETADO DE ETIQUETAS OFICIALES */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Buscar & Seleccionar Etiquetas Oficiales:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Escribe para buscar habilidades oficiales (ej. React, Cálculo, Figma)..."
                  value={projectSearchTag}
                  onFocus={() => setShowProjectDropdown(true)}
                  onChange={(e) => {
                    setProjectSearchTag(e.target.value);
                    setShowProjectDropdown(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* MENÚ DESPLEGABLE CON SUGERENCIAS OFICIALES */}
              {showProjectDropdown && filteredProjectSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto p-2">
                  <div className="text-[10px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                    Sugerencias Oficiales ({filteredProjectSuggestions.length}):
                  </div>
                  {filteredProjectSuggestions.map((tag) => (
                    <button
                      type="button"
                      key={tag._id || tag.nombre}
                      onClick={() => {
                        toggleProjectTag(tag.nombre);
                        setProjectSearchTag('');
                        setShowProjectDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-indigo-50 hover:text-indigo-700 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>+ {tag.nombre}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                        {tag.categoria}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* LISTADO DE ETIQUETAS SELECCIONADAS */}
              {projectData.etiquetas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-gray-400 mr-1 self-center">Seleccionadas:</span>
                  {projectData.etiquetas.map((t) => (
                    <span key={t} className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 shadow-2xs">
                      {t}
                      <button type="button" onClick={() => toggleProjectTag(t)} className="text-indigo-600 hover:text-indigo-900 font-bold ml-1 cursor-pointer">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÓN PUBLICAR */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-indigo-100 transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Publicando proyecto...' : '🚀 Publicar Proyecto'}
              </button>
            </div>
          </form>
        )}

        {/* FORMULARIO PESTAÑA 2: SERVICIO */}
        {activeTab === 'servicio' && (
          <form onSubmit={handleSubmitService} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Nombre del Estudiante *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre y apellido"
                  value={serviceData.nombreEstudiante}
                  onChange={(e) => setServiceData({ ...serviceData, nombreEstudiante: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Semestre Actual
                </label>
                <input
                  type="text"
                  placeholder="Ej. 5to Semestre"
                  value={serviceData.semestre}
                  onChange={(e) => setServiceData({ ...serviceData, semestre: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Especialidad o Área que Dominas *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Frontend Developer, Asesoría en Cálculo I, Tutoría de Normas APA"
                value={serviceData.areaEspecialidad}
                onChange={(e) => setServiceData({ ...serviceData, areaEspecialidad: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Descripción de lo que Ofreces *
              </label>
              <textarea
                required
                rows="3"
                placeholder="Describe brevemente tus conocimientos, horarios o la forma en que puedes ayudar a tus compañeros."
                value={serviceData.descripcion}
                onChange={(e) => setServiceData({ ...serviceData, descripcion: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              ></textarea>
            </div>

            {/* AUTOCOMPLETADO DE HABILIDADES OFICIALES */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Buscar & Seleccionar Habilidades Oficiales:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Escribe para buscar habilidades oficiales (ej. JavaScript, Normas APA)..."
                  value={serviceSearchTag}
                  onFocus={() => setShowServiceDropdown(true)}
                  onChange={(e) => {
                    setServiceSearchTag(e.target.value);
                    setShowServiceDropdown(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* MENÚ DESPLEGABLE CON SUGERENCIAS OFICIALES */}
              {showServiceDropdown && filteredServiceSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto p-2">
                  <div className="text-[10px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                    Sugerencias Oficiales ({filteredServiceSuggestions.length}):
                  </div>
                  {filteredServiceSuggestions.map((tag) => (
                    <button
                      type="button"
                      key={tag._id || tag.nombre}
                      onClick={() => {
                        toggleServiceTag(tag.nombre);
                        setServiceSearchTag('');
                        setShowServiceDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-emerald-50 hover:text-emerald-700 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>+ {tag.nombre}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                        {tag.categoria}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* LISTADO DE HABILIDADES SELECCIONADAS */}
              {serviceData.etiquetas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-gray-400 mr-1 self-center">Seleccionadas:</span>
                  {serviceData.etiquetas.map((t) => (
                    <span key={t} className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 shadow-2xs">
                      {t}
                      <button type="button" onClick={() => toggleServiceTag(t)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-1 cursor-pointer">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÓN PUBLICAR SERVICIO */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-emerald-100 transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Guardando servicio...' : '👤 Publicar Mi Servicio / Tutoría'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

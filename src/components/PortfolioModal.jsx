import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const ETIQUETAS_POPULARES = [
  'React', 'Node.js', 'Express', 'MongoDB', 'Python', 'C++', 'Java',
  'HTML/CSS', 'JavaScript', 'SQL', 'Git', 'Linux', 'Figma', 'UI/UX',
  'Redes', 'Bases de Datos', 'Cálculo', 'Álgebra', 'Derecho Constitucional',
  'Metodología de Investigación'
];

export default function PortfolioModal({ isOpen, onClose, user, onUpdateUser, showToast }) {
  if (!isOpen) return null;

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'add'
  const [proyectos, setProyectos] = useState(user?.portafolio || []);
  const [submitting, setSubmitting] = useState(false);

  // Sincronizar lista cuando cambia la prop user
  useEffect(() => {
    if (user?.portafolio) {
      setProyectos(user.portafolio);
    }
  }, [user]);

  // Estado para el formulario de agregar proyecto
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'Programación / Software',
    repoUrl: '',
    descripcion: '',
    mediaUrl: '',
    referencias: '',
    etiquetas: []
  });

  const [tagSearch, setTagSearch] = useState('');

  const resetForm = () => {
    setFormData({
      titulo: '',
      categoria: 'Programación / Software',
      repoUrl: '',
      descripcion: '',
      mediaUrl: '',
      referencias: '',
      etiquetas: []
    });
    setTagSearch('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, mediaUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEtiqueta = (tag) => {
    if (formData.etiquetas.includes(tag)) {
      setFormData({
        ...formData,
        etiquetas: formData.etiquetas.filter((t) => t !== tag)
      });
    } else {
      setFormData({
        ...formData,
        etiquetas: [...formData.etiquetas, tag]
      });
    }
  };

  const etiquetasFiltradas = ETIQUETAS_POPULARES.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      if (showToast) showToast('Por favor completa el título y la descripción del proyecto.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const userId = user?.id || user?._id;
      const res = await fetch(`${API_BASE_URL}/api/auth/portafolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          correo: user?.correo,
          ...formData
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProyectos(data.user?.portafolio || []);
        if (onUpdateUser) onUpdateUser(data.user);
        if (showToast) showToast('¡Proyecto guardado en tu portafolio personal! ✨', 'success');
        resetForm();
        setViewMode('list');
      } else {
        if (showToast) showToast('Error al guardar el proyecto en el servidor.', 'error');
      }
    } catch (err) {
      console.error('Error al guardar proyecto en portafolio:', err);
      if (showToast) showToast('Error de conexión al guardar el proyecto.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proyecto de tu portafolio?')) return;

    try {
      const userId = user?.id || user?._id;
      const res = await fetch(`${API_BASE_URL}/api/auth/portafolio/${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          correo: user?.correo
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProyectos(data.user?.portafolio || []);
        if (onUpdateUser) onUpdateUser(data.user);
        if (showToast) showToast('Proyecto eliminado del portafolio.', 'success');
      }
    } catch (err) {
      console.error('Error al eliminar proyecto del portafolio:', err);
      if (showToast) showToast('Error al eliminar el proyecto.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0C0F19] text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 relative max-h-[92vh] overflow-y-auto my-auto text-left">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold font-heading text-white">💼 Mi Portafolio Personal</h2>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold">
                {proyectos.length} {proyectos.length === 1 ? 'Proyecto' : 'Proyectos'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Muestra tus proyectos realizados, repositorios, documentación y experiencia destacada.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* NAVEGACIÓN VISTA (LISTA / FORMULARIO) */}
        <div className="flex justify-between items-center mb-6 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 Ver Proyectos ({proyectos.length})
            </button>
            <button
              onClick={() => setViewMode('add')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'add'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ➕ Agregar Proyecto
            </button>
          </div>
        </div>

        {/* VISTA 1: LISTA DE PROYECTOS SUBIDOS */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {proyectos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {proyectos.map((proj) => (
                  <div
                    key={proj.id || proj._id}
                    className="bento-card p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3 relative hover:border-indigo-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                          {proj.categoria}
                        </span>
                        <h3 className="text-base font-extrabold text-white font-heading mt-2">
                          {proj.titulo}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleDeleteProject(proj.id || proj._id)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-xl border border-rose-500/20 transition-all"
                        title="Eliminar proyecto del portafolio"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-normal leading-relaxed whitespace-pre-line">
                      {proj.descripcion}
                    </p>

                    {/* Previa de Imagen o Video */}
                    {proj.mediaUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-56 bg-slate-950/60">
                        {proj.mediaUrl.startsWith('data:image') || proj.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <img src={proj.mediaUrl} alt={proj.titulo} className="w-full max-h-56 object-cover" />
                        ) : (
                          <a
                            href={proj.mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block p-3 text-xs text-indigo-400 font-bold hover:underline"
                          >
                            🔗 Ver recurso multimedia adjunto
                          </a>
                        )}
                      </div>
                    )}

                    {/* Enlaces: Repositorio y Referencias */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-all"
                        >
                          💻 Repositorio GitHub / GitLab ↗
                        </a>
                      )}

                      {proj.referencias && (
                        <a
                          href={proj.referencias.startsWith('http') ? proj.referencias : `https://${proj.referencias}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
                        >
                          📚 Documentación / Referencias ↗
                        </a>
                      )}
                    </div>

                    {/* Etiquetas */}
                    {proj.etiquetas && proj.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.etiquetas.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-white/5 text-slate-300 px-2 py-0.5 rounded-md border border-white/10">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="text-4xl">💼</div>
                <h3 className="text-sm font-extrabold text-slate-200">Aún no has agregado proyectos a tu portafolio</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Muestra tus proyectos personales, académicos o sistemas desarrollados para destacar ante otros estudiantes.
                </p>
                <button
                  onClick={() => setViewMode('add')}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30"
                >
                  ➕ Agregar Primer Proyecto
                </button>
              </div>
            )}
          </div>
        )}

        {/* VISTA 2: FORMULARIO AGREGAR PROYECTO (DISEÑO BENTO OSCURO) */}
        {viewMode === 'add' && (
          <form onSubmit={handleSubmitProject} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                Nombre del Proyecto / Título *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Sistema de Gestión Escolar o App Móvil de Tutorías"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="input-dark w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                Categoría Principal *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="input-dark w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold text-sm focus:border-indigo-500 outline-none"
              >
                <option value="Programación / Software" className="bg-slate-900 text-white">Programación / Software</option>
                <option value="Matemáticas" className="bg-slate-900 text-white">Matemáticas</option>
                <option value="Ciencias" className="bg-slate-900 text-white">Ciencias</option>
                <option value="Diseño & Multimedia" className="bg-slate-900 text-white">Diseño & Multimedia</option>
                <option value="Derecho" className="bg-slate-900 text-white">Derecho</option>
                <option value="Otras" className="bg-slate-900 text-white">Otras</option>
              </select>
            </div>

            {/* CAMPO CONDICIONAL / OPIONAL: REPOSITORIO GITHUB/GITLAB */}
            {(formData.categoria === 'Programación / Software' || formData.categoria === 'Ciencias') && (
              <div className="bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/20 animate-fade-in space-y-1">
                <label className="block text-xs font-extrabold text-indigo-300 uppercase mb-1 flex items-center gap-1.5">
                  <span>💻</span> Link al Repositorio (GitHub / GitLab) (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/tu-usuario/tu-proyecto"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="input-dark w-full px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                Descripción del Proyecto *
              </label>
              <textarea
                required
                rows="4"
                placeholder="Explica detalladamente de qué trata el proyecto, la tecnología utilizada y los logros obtenidos..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="input-dark w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                  Imagen o Video Demostrativo (Opcional)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Pega una URL o elige de tu PC →"
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    className="input-dark flex-1 px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-xs outline-none"
                  />
                  <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2.5 rounded-xl text-xs font-bold text-white shrink-0">
                    📁 Desde PC
                    <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                  Referencias / Documentación (URL / Texto) (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Links a Papers, Google Drive, Notion, Figma, etc."
                  value={formData.referencias}
                  onChange={(e) => setFormData({ ...formData, referencias: e.target.value })}
                  className="input-dark w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white font-semibold placeholder:text-slate-500 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* ETIQUETAS OFICIALES */}
            <div>
              <label className="block text-xs font-extrabold text-slate-200 uppercase mb-1">
                Buscar & Seleccionar Etiquetas Oficiales:
              </label>
              <input
                type="text"
                placeholder="🔍 Escribe para buscar habilidades oficiales (ej. React, Cálculo, Figma)..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="input-dark w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-white text-xs placeholder:text-slate-500 outline-none mb-2"
              />

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                {etiquetasFiltradas.map((tag) => {
                  const activa = formData.etiquetas.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEtiqueta(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                        activa
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      }`}
                    >
                      {activa ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>

              {formData.etiquetas.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Seleccionadas:</span>
                  <div className="flex flex-wrap gap-1">
                    {formData.etiquetas.map((t) => (
                      <span key={t} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        {t}
                        <button type="button" onClick={() => toggleEtiqueta(t)} className="hover:text-rose-400 ml-0.5">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Guardando...' : '🚀 Publicar en Portafolio'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

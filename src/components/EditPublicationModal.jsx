import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function EditPublicationModal({ isOpen, onClose, item, itemType, user, onSuccess }) {
  const [officialTags, setOfficialTags] = useState([]);
  const [tagSearchInput, setTagSearchInput] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // CAMPOS DE PROYECTO
  const [projectData, setProjectData] = useState({
    titulo: '',
    descripcion: '',
    mediaUrl: '',
    repoUrl: '',
    categoriaPrincipal: 'Programación / Software',
    colaboradoresBuscados: 'Colaboradores',
    etiquetas: []
  });

  // CAMPOS DE SERVICIO
  const [serviceData, setServiceData] = useState({
    areaEspecialidad: '',
    descripcion: '',
    semestre: '1er Semestre',
    fotoUrl: '',
    etiquetas: []
  });

  const categoriasProyectos = [
    'Programación / Software',
    'Matemáticas',
    'Ciencias',
    'Diseño & Multimedia',
    'Derecho',
    'Otras'
  ];

  // CARGAR ETIQUETAS OFICIALES
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/api/tags`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setOfficialTags(data))
        .catch((err) => console.error('Error al cargar etiquetas:', err));
    }
  }, [isOpen]);

  // PRE-LLENAR FORMULARIO SEGÚN EL ITEM SELECCIONADO
  useEffect(() => {
    if (item && isOpen) {
      if (itemType === 'proyecto') {
        setProjectData({
          titulo: item.titulo || '',
          descripcion: item.descripcion || '',
          mediaUrl: item.mediaUrl || '',
          repoUrl: item.repoUrl || '',
          categoriaPrincipal: item.categoriaPrincipal || 'Programación / Software',
          colaboradoresBuscados: item.colaboradoresBuscados || 'Colaboradores',
          etiquetas: Array.isArray(item.etiquetas) ? item.etiquetas : []
        });
      } else {
        setServiceData({
          areaEspecialidad: item.areaEspecialidad || '',
          descripcion: item.descripcion || '',
          semestre: item.semestre || '1er Semestre',
          fotoUrl: item.fotoUrl || '',
          etiquetas: Array.isArray(item.etiquetas) ? item.etiquetas : []
        });
      }
      setErrorMsg('');
      setTagSearchInput('');
    }
  }, [item, itemType, isOpen]);

  if (!isOpen || !item) return null;

  // SUBIR IMAGEN DESDE PC PARA PROYECTO
  const handleProjectImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectData((prev) => ({ ...prev, mediaUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // SUBIR FOTO DESDE PC PARA SERVICIO
  const handleServiceImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setServiceData((prev) => ({ ...prev, fotoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // MANEJO DE ETIQUETAS
  const currentEtiquetas = itemType === 'proyecto' ? projectData.etiquetas : serviceData.etiquetas;

  const handleSelectOfficialTag = (tagName) => {
    if (currentEtiquetas.includes(tagName)) return;
    if (currentEtiquetas.length >= 6) {
      alert('Puedes seleccionar un máximo de 6 etiquetas.');
      return;
    }

    if (itemType === 'proyecto') {
      setProjectData((prev) => ({ ...prev, etiquetas: [...prev.etiquetas, tagName] }));
    } else {
      setServiceData((prev) => ({ ...prev, etiquetas: [...prev.etiquetas, tagName] }));
    }

    setTagSearchInput('');
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    if (itemType === 'proyecto') {
      setProjectData((prev) => ({
        ...prev,
        etiquetas: prev.etiquetas.filter((t) => t !== tagToRemove)
      }));
    } else {
      setServiceData((prev) => ({
        ...prev,
        etiquetas: prev.etiquetas.filter((t) => t !== tagToRemove)
      }));
    }
  };

  const filteredTags = officialTags.filter((t) => {
    if (!tagSearchInput.trim()) return true;
    return t.nombre.toLowerCase().includes(tagSearchInput.toLowerCase().trim());
  });

  // GUARDAR CAMBIOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const id = item._id || item.id;
    const isProject = itemType === 'proyecto';
    const endpoint = isProject ? `${API_BASE_URL}/api/projects/${id}` : `${API_BASE_URL}/api/services/${id}`;
    const payload = isProject 
      ? { ...projectData, userId: user?.id || user?._id, userRol: user?.rol }
      : { ...serviceData, userId: user?.id || user?._id, userRol: user?.rol };

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error al actualizar la publicación');

      alert('¡Cambios guardados con éxito! ✏️');
      setLoading(false);
      if (onSuccess) onSuccess();
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
            <span>✏️ EDICIÓN EN TIEMPO REAL</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {itemType === 'proyecto' ? 'Modificar Proyecto' : 'Modificar Servicio'}
          </h3>
          <p className="text-xs text-slate-400">
            Actualiza los datos de tu publicación. Los cambios se aplicarán de inmediato.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl text-left">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {itemType === 'proyecto' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Proyecto</label>
                <input
                  type="text"
                  required
                  value={projectData.titulo}
                  onChange={(e) => setProjectData({ ...projectData, titulo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría Principal</label>
                <select
                  value={projectData.categoriaPrincipal}
                  onChange={(e) => setProjectData({ ...projectData, categoriaPrincipal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {categoriasProyectos.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción Detallada</label>
                <textarea
                  rows={4}
                  required
                  value={projectData.descripcion}
                  onChange={(e) => setProjectData({ ...projectData, descripcion: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Imagen Demostrativa (Desde PC)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProjectImageUpload}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {projectData.mediaUrl && projectData.mediaUrl.startsWith('data:image') && (
                  <div className="mt-2 relative inline-block">
                    <img src={projectData.mediaUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setProjectData({ ...projectData, mediaUrl: '' })}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link Repositorio (Opcional)</label>
                <input
                  type="url"
                  value={projectData.repoUrl}
                  onChange={(e) => setProjectData({ ...projectData, repoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Área de Especialidad / Tutoría</label>
                <input
                  type="text"
                  required
                  value={serviceData.areaEspecialidad}
                  onChange={(e) => setServiceData({ ...serviceData, areaEspecialidad: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Semestre / Carrera</label>
                <input
                  type="text"
                  value={serviceData.semestre}
                  onChange={(e) => setServiceData({ ...serviceData, semestre: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción de Habilidades / Tutoría</label>
                <textarea
                  rows={4}
                  required
                  value={serviceData.descripcion}
                  onChange={(e) => setServiceData({ ...serviceData, descripcion: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Foto de Perfil / Demostrativa (Desde PC)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleServiceImageUpload}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {serviceData.fotoUrl && serviceData.fotoUrl.startsWith('data:image') && (
                  <div className="mt-2 relative inline-block">
                    <img src={serviceData.fotoUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setServiceData({ ...serviceData, fotoUrl: '' })}
                      className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ETIQUETAS OFICIALES */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Etiquetas Oficiales</label>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar etiqueta oficial..."
                value={tagSearchInput}
                onChange={(e) => {
                  setTagSearchInput(e.target.value);
                  setShowTagDropdown(true);
                }}
                onFocus={() => setShowTagDropdown(true)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />

              {showTagDropdown && (
                <div className="absolute z-30 left-0 right-0 top-11 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-2 space-y-1">
                  {filteredTags.length > 0 ? (
                    filteredTags.map((t) => (
                      <button
                        type="button"
                        key={t._id || t.id}
                        onClick={() => handleSelectOfficialTag(t.nombre)}
                        className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-xs rounded-xl flex items-center justify-between font-semibold text-gray-800 transition-colors"
                      >
                        <span>{t.nombre}</span>
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-500">{t.categoria}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-2">No se encontraron etiquetas oficiales.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentEtiquetas.map((t, idx) => (
                <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-indigo-600 hover:text-indigo-900 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3 rounded-2xl shadow-md text-sm transition-all cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? 'Guardando Cambios...' : '✓ Guardar Cambios'}
          </button>
        </form>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

export default function RequestHelpModal({ isOpen, onClose, service, user, showToast, onSuccess }) {
  const [tituloPeticion, setTituloPeticion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [referencias, setReferencias] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !service) return null;

  // Convertir imagen/video a Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      if (showToast) showToast('El archivo no debe superar los 20MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tituloPeticion.trim() || !descripcion.trim()) {
      if (showToast) showToast('Por favor escribe el título y la descripción de lo que necesitas.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        servicioId: service._id || service.id,
        servicioTitulo: service.areaEspecialidad || 'Servicio Universitario',
        autorServicioId: service.autorId || service.userId,
        autorServicioNombre: service.nombreEstudiante || service.autor || 'Estudiante',
        autorServicioFoto: service.fotoUrl || '',

        solicitanteId: user?.id || user?._id,
        solicitanteNombre: user?.nombre || 'Estudiante',
        solicitanteFoto: user?.fotoUrl || '',

        tituloPeticion,
        descripcion,
        mediaUrl,
        referencias
      };

      const res = await fetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'No se pudo enviar la propuesta de ayuda.');
      }

      if (showToast) {
        showToast('📩 ¡Tu propuesta de ayuda fue enviada! Se ha notificado al tutor.', 'success', '✨');
      }

      setLoading(false);
      if (onSuccess) onSuccess(data);
      onClose();

    } catch (err) {
      setLoading(false);
      if (showToast) showToast(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
      <div className="bento-card-glow bg-[#0C0F19]/95 text-white border border-white/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
        >
          ✕
        </button>

        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
            <span>🤝 SOLICITUD DE AYUDA DIRECTA</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Enviar Petición a {service.nombreEstudiante || 'Tutor'}
          </h3>

          <p className="text-xs text-slate-400">
            Petición para el servicio: <span className="text-indigo-300 font-extrabold">{service.areaEspecialidad}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Título / Nombre de la petición *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Ayuda con Formato Normas APA 7 en Tesis"
              value={tituloPeticion}
              onChange={(e) => setTituloPeticion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Descripción detallada de lo que necesitas *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explica qué temas necesitas reforzar, fecha límite o detalles del trabajo..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Enlaces o Referencias web (Opcional)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={referencias}
              onChange={(e) => setReferencias(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Adjuntar Foto, Captura o Documento (Opcional)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20 cursor-pointer"
            />
            {mediaUrl && (
              <div className="mt-2 relative inline-block">
                {mediaUrl.startsWith('data:image') ? (
                  <img src={mediaUrl} alt="Previsualización" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
                ) : (
                  <span className="text-xs text-emerald-400 font-bold">✓ Archivo adjuntado listo</span>
                )}
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center cursor-pointer shadow-md"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent-gradient font-black py-3.5 rounded-2xl text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Enviando petición...' : '📩 Enviar Propuesta de Ayuda'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

export default function JoinProjectModal({ isOpen, onClose, project, user, showToast, onSuccess }) {
  if (!isOpen || !project) return null;

  const [motivo, setMotivo] = useState('');
  const [referencias, setReferencias] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) {
      showToast('Por favor describe el motivo por el cual deseas unirte al proyecto.', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        servicioId: project._id || project.id,
        servicioTitulo: project.titulo,
        autorServicioId: project.autorId || project.autor,
        autorServicioNombre: project.autor || 'Estudiante Convocante',
        autorServicioFoto: '',
        solicitanteId: user.id || user._id,
        solicitanteNombre: user.nombre,
        solicitanteFoto: user.fotoUrl || '',
        tituloPeticion: `Solicitud de Colaboración: ${user.nombre}`,
        descripcion: motivo,
        referencias: referencias || '',
        tipoPeticion: 'proyecto'
      };

      const res = await fetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('¡Tu solicitud de colaboración ha sido enviada al creador del proyecto! 🚀', 'success');
        setMotivo('');
        setReferencias('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        const errData = await res.json();
        showToast(errData.msg || 'Error al enviar la solicitud de colaboración.', 'error');
      }
    } catch (err) {
      console.error('Error al unirse al proyecto:', err);
      showToast('Error de conexión al enviar la propuesta.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0C0F19] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/10 relative text-left space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
              🤝 Postulación a Proyecto
            </span>
            <h2 className="text-xl font-black text-white font-heading mt-2">
              Unirme a {project.titulo}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Convocado por: <span className="text-indigo-300 font-bold">{project.autor}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              ¿Por qué deseas unirte a este proyecto? <span className="text-indigo-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explica brevemente tu interés, las habilidades técnicas o conocimientos que puedes aportar al proyecto..."
              className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Enlaces de Portafolio / Repositorio / GitHub <span className="text-slate-500 font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              value={referencias}
              onChange={(e) => setReferencias(e.target.value)}
              placeholder="Ej: https://github.com/mi-usuario o link a tus proyectos"
              className="w-full p-3 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-extrabold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              {submitting ? 'Enviando Solicitud...' : '🚀 Enviar Solicitud de Colaboración'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

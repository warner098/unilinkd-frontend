import React from 'react';

export default function ProjectDetailModal({ isOpen, onClose, project, authorName, authorAvatar }) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0C0F19] text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 relative max-h-[90vh] overflow-y-auto my-auto text-left space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
              {project.categoria || 'Proyecto de Portafolio'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-2">
              {project.titulo}
            </h2>

            {authorName && (
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400 font-medium">
                <span>Por</span>
                <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} className="w-5 h-5 rounded-full object-cover border border-indigo-400" />
                  ) : (
                    <span className="w-5 h-5 bg-indigo-600 rounded-full inline-flex items-center justify-center text-[10px] text-white font-bold">
                      {authorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {authorName}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* PREVIA MULTIMEDIA (IMAGEN / VIDEO) */}
        {project.mediaUrl && (
          <div className="rounded-2xl overflow-hidden border border-white/10 max-h-80 bg-slate-950/80 flex items-center justify-center">
            {project.mediaUrl.startsWith('data:image') || project.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <img src={project.mediaUrl} alt={project.titulo} className="w-full max-h-80 object-contain" />
            ) : project.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={project.mediaUrl} controls className="w-full max-h-80" />
            ) : (
              <a
                href={project.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="p-6 text-sm font-bold text-indigo-400 hover:underline flex items-center gap-2"
              >
                🔗 Ver recurso adjunto en enlace externo ↗
              </a>
            )}
          </div>
        )}

        {/* DESCRIPCIÓN DETALLADA */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Descripción del Proyecto
          </h3>
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
            {project.descripcion}
          </div>
        </div>

        {/* REPOSITORIO Y REFERENCIAS */}
        {(project.repoUrl || project.referencias) && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Recursos & Enlaces de Interés
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  💻 Repositorio (GitHub / GitLab) ↗
                </a>
              )}

              {project.referencias && (
                <a
                  href={project.referencias.startsWith('http') ? project.referencias : `https://${project.referencias}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  📚 Documentación / Fuentes ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* ETIQUETAS */}
        {project.etiquetas && project.etiquetas.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Etiquetas Oficiales
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.etiquetas.map((t, idx) => (
                <span key={idx} className="text-xs font-bold bg-white/5 text-indigo-300 px-3 py-1 rounded-lg border border-white/10">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BOTÓN CERRAR */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold transition-all"
          >
            Cerrar Detalle
          </button>
        </div>

      </div>
    </div>
  );
}

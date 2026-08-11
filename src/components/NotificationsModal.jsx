import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function NotificationsModal({ isOpen, onClose, user, onUpdate, onOpenChatRequest }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await fetch(`${API_BASE_URL}/api/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ((n._id || n.id) === id ? { ...n, leido: true } : n))
        );
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error al marcar notif como leída:', err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => (n._id || n.id) !== id));
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
      <div className="bento-card-glow bg-[#0C0F19]/95 text-white border border-white/10 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
        >
          ✕
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
            <span>🔔 CENTRO DE NOTIFICACIONES</span>
          </div>
          <h3 className="text-2xl font-black text-white font-heading">
            Tus Avisos Universitarios
          </h3>
          <p className="text-xs text-slate-400">
            Novedades sobre tus solicitudes, peticiones de ayuda y publicaciones.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Cargando notificaciones...</div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => {
              const isRejected = n.tipo === 'publicacion_rechazada' || n.tipo === 'peticion_rechazada';
              const isApproved = n.tipo === 'publicacion_aprobada' || n.tipo === 'peticion_aceptada';
              const isRequest = n.tipo === 'peticion_recibida' || n.tipo === 'peticion_aceptada' || n.requestId;

              return (
                <div
                  key={n._id || n.id}
                  className={`p-4 rounded-2xl border transition-all text-left space-y-3 ${
                    !n.leido
                      ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/50 border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {isApproved ? '✅' : isRejected ? '⚠️' : '📩'}
                      </span>
                      <h4 className="text-xs font-extrabold text-white font-heading">{n.titulo}</h4>
                    </div>

                    {!n.leido && (
                      <span className="bg-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        Nuevo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    {n.mensaje}
                  </p>

                  {isRequest && onOpenChatRequest && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(n._id || n.id);
                        onOpenChatRequest(n.requestId);
                        onClose();
                      }}
                      className="w-full btn-accent-gradient font-black text-xs py-2 rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <span>💬 Abrir Chat / Petición →</span>
                    </button>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
                    {!n.leido && (
                      <button
                        onClick={() => handleMarkAsRead(n._id || n.id)}
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        ✓ Marcar leída
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(n._id || n.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-rose-400 cursor-pointer ml-2"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 bg-slate-900 text-slate-400 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              🔔
            </div>
            <p className="text-xs font-semibold text-slate-400">No tienes notificaciones pendientes.</p>
          </div>
        )}

      </div>
    </div>
  );
}

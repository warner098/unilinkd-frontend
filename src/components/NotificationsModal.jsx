import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function NotificationsModal({ isOpen, onClose, user, onUpdate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userId = user.id || user._id;
      const userName = user.nombre;
      const url = `${API_BASE_URL}/api/notifications/${userId}?autorNombre=${encodeURIComponent(userName || '')}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/leido`, {
        method: 'PUT'
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ((n._id || n.id) === id ? { ...n, leido: true } : n))
        );
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error:', err);
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
      console.error('Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* ENCABEZADO */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-xs font-bold">
            <span>🔔 Centro de Avisos</span>
          </div>
          <h3 className="text-2xl font-extrabold text-[#0F172A]">
            Tus Notificaciones
          </h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Estado de revisión de tus publicaciones y respuestas del equipo de moderación.
          </p>
        </div>

        {/* CONTENIDO DE NOTIFICACIONES */}
        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-gray-400">
            Cargando notificaciones...
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => {
              const isApproved = n.tipo === 'aprobado';
              const isRejected = n.tipo === 'rechazado';

              return (
                <div
                  key={n._id || n.id}
                  className={`p-4 rounded-2xl border transition-all text-left relative flex flex-col justify-between space-y-2 ${
                    n.leido ? 'bg-gray-50 border-gray-200 opacity-85' : 'bg-indigo-50/50 border-indigo-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl">
                        {isApproved ? '🎉' : isRejected ? '⚠️' : 'ℹ️'}
                      </span>
                      <div>
                        <h4 className={`text-sm font-extrabold ${
                          isApproved ? 'text-emerald-800' : isRejected ? 'text-rose-800' : 'text-slate-800'
                        }`}>
                          {n.titulo}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(n.fechaCreacion).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {!n.leido && (
                      <span className="bg-indigo-600 w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" title="No leída"></span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-gray-100">
                    {n.mensaje}
                  </p>

                  {isRejected && n.motivo && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 font-medium">
                      <span className="font-bold text-rose-700 block mb-0.5">📌 Razón del Rechazo / Corrección Solicitada:</span>
                      "{n.motivo}"
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100/60">
                    {!n.leido && (
                      <button
                        onClick={() => handleMarkAsRead(n._id || n.id)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        ✓ Marcar como leída
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(n._id || n.id)}
                      className="text-[11px] font-bold text-gray-400 hover:text-rose-600 cursor-pointer ml-2"
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
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🔔
            </div>
            <p className="text-xs font-semibold text-gray-500">No tienes notificaciones pendientes.</p>
          </div>
        )}

      </div>
    </div>
  );
}

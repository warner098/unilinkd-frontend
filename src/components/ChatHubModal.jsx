import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export default function ChatHubModal({ isOpen, onClose, user, initialRequestId, showToast }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref que mantiene el ID del chat seleccionado inmune a re-renders y closures de setInterval
  const activeSelectedIdRef = useRef(initialRequestId || null);

  // Estado del mensaje de chat
  const [newMessageText, setNewMessageText] = useState('');
  const [messageMediaUrl, setMessageMediaUrl] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Estado de rechazo
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (initialRequestId) {
      activeSelectedIdRef.current = initialRequestId;
    }
  }, [initialRequestId]);

  // Cargar peticiones del usuario
  const fetchRequests = async () => {
    if (!user) return;
    const userId = user.id || user._id;

    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        
        // Para el tutor, filtrar peticiones rechazadas para que desaparezcan de su lista
        const activeData = data.filter(r => {
          if (r.autorServicioId === userId && r.estado === 'rechazado') {
            return false;
          }
          return true;
        });

        setRequests(activeData);

        const currentSelectedId = activeSelectedIdRef.current;

        if (currentSelectedId) {
          const found = activeData.find(r => (r._id || r.id) === currentSelectedId);
          if (found) {
            setSelectedRequest(found);
          } else if (activeData.length > 0) {
            const firstId = activeData[0]._id || activeData[0].id;
            activeSelectedIdRef.current = firstId;
            setSelectedRequest(activeData[0]);
          } else {
            activeSelectedIdRef.current = null;
            setSelectedRequest(null);
          }
        } else if (activeData.length > 0) {
          const firstId = activeData[0]._id || activeData[0].id;
          activeSelectedIdRef.current = firstId;
          setSelectedRequest(activeData[0]);
        } else {
          activeSelectedIdRef.current = null;
          setSelectedRequest(null);
        }
      }
    } catch (err) {
      console.error('Error al cargar chat requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      if (initialRequestId) {
        activeSelectedIdRef.current = initialRequestId;
      }
      fetchRequests();

      // Polling continuo cada 3s para chat en vivo sin resetear la selección del usuario
      const interval = setInterval(fetchRequests, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user, initialRequestId]);

  useEffect(() => {
    // Scroll al final del chat cuando llegan nuevos mensajes
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedRequest?.mensajes]);

  if (!isOpen) return null;

  const currentUserId = user?.id || user?._id;

  // Cambiar manualmente de chat en la lista lateral
  const handleSelectRequest = (req) => {
    const targetId = req._id || req.id;
    activeSelectedIdRef.current = targetId;
    setSelectedRequest(req);
    setShowRejectInput(false);
  };

  // Cambiar estado a ACEPTADO o RECHAZADO
  const handleUpdateStatus = async (nuevoEstado, motivo = '') => {
    if (!selectedRequest) return;
    const currentId = selectedRequest._id || selectedRequest.id;

    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${currentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: nuevoEstado,
          motivoRechazo: motivo,
          userId: currentUserId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'No se pudo actualizar el estado');

      if (showToast) {
        showToast(
          nuevoEstado === 'aceptado'
            ? '✅ ¡Petición Aceptada! El chat en vivo ha sido habilitado.'
            : '🗑️ Petición rechazada y eliminada de tu lista.',
          nuevoEstado === 'aceptado' ? 'success' : 'warning'
        );
      }

      setShowRejectInput(false);

      if (nuevoEstado === 'rechazado') {
        // Remover de la lista e ir a la siguiente petición
        const remaining = requests.filter(r => (r._id || r.id) !== currentId);
        setRequests(remaining);

        if (remaining.length > 0) {
          const nextReq = remaining[0];
          const nextId = nextReq._id || nextReq.id;
          activeSelectedIdRef.current = nextId;
          setSelectedRequest(nextReq);
        } else {
          activeSelectedIdRef.current = null;
          setSelectedRequest(null);
        }
      } else {
        fetchRequests();
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Enviar mensaje en el chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() && !messageMediaUrl) return;
    if (!selectedRequest) return;

    setSendingMessage(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${selectedRequest._id || selectedRequest.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emisorId: currentUserId,
          emisorNombre: user?.nombre || 'Estudiante',
          emisorFoto: user?.fotoUrl || '',
          mensaje: newMessageText,
          mediaUrl: messageMediaUrl
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Error al enviar mensaje');
      }

      setNewMessageText('');
      setMessageMediaUrl('');
      fetchRequests();
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  // Adjuntar imagen en chat
  const handleChatFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMessageMediaUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Peticiones agrupadas
  const peticionesComoTutor = requests.filter(r => r.autorServicioId === currentUserId && r.estado !== 'rechazado');
  const peticionesComoSolicitante = requests.filter(r => r.solicitanteId === currentUserId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in text-left">
      <div className="bento-card-glow bg-[#0B0E17]/95 text-white border border-white/10 rounded-3xl w-full max-w-5xl h-[88vh] shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
        >
          ✕
        </button>

        {/* ======================================================== */}
        {/* COLUMNA IZQUIERDA: ESTILO CANALES / CHATS DISCORD          */}
        {/* ======================================================== */}
        <div className="w-full md:w-80 bg-[#07090F] border-r border-white/10 flex flex-col h-full shrink-0">
          
          <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-inner">
              💬
            </div>
            <div>
              <h3 className="text-sm font-black text-white font-heading">Mensajes & Peticiones</h3>
              <p className="text-[11px] text-slate-400 font-mono-code">UniLinkd Chat Hub</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            
            {/* GRUPO 1: PETICIONES RECIBIDAS (COMO TUTOR) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase tracking-widest px-2">
                📥 Recibidas en mis servicios ({peticionesComoTutor.length})
              </span>

              {peticionesComoTutor.length > 0 ? (
                <div className="space-y-1">
                  {peticionesComoTutor.map((req) => {
                    const reqId = req._id || req.id;
                    const isSelected = selectedRequest && (selectedRequest._id || selectedRequest.id) === reqId;
                    const isPending = req.estado === 'pendiente';

                    return (
                      <button
                        key={reqId}
                        onClick={() => handleSelectRequest(req)}
                        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-white/10'
                            : 'hover:bg-slate-900/90 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="relative">
                          {req.solicitanteFoto ? (
                            <img src={req.solicitanteFoto} alt={req.solicitanteNombre} className="w-9 h-9 rounded-xl object-cover" />
                          ) : (
                            <div className="w-9 h-9 bg-slate-800 text-indigo-300 font-black text-xs rounded-xl flex items-center justify-center border border-white/10">
                              {(req.solicitanteNombre || 'S').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                            isPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                          }`}></span>
                        </div>

                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-xs font-bold truncate">{req.tituloPeticion}</h4>
                          <p className="text-[11px] text-slate-400 truncate">De: {req.solicitanteNombre}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic px-2">No tienes peticiones activas.</p>
              )}
            </div>

            {/* GRUPO 2: MIS SOLICITUDES ENVIADAS (COMO SOLICITANTE) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase tracking-widest px-2">
                📤 Mis Solicitudes Enviadas ({peticionesComoSolicitante.length})
              </span>

              {peticionesComoSolicitante.length > 0 ? (
                <div className="space-y-1">
                  {peticionesComoSolicitante.map((req) => {
                    const reqId = req._id || req.id;
                    const isSelected = selectedRequest && (selectedRequest._id || selectedRequest.id) === reqId;
                    const isPending = req.estado === 'pendiente';

                    return (
                      <button
                        key={reqId}
                        onClick={() => handleSelectRequest(req)}
                        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-white/10'
                            : 'hover:bg-slate-900/90 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="relative">
                          <div className="w-9 h-9 bg-slate-800 text-indigo-300 font-black text-xs rounded-xl flex items-center justify-center border border-white/10">
                            {(req.autorServicioNombre || 'T').charAt(0).toUpperCase()}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                            isPending ? 'bg-amber-400 animate-pulse' : req.estado === 'aceptado' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}></span>
                        </div>

                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-xs font-bold truncate">{req.tituloPeticion}</h4>
                          <p className="text-[11px] text-slate-400 truncate">Tutor: {req.autorServicioNombre}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic px-2">No has enviado solicitudes aún.</p>
              )}
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMNA DERECHA: PANEL DE PROPUESTA O CHAT VIVO DISCORD  */}
        {/* ======================================================== */}
        <div className="flex-1 flex flex-col h-full bg-[#0C0F19] overflow-hidden">
          
          {selectedRequest ? (
            <>
              {/* CABECERA SUPERIOR DEL CHAT */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white font-heading">
                      {selectedRequest.tituloPeticion}
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      selectedRequest.estado === 'pendiente'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : selectedRequest.estado === 'aceptado'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    }`}>
                      {selectedRequest.estado === 'pendiente' ? '⏳ Pendiente' : selectedRequest.estado === 'aceptado' ? '✅ Chat Activo' : '❌ Rechazado'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Servicio: <span className="text-indigo-400 font-bold">{selectedRequest.servicioTitulo}</span> | Solicitante: <span className="text-white font-bold">{selectedRequest.solicitanteNombre}</span>
                  </p>
                </div>
              </div>

              {/* CONTENIDO DEL PANEL */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* TARJETA DE LA PROPUESTA INICIAL ENVIADA */}
                <div className="bento-card p-5 space-y-3 bg-slate-950/60 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-mono-code font-bold text-indigo-300 uppercase tracking-wider">
                      📌 Propuesta de Ayuda Inicial
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono-code">
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    {selectedRequest.descripcion}
                  </p>

                  {selectedRequest.referencias && (
                    <div className="pt-2">
                      <a 
                        href={selectedRequest.referencias} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline font-bold"
                      >
                        🔗 Ver referencia o enlace adjunto →
                      </a>
                    </div>
                  )}

                  {selectedRequest.mediaUrl && (
                    <div className="pt-2">
                      {selectedRequest.mediaUrl.startsWith('data:image') ? (
                        <img src={selectedRequest.mediaUrl} alt="Adjunto de propuesta" className="max-h-48 rounded-xl border border-white/10 object-cover" />
                      ) : (
                        <a href={selectedRequest.mediaUrl} download className="text-xs text-indigo-300 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 inline-block">
                          📎 Descargar archivo adjunto
                        </a>
                      )}
                    </div>
                  )}

                  {/* SI LA PETICIÓN ESTÁ PENDIENTE Y EL USUARIO ES EL TUTOR DEL SERVICIO */}
                  {selectedRequest.estado === 'pendiente' && selectedRequest.autorServicioId === currentUserId && (
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <p className="text-xs font-bold text-amber-300">
                        👉 Revisa la propuesta y decide si deseas aceptar la petición para iniciar el chat en tiempo real:
                      </p>

                      {!showRejectInput ? (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleUpdateStatus('aceptado')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                          >
                            <span>✅</span> Aceptar Petición & Iniciar Chat
                          </button>

                          <button
                            onClick={() => setShowRejectInput(true)}
                            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                          >
                            <span>❌</span> Rechazar Petición
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                          <label className="block text-xs font-bold text-rose-300">Motivo del rechazo:</label>
                          <input
                            type="text"
                            placeholder="Ej. No dispongo de tiempo esta semana..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white outline-none"
                          />
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleUpdateStatus('rechazado', rejectionReason)}
                              className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                            >
                              Confirmar Rechazo y Eliminar
                            </button>
                            <button
                              onClick={() => setShowRejectInput(false)}
                              className="text-xs text-slate-400 font-bold px-3 py-2 cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SI LA PETICIÓN FUE RECHAZADA (SOLO VISIBLE PARA EL SOLICITANTE) */}
                  {selectedRequest.estado === 'rechazado' && selectedRequest.solicitanteId === currentUserId && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-200">
                      <span className="font-extrabold text-rose-400 block">⚠️ Petición Rechazada por el tutor:</span>
                      "{selectedRequest.motivoRechazo || 'Información no adecuada'}"
                    </div>
                  )}

                </div>

                {/* HISTORIAL DE CHAT EN TIEMPO REAL (DISCORD STREAM) */}
                {selectedRequest.estado === 'aceptado' && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-mono-code my-4">
                      <div className="flex-1 border-t border-white/10"></div>
                      <span>INICIO DEL CHAT EN VIVO DE LA PETICIÓN</span>
                      <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    {selectedRequest.mensajes && selectedRequest.mensajes.length > 0 ? (
                      selectedRequest.mensajes.map((msg, index) => {
                        const isMe = msg.emisorId === currentUserId;

                        return (
                          <div key={index} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/10">
                              {(msg.emisorNombre || 'E').charAt(0).toUpperCase()}
                            </div>

                            <div className={`max-w-md space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                              <div className="flex items-center gap-2 px-1">
                                <span className="text-[11px] font-bold text-slate-300">{msg.emisorNombre}</span>
                                <span className="text-[9px] text-slate-500 font-mono-code">
                                  {new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isMe 
                                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20' 
                                  : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                              }`}>
                                {msg.mensaje}

                                {msg.mediaUrl && (
                                  <div className="mt-2">
                                    <img src={msg.mediaUrl} alt="Adjunto chat" className="max-h-40 rounded-lg object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-6">
                        ¡El chat ha sido habilitado! Envía un mensaje para comenzar a hablar sobre el trabajo.
                      </p>
                    )}

                    <div ref={chatBottomRef} />
                  </div>
                )}

              </div>

              {/* CAJA DE TEXTO DEL CHAT TIPO DISCORD */}
              {selectedRequest.estado === 'aceptado' && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center gap-3">
                  <label title="Adjuntar imagen" className="text-slate-400 hover:text-white p-2.5 rounded-xl hover:bg-white/10 cursor-pointer border border-white/5 transition-colors">
                    <span>📎</span>
                    <input type="file" accept="image/*" onChange={handleChatFileChange} className="hidden" />
                  </label>

                  {messageMediaUrl && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                      Imagen adjunta ✓
                    </span>
                  )}

                  <input
                    type="text"
                    placeholder={`Enviar mensaje sobre "${selectedRequest.tituloPeticion}"...`}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900 text-white placeholder-slate-500 text-xs focus:border-indigo-500 outline-none"
                  />

                  <button
                    type="submit"
                    disabled={sendingMessage || (!newMessageText.trim() && !messageMediaUrl)}
                    className="btn-accent-gradient font-black text-xs px-5 py-2.5 rounded-2xl cursor-pointer disabled:opacity-40"
                  >
                    Enviar 🚀
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl">
                💬
              </div>
              <h3 className="text-lg font-extrabold text-white font-heading">
                Selecciona una petición o chat
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Elige una solicitud recibida o enviada desde la lista de la izquierda para revisar la propuesta técnica o chatear.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

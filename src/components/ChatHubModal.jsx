import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

// ========================================================
// COMPONENTE LIGHTBOX DE IMAGEN CON ZOOM E INTERACCIÓN
// ========================================================
function ZoomableImageModal({ image, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  positionRef.current = position;

  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  if (!image || !image.src) return null;

  // LÍMITES DE ARRASTRE PARA QUE LA IMAGEN NUNCA SALGA DEL CUADRO
  const getClampedPosition = (targetX, targetY, currentScale) => {
    if (currentScale <= 1) return { x: 0, y: 0 };

    if (imgRef.current) {
      const imgWidth = imgRef.current.clientWidth || 300;
      const imgHeight = imgRef.current.clientHeight || 300;

      // Desplazamiento máximo permitido para no desbordar el cuadro
      const maxDragX = Math.max(0, (imgWidth * (currentScale - 1)) / 2);
      const maxDragY = Math.max(0, (imgHeight * (currentScale - 1)) / 2);

      return {
        x: Math.max(-maxDragX, Math.min(maxDragX, targetX)),
        y: Math.max(-maxDragY, Math.min(maxDragY, targetY))
      };
    }

    return { x: targetX, y: targetY };
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => {
    setScale(prev => {
      const nextScale = Math.max(prev - 0.25, 1);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // INICIAR ARRASTRE ÚNICAMENTE AL MANTENER PRESIONADO EL BOTÓN IZQUIERDO DEL MOUSE
  const handleMouseDown = (e) => {
    if (e.button !== 0 || scale <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y
    };
  };

  // LISTENERS EN EL WINDOW CON CLAMPING EN TIEMPO REAL
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e) => {
      e.preventDefault();
      const rawX = e.clientX - dragStartRef.current.x;
      const rawY = e.clientY - dragStartRef.current.y;

      const clamped = getClampedPosition(rawX, rawY, scaleRef.current);
      setPosition(clamped);
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  // RE-CALCULAR Y AUTO-CENTRAR CUANDO LA ESCALA CAMBIA
  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition(prev => getClampedPosition(prev.x, prev.y, scale));
    }
  }, [scale]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-fade-in select-none p-4"
      onClick={onClose}
    >
      {/* TÍTULO Y CONTROLES SUPERIORES */}
      <div 
        className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[#0C0F19]/90 border border-white/10 px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs font-bold text-white max-w-[200px] truncate hidden sm:inline">
          {image.title || 'Vista Previa'}
        </span>
        <div className="w-px h-4 bg-white/10 hidden sm:block"></div>

        <button
          onClick={handleZoomOut}
          disabled={scale <= 1}
          title="Alejar (Zoom -)"
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all border border-white/10"
        >
          🔍 -
        </button>
        <span className="text-xs font-mono-code font-bold text-indigo-300 px-1 min-w-[45px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={scale >= 4}
          title="Acercar (Zoom +)"
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all border border-white/10"
        >
          🔍 +
        </button>
        
        <div className="w-px h-4 bg-white/10"></div>

        <button
          onClick={handleReset}
          title="Restablecer tamaño original"
          className="text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
        >
          ↺ Reset
        </button>
      </div>

      {/* BOTÓN CERRAR */}
      <button
        onClick={onClose}
        title="Cerrar vista previa"
        className="absolute top-5 right-5 z-20 bg-slate-900/90 hover:bg-rose-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 cursor-pointer shadow-xl transition-all"
      >
        ✕
      </button>

      {/* CONTENEDOR DE LA IMAGEN CON LÍMITES DE ARRASTRE STRICTOS */}
      <div
        ref={containerRef}
        className={`relative max-w-[90vw] max-h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <img
          ref={imgRef}
          src={image.src}
          alt={image.title || "Imagen ampliada"}
          style={{
            transform: `translate(${scale === 1 ? 0 : position.x}px, ${scale === 1 ? 0 : position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          className="max-w-[85vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-none"
        />
      </div>
    </div>
  );
}

// ========================================================
// COMPONENTE PRINCIPAL CHAT HUB
// ========================================================
export default function ChatHubModal({ isOpen, onClose, user, initialRequestId, filterServiceId, showToast, onOpenPublicProfile }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref que mantiene el ID del chat seleccionado inmune a re-renders y closures de setInterval
  const activeSelectedIdRef = useRef(initialRequestId || null);

  // Estado del mensaje de chat y archivo adjunto
  const [newMessageText, setNewMessageText] = useState('');
  const [messageMediaUrl, setMessageMediaUrl] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Estado de rechazo
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Estado de confirmación de borrado de chat
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [targetDeleteChatId, setTargetDeleteChatId] = useState(null);

  // Estado para la imagen en Zoom Lightbox
  const [activeZoomImage, setActiveZoomImage] = useState(null);

  const chatBottomRef = useRef(null);
  const mainScrollPanelRef = useRef(null);

  // CONTROL INTELIGENTE DE SCROLL Y PRESERVACIÓN RIGUROSA DE POSICIÓN
  const isUserScrolledUpRef = useRef(false);
  const savedScrollTopRef = useRef(0);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
  const prevMsgCountRef = useRef(0);
  const prevChatIdRef = useRef(null);

  useEffect(() => {
    if (initialRequestId) {
      activeSelectedIdRef.current = initialRequestId;
    }
  }, [initialRequestId]);

  const currentUserId = user?.id || user?._id;
  const currentUserName = (user?.nombre || user?.nombreEstudiante || '').trim().toLowerCase();
  const userPhoto = user?.fotoUrl || user?.foto || user?.avatar || '';

  const isTutorOfReq = (r) => {
    if (!r) return false;
    const reqAutorId = r.autorServicioId ? r.autorServicioId.toString() : '';
    const reqAutorNombre = (r.autorServicioNombre || '').trim().toLowerCase();
    
    if (currentUserId && reqAutorId && reqAutorId === currentUserId.toString()) return true;
    if (currentUserName && reqAutorNombre && reqAutorNombre === currentUserName) return true;
    return false;
  };

  const isSolicitantOfReq = (r) => {
    if (!r) return false;
    const reqSolId = r.solicitanteId ? r.solicitanteId.toString() : '';
    const reqSolNombre = (r.solicitanteNombre || '').trim().toLowerCase();

    if (currentUserId && reqSolId && reqSolId === currentUserId.toString()) return true;
    if (currentUserName && reqSolNombre && reqSolNombre === currentUserName) return true;
    return false;
  };

  // Ayudantes de archivos
  const getFileIcon = (fileName = '', fileType = '') => {
    const ext = (fileName || '').split('.').pop()?.toLowerCase() || '';
    if ((fileType && fileType.startsWith('image/')) || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return '🖼️';
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
    if (['ppt', 'pptx'].includes(ext)) return '📊';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
    if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) return '🎵';
    if (['mp4', 'mkv', 'avi', 'mov'].includes(ext)) return '🎥';
    if (['txt', 'json', 'js', 'py', 'html', 'css'].includes(ext)) return '📄';
    return '📎';
  };

  const isMediaImage = (mediaUrl = '', fileName = '') => {
    if (!mediaUrl) return false;
    if (mediaUrl.startsWith('data:image/')) return true;
    const ext = (fileName || '').split('.').pop()?.toLowerCase() || mediaUrl.split('.').pop()?.toLowerCase() || '';
    return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
  };

  // Cargar peticiones del usuario con comparación estricta para evitar re-renders si la info no ha cambiado
  const fetchRequests = async () => {
    if (!user) return;
    const userId = user.id || user._id;
    const userName = user.nombre || '';

    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/user/${userId}?userNombre=${encodeURIComponent(userName)}`);
      if (res.ok) {
        const data = await res.json();
        
        let activeData = data.filter(r => {
          if (isTutorOfReq(r) && r.estado === 'rechazado') {
            return false;
          }
          return true;
        });

        // Si se especificó un filtro de servicio particular desde la tarjeta
        if (filterServiceId) {
          const serviceSpecific = activeData.filter(r => 
            isTutorOfReq(r) && (r.servicioId === filterServiceId || r.servicioId?.toString() === filterServiceId.toString())
          );
          if (serviceSpecific.length > 0 && !activeSelectedIdRef.current) {
            activeSelectedIdRef.current = serviceSpecific[0]._id || serviceSpecific[0].id;
          }
        }

        // 1. PRESERVAR REFERENCIA DE REQUESTS
        setRequests(prev => {
          if (JSON.stringify(prev) === JSON.stringify(activeData)) {
            return prev;
          }
          return activeData;
        });

        const currentSelectedId = activeSelectedIdRef.current;

        if (currentSelectedId) {
          const found = activeData.find(r => (r._id || r.id) === currentSelectedId);
          if (found) {
            // 2. PRESERVAR REFERENCIA DE SELECTED REQUEST
            setSelectedRequest(prev => {
              if (!prev) return found;
              const prevId = prev._id || prev.id;
              const foundId = found._id || found.id;
              
              if (
                prevId === foundId &&
                prev.estado === found.estado &&
                JSON.stringify(prev.mensajes) === JSON.stringify(found.mensajes)
              ) {
                return prev; // MISMA REFERENCIA DE OBJETO -> NINGÚN RE-RENDER
              }
              return found;
            });
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

      // Polling continuo cada 3s para chat en vivo
      const interval = setInterval(fetchRequests, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user, initialRequestId, filterServiceId]);

  // CAPTURAR LA POSICIÓN EXACTA DE SCROLL DEL USUARIO AL MOVER LA RUEDA O EL TOUCH
  const handlePanelScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    const isUp = distanceToBottom > 100;
    
    isUserScrolledUpRef.current = isUp;
    if (isUp) {
      savedScrollTopRef.current = scrollTop;
    }
    setShowScrollDownBtn(isUp);
  };

  // RESTAURACIÓN SYNCRÓNICA DE SCROLL ANTES DE QUE EL NAVEGADOR PINTE LA PANTALLA
  useLayoutEffect(() => {
    if (isUserScrolledUpRef.current && mainScrollPanelRef.current) {
      mainScrollPanelRef.current.scrollTop = savedScrollTopRef.current;
    }
  });

  // SCROLL EXPLÍCITO HACIA EL FINAL
  const scrollToBottom = (behavior = 'smooth') => {
    isUserScrolledUpRef.current = false;
    setShowScrollDownBtn(false);
    chatBottomRef.current?.scrollIntoView({ behavior });
  };

  // CONTROL INTELIGENTE DE SCROLL AL CAMBIAR DE CHAT O LLEGAR NUEVOS MENSAJES
  useEffect(() => {
    if (!selectedRequest) return;
    const currentId = selectedRequest._id || selectedRequest.id;
    const currentCount = selectedRequest.mensajes ? selectedRequest.mensajes.length : 0;

    // 1. Si cambió de canal/chat en la lista lateral
    if (prevChatIdRef.current !== currentId) {
      prevChatIdRef.current = currentId;
      prevMsgCountRef.current = currentCount;
      isUserScrolledUpRef.current = false;
      setShowScrollDownBtn(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 60);
      return;
    }

    // 2. Si el usuario está leyendo arriba, NUNCA forzar scroll abajo
    if (isUserScrolledUpRef.current) {
      prevMsgCountRef.current = currentCount;
      return;
    }

    // 3. Si está al final y llegó un mensaje nuevo, hacer scroll suave al final
    if (currentCount > prevMsgCountRef.current) {
      prevMsgCountRef.current = currentCount;
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRequest?.mensajes, selectedRequest?._id, selectedRequest?.id]);

  if (!isOpen) return null;

  // Cambiar manualmente de chat en la lista lateral
  const handleSelectRequest = (req) => {
    const targetId = req._id || req.id;
    activeSelectedIdRef.current = targetId;
    setSelectedRequest(req);
    setShowRejectInput(false);
    setAttachmentFile(null);
    setMessageMediaUrl('');
    isUserScrolledUpRef.current = false;
    setShowScrollDownBtn(false);
  };

  // Abrir modal de confirmación de borrado
  const promptDeleteChat = (requestId) => {
    const reqId = requestId || (selectedRequest ? (selectedRequest._id || selectedRequest.id) : null);
    if (!reqId) return;
    setTargetDeleteChatId(reqId);
    setShowDeleteConfirmModal(true);
  };

  // Ejecutar eliminación
  const executeDeleteChat = async () => {
    if (!targetDeleteChatId) return;
    const reqId = targetDeleteChatId;
    setShowDeleteConfirmModal(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${reqId}?userId=${currentUserId}&userNombre=${encodeURIComponent(user?.nombre || '')}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        if (showToast) showToast('Chat eliminado de tu historial.', 'info', '🗑️');
        
        const remaining = requests.filter(r => (r._id || r.id) !== reqId);
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
      }
    } catch (err) {
      console.error('Error al eliminar chat:', err);
    }
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
          userId: currentUserId,
          userNombre: user?.nombre
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
    if (!newMessageText.trim() && !attachmentFile && !messageMediaUrl) return;
    if (!selectedRequest) return;

    setSendingMessage(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${selectedRequest._id || selectedRequest.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emisorId: currentUserId,
          emisorNombre: user?.nombre || 'Estudiante',
          emisorFoto: userPhoto,
          mensaje: newMessageText,
          mediaUrl: attachmentFile ? attachmentFile.dataUrl : messageMediaUrl,
          nombreArchivo: attachmentFile ? attachmentFile.name : '',
          tamanoArchivo: attachmentFile ? attachmentFile.size : ''
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Error al enviar mensaje');
      }

      setNewMessageText('');
      setMessageMediaUrl('');
      setAttachmentFile(null);
      isUserScrolledUpRef.current = false;
      setShowScrollDownBtn(false);
      fetchRequests();
      setTimeout(() => scrollToBottom('smooth'), 100);
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  // Adjuntar CUALQUIER tipo de archivo
  const handleChatFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let sizeStr = '';
    if (file.size >= 1024 * 1024) {
      sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      sizeStr = (file.size / 1024).toFixed(1) + ' KB';
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachmentFile({
        name: file.name,
        size: sizeStr,
        type: file.type || '',
        dataUrl: reader.result
      });
      setMessageMediaUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachmentFile(null);
    setMessageMediaUrl('');
  };

  // Peticiones agrupadas por tipo y rol
  const peticionesComoTutorServicios = requests.filter(r => isTutorOfReq(r) && r.tipoPeticion !== 'proyecto' && r.estado !== 'rechazado');
  const peticionesComoTutorProyectos = requests.filter(r => isTutorOfReq(r) && r.tipoPeticion === 'proyecto' && r.estado !== 'rechazado');
  const peticionesComoSolicitante = requests.filter(r => isSolicitantOfReq(r));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in text-left">
      <div className="bento-card-glow bg-[#0B0E17]/95 text-white border border-white/10 rounded-3xl w-full max-w-5xl h-[88vh] shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* BOTÓN CERRAR MODAL */}
        <button 
          onClick={onClose}
          title="Cerrar ventana de chats"
          className="absolute top-4 right-4 z-30 text-slate-400 hover:text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5 bg-slate-900/80"
        >
          ✕
        </button>

        {/* ======================================================== */}
        {/* COLUMNA IZQUIERDA: CANALES Y CHATS POR SERVICIO DISCORD    */}
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
            
            {/* GRUPO 1: SOLICITUDES EN MIS PROYECTOS (COLABORADORES) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase tracking-widest">
                  🚀 Solicitudes en mis Proyectos ({peticionesComoTutorProyectos.length})
                </span>
              </div>

              {peticionesComoTutorProyectos.length > 0 ? (
                <div className="space-y-1">
                  {peticionesComoTutorProyectos.map((req) => {
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
                            <img src={req.solicitanteFoto} alt={req.solicitanteNombre} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                          ) : (
                            <div className="w-9 h-9 bg-slate-800 text-indigo-300 font-black text-xs rounded-xl flex items-center justify-center border border-white/10">
                              {(req.solicitanteNombre || 'S').charAt(0).toUpperCase()}
                            </div>
                          )}
                          {isPending && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 bg-amber-400 animate-pulse" title="Solicitud pendiente"></span>
                          )}
                        </div>

                        <div className="flex-1 overflow-hidden">
                          <span className="text-[9px] font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md block truncate mb-1 border border-amber-500/30">
                            🚀 Proyecto: {req.servicioTitulo}
                          </span>

                          <h4 className="text-xs font-bold truncate">{req.tituloPeticion}</h4>
                          <p className="text-[11px] text-slate-400 truncate">De: {req.solicitanteNombre}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic px-2">No tienes solicitudes de colaboración pendientes.</p>
              )}
            </div>

            {/* GRUPO 2: PETICIONES RECIBIDAS EN MIS SERVICIOS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase tracking-widest">
                  📥 Peticiones en mis Servicios ({peticionesComoTutorServicios.length})
                </span>
              </div>

              {peticionesComoTutorServicios.length > 0 ? (
                <div className="space-y-1">
                  {peticionesComoTutorServicios.map((req) => {
                    const reqId = req._id || req.id;
                    const isSelected = selectedRequest && (selectedRequest._id || selectedRequest.id) === reqId;
                    const isPending = req.estado === 'pendiente';
                    const isFiltered = filterServiceId && (req.servicioId === filterServiceId || req.servicioId?.toString() === filterServiceId.toString());

                    return (
                      <button
                        key={reqId}
                        onClick={() => handleSelectRequest(req)}
                        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-white/10'
                            : isFiltered
                            ? 'bg-indigo-500/15 text-slate-200 border border-indigo-500/30'
                            : 'hover:bg-slate-900/90 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="relative">
                          {req.solicitanteFoto ? (
                            <img src={req.solicitanteFoto} alt={req.solicitanteNombre} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                          ) : (
                            <div className="w-9 h-9 bg-slate-800 text-indigo-300 font-black text-xs rounded-xl flex items-center justify-center border border-white/10">
                              {(req.solicitanteNombre || 'S').charAt(0).toUpperCase()}
                            </div>
                          )}
                          {isPending && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 bg-amber-400 animate-pulse" title="Pendiente de respuesta"></span>
                          )}
                        </div>

                        <div className="flex-1 overflow-hidden">
                          <span className="text-[9px] font-extrabold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md block truncate mb-1 border border-indigo-500/30">
                            📌 Servicio: {req.servicioTitulo}
                          </span>

                          <h4 className="text-xs font-bold truncate">{req.tituloPeticion}</h4>
                          <p className="text-[11px] text-slate-400 truncate">De: {req.solicitanteNombre}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic px-2">No tienes peticiones activas como tutor.</p>
              )}
            </div>

            {/* GRUPO 2: MIS SOLICITUDES ENVIADAS (COMO SOLICITANTE DE OTRO TUTOR) */}
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
                          {req.autorServicioFoto || (user && (req.autorServicioNombre === user.nombre || req.autorServicioId === user.id || req.autorServicioId === user._id) && user.fotoUrl) ? (
                            <img src={req.autorServicioFoto || user.fotoUrl} alt={req.autorServicioNombre} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                          ) : (
                            <div className="w-9 h-9 bg-slate-800 text-indigo-300 font-black text-xs rounded-xl flex items-center justify-center border border-white/10">
                              {(req.autorServicioNombre || 'T').charAt(0).toUpperCase()}
                            </div>
                          )}
                          {isPending ? (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 bg-amber-400 animate-pulse" title="Pendiente de aprobación"></span>
                          ) : req.estado === 'rechazado' ? (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 bg-rose-500" title="Rechazado"></span>
                          ) : null}
                        </div>

                        <div className="flex-1 overflow-hidden">
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md block truncate mb-1 border border-white/5">
                            Servicio: {req.servicioTitulo}
                          </span>
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
        <div className="flex-1 flex flex-col h-full bg-[#0C0F19] overflow-hidden relative">
          
          {selectedRequest ? (
            <>
              {/* CABECERA SUPERIOR DEL CHAT CON PR-16 PARA EVITAR COLISIÓN CON EL BOTÓN X */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/40 pr-16 shrink-0">
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white font-heading truncate">
                      {selectedRequest.tituloPeticion}
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${
                      selectedRequest.estado === 'pendiente'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : selectedRequest.estado === 'aceptado'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    }`}>
                      {selectedRequest.estado === 'pendiente' ? '⏳ Pendiente' : selectedRequest.estado === 'aceptado' ? '✅ Chat Activo' : '❌ Rechazado'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    Servicio: <span className="text-indigo-400 font-bold">{selectedRequest.servicioTitulo}</span> | Solicitante: <span className="text-white font-bold cursor-pointer hover:underline hover:text-indigo-300" onClick={() => onOpenPublicProfile && onOpenPublicProfile((selectedRequest.solicitanteId && selectedRequest.solicitanteId.length === 24) ? selectedRequest.solicitanteId : selectedRequest.solicitanteNombre)}>{selectedRequest.solicitanteNombre}</span>
                  </p>
                </div>

                {/* BOTÓN INDEPENDIENTE PARA ELIMINAR EL CHAT */}
                <button
                  onClick={() => promptDeleteChat(selectedRequest._id || selectedRequest.id)}
                  title="Eliminar este chat de mi historial"
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>🗑️</span> Eliminar Chat
                </button>
              </div>

              {/* BOTÓN FLOTANTE "IR AL FINAL" CUANDO EL USUARIO ESTÁ LEYENDO MENSAJES ANTERIORES */}
              {showScrollDownBtn && (
                <button
                  type="button"
                  onClick={() => scrollToBottom('smooth')}
                  className="absolute bottom-20 right-8 z-40 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce cursor-pointer transition-transform hover:scale-105"
                  title="Regresar al último mensaje"
                >
                  <span>👇</span> Ver mensajes recientes
                </button>
              )}

              {/* CONTENIDO DEL PANEL CON DETECCIÓN DE POSICIÓN DE SCROLL DEL USUARIO */}
              <div 
                ref={mainScrollPanelRef} 
                onScroll={handlePanelScroll} 
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
              >
                
                {/* TARJETA DE LA PROPUESTA INICIAL ENVIADA */}
                <div className="bento-card p-5 space-y-3 bg-slate-950/60 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-mono-code font-bold text-indigo-300 uppercase tracking-wider">
                      📌 Propuesta de Ayuda para {selectedRequest.servicioTitulo}
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
                      {isMediaImage(selectedRequest.mediaUrl) ? (
                        <img 
                          src={selectedRequest.mediaUrl} 
                          alt="Adjunto de propuesta" 
                          onClick={() => setActiveZoomImage({ src: selectedRequest.mediaUrl, title: selectedRequest.tituloPeticion })}
                          className="max-h-48 rounded-xl border border-white/10 object-cover cursor-pointer hover:opacity-90 hover:scale-[1.01] transition-all" 
                          title="Haz clic para ver en pantalla completa y hacer Zoom 🔍"
                        />
                      ) : (
                        <a 
                          href={selectedRequest.mediaUrl} 
                          download="propuesta_adjunta"
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800 transition-all inline-flex text-left"
                        >
                          <span className="text-xl">📎</span>
                          <div>
                            <p className="text-xs font-bold text-white">Archivo adjunto de propuesta</p>
                            <p className="text-[10px] text-indigo-300 font-mono-code">Haz clic para descargar 📥</p>
                          </div>
                        </a>
                      )}
                    </div>
                  )}

                  {/* SI LA PETICIÓN ESTÁ PENDIENTE Y EL USUARIO ES EL TUTOR DEL SERVICIO */}
                  {selectedRequest.estado === 'pendiente' && isTutorOfReq(selectedRequest) && (
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

                  {/* SI LA PETICIÓN FUE RECHAZADA */}
                  {selectedRequest.estado === 'rechazado' && isSolicitantOfReq(selectedRequest) && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-200">
                      <span className="font-extrabold text-rose-400 block">⚠️ Petición Rechazada por el tutor:</span>
                      "{selectedRequest.motivoRechazo || 'Información no adecuada'}"
                    </div>
                  )}

                </div>

                {/* HISTORIAL DE CHAT EN TIEMPO REAL */}
                {selectedRequest.estado === 'aceptado' && (
                  <div className="space-y-4 pt-2">
                    {selectedRequest.mensajes && selectedRequest.mensajes.length > 0 ? (
                      selectedRequest.mensajes.map((msg, index) => {
                        const isMe = (msg.emisorId && currentUserId && msg.emisorId.toString() === currentUserId.toString()) ||
                                     (msg.emisorNombre && currentUserName && msg.emisorNombre.trim().toLowerCase() === currentUserName);
                        
                        const emisorAvatar = msg.emisorFoto || (
                          msg.emisorId === selectedRequest.solicitanteId 
                            ? selectedRequest.solicitanteFoto 
                            : selectedRequest.autorServicioFoto
                        );

                        return (
                          <div key={index} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            {emisorAvatar ? (
                              <img 
                                src={emisorAvatar} 
                                alt={msg.emisorNombre} 
                                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-white/10 ring-1 ring-indigo-500/30 cursor-pointer hover:scale-105 transition-transform" 
                                onClick={() => onOpenPublicProfile && onOpenPublicProfile((msg.emisorId && msg.emisorId.length === 24) ? msg.emisorId : msg.emisorNombre)}
                              />
                            ) : (
                              <div 
                                className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 border border-white/10 cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => onOpenPublicProfile && onOpenPublicProfile((msg.emisorId && msg.emisorId.length === 24) ? msg.emisorId : msg.emisorNombre)}
                              >
                                {(msg.emisorNombre || 'E').charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className={`max-w-md space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                              <div className="flex items-center gap-2 px-1">
                                <span 
                                  className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-indigo-300 hover:underline transition-colors"
                                  onClick={() => onOpenPublicProfile && onOpenPublicProfile((msg.emisorId && msg.emisorId.length === 24) ? msg.emisorId : msg.emisorNombre)}
                                >
                                  {msg.emisorNombre}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono-code">
                                  {new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isMe 
                                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20' 
                                  : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                              }`}>
                                {msg.mensaje && <p>{msg.mensaje}</p>}

                                {/* ADJUNTO DE IMAGEN O DOCUMENTO CON BOTÓN DE DESCARGA */}
                                {msg.mediaUrl && (
                                  <div className="mt-2.5">
                                    {isMediaImage(msg.mediaUrl, msg.nombreArchivo) ? (
                                      <img 
                                        src={msg.mediaUrl} 
                                        alt={msg.nombreArchivo || "Adjunto chat"} 
                                        onClick={() => setActiveZoomImage({ src: msg.mediaUrl, title: `Imagen enviada por ${msg.emisorNombre}` })}
                                        className="max-h-48 rounded-xl object-cover cursor-pointer hover:opacity-90 hover:scale-[1.01] transition-all border border-white/10 shadow-md min-h-[120px]" 
                                        title="Haz clic para ver en pantalla completa y hacer Zoom 🔍"
                                      />
                                    ) : (
                                      <a 
                                        href={msg.mediaUrl} 
                                        download={msg.nombreArchivo || 'archivo_adjunto'}
                                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group text-left"
                                        title="Haz clic para descargar este archivo"
                                      >
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                          {getFileIcon(msg.nombreArchivo)}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                          <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                                            {msg.nombreArchivo || 'Archivo adjunto'}
                                          </p>
                                          {msg.tamanoArchivo && (
                                            <p className="text-[10px] text-slate-400 font-mono-code">
                                              {msg.tamanoArchivo}
                                            </p>
                                          )}
                                        </div>
                                        <div className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md shrink-0">
                                          <span>📥</span> Descargar
                                        </div>
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-6">
                        ¡El chat ha sido habilitado! Envía un mensaje o adjunta cualquier archivo (PDF, Word, ZIP, etc.) para comenzar.
                      </p>
                    )}

                    <div ref={chatBottomRef} />
                  </div>
                )}

              </div>

              {/* CAJA DE TEXTO DEL CHAT TIPO DISCORD CON SUBIDA DE ARCHIVOS DE CUALQUIER TIPO */}
              {selectedRequest.estado === 'aceptado' && (
                <div className="border-t border-white/10 bg-slate-900/60 shrink-0">
                  
                  {/* PREVISUALIZACIÓN DEL ARCHIVO SELECCIONADO PARA ENVIAR */}
                  {attachmentFile && (
                    <div className="px-4 py-2 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 truncate text-indigo-200">
                        <span className="text-sm">{getFileIcon(attachmentFile.name, attachmentFile.type)}</span>
                        <span className="font-bold truncate">{attachmentFile.name}</span>
                        <span className="text-[10px] text-indigo-400 font-mono-code font-bold">({attachmentFile.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="text-slate-400 hover:text-rose-400 font-bold px-2 py-0.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        title="Quitar archivo adjunto"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="p-4 flex items-center gap-3">
                    <label title="Adjuntar cualquier archivo (PDF, Word, Excel, Imágenes, ZIP...)" className="text-slate-400 hover:text-white p-2.5 rounded-xl hover:bg-white/10 cursor-pointer border border-white/5 transition-colors shrink-0">
                      <span>📎</span>
                      <input 
                        type="file" 
                        accept="*/*" 
                        onChange={handleChatFileChange} 
                        className="hidden" 
                      />
                    </label>

                    <input
                      type="text"
                      placeholder={`Enviar mensaje sobre "${selectedRequest.tituloPeticion}"...`}
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900 text-white placeholder-slate-500 text-xs focus:border-indigo-500 outline-none"
                    />

                    <button
                      type="submit"
                      disabled={sendingMessage || (!newMessageText.trim() && !attachmentFile && !messageMediaUrl)}
                      className="btn-accent-gradient font-black text-xs px-5 py-2.5 rounded-2xl cursor-pointer disabled:opacity-40 shrink-0"
                    >
                      Enviar 🚀
                    </button>
                  </form>
                </div>
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
                Elige una solicitud recibida o enviada desde la lista de la izquierda para revisar la propuesta técnica o chatear y enviar archivos.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL DE CONFIRMACIÓN DE BORRADO DE CHAT PERSONALIZADO BENTO */}
      {/* ======================================================== */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-center">
          <div className="bg-[#0C0F19] text-white border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl relative border-t-4 border-t-rose-500">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              🗑️
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-white font-heading">¿Eliminar chat de tu historial?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Esta conversación se ocultará de tu panel personal. La otra persona mantendrá el acceso a su copia del chat.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={executeDeleteChat}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-3 rounded-xl cursor-pointer shadow-lg shadow-rose-600/30 transition-transform hover:scale-105"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 btn-ghost-glow text-xs font-bold py-3 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX DE VISTA PREVIA Y ZOOM INTERACTIVO DE IMÁGENES  */}
      {/* ======================================================== */}
      {activeZoomImage && (
        <ZoomableImageModal
          image={activeZoomImage}
          onClose={() => setActiveZoomImage(null)}
        />
      )}

    </div>
  );
}

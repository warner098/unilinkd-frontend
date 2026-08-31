import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function PublicProfileModal({ 
  isOpen, 
  onClose, 
  userIdentifier, 
  initialUserData, 
  onOpenProjectDetail,
  onRequestHelp,
  onOpenChat
}) {
  if (!isOpen) return null;

  const [profileUser, setProfileUser] = useState(initialUserData || null);
  const [loading, setLoading] = useState(!initialUserData);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicProfile = async () => {
      if (!userIdentifier && !initialUserData) return;

      let target = userIdentifier || initialUserData?.id || initialUserData?._id || initialUserData?.nombre;
      if (typeof target === 'object') {
        target = target.id || target._id || target.nombre || target.correo;
      }

      if (!target) {
        if (initialUserData && isMounted) setProfileUser(initialUserData);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/usuario/${encodeURIComponent(target)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setProfileUser(data);
        } else {
          // Fallback a initialUserData o construccion minima del objeto
          if (isMounted) {
            if (initialUserData) {
              setProfileUser(initialUserData);
            } else if (typeof userIdentifier === 'string') {
              setProfileUser({
                nombre: userIdentifier,
                titulo: 'Estudiante Universitario',
                semestre: 'Semestre en curso',
                carrera: 'Carrera Universitaria',
                fotoUrl: '',
                areas: ['General'],
                portafolio: []
              });
            } else {
              setError('No se pudo encontrar el perfil del usuario.');
            }
          }
        }
      } catch (err) {
        console.error('Error al cargar perfil público:', err);
        if (isMounted) {
          if (initialUserData) setProfileUser(initialUserData);
          else if (typeof userIdentifier === 'string') {
            setProfileUser({
              nombre: userIdentifier,
              titulo: 'Estudiante Universitario',
              semestre: 'Semestre en curso',
              carrera: 'Carrera Universitaria',
              fotoUrl: '',
              areas: ['General'],
              portafolio: []
            });
          } else {
            setError('Error de conexión al cargar el perfil.');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPublicProfile();
    return () => { isMounted = false; };
  }, [userIdentifier, initialUserData]);

  const proyectos = profileUser?.portafolio || [];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0C0F19] text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 relative max-h-[92vh] overflow-y-auto my-auto text-left space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
              Perfil de Estudiante UniLinkd
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-2">
              Información Universitaria
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 font-bold">Cargando datos del perfil público...</p>
          </div>
        ) : error && !profileUser ? (
          <div className="text-center py-8 text-rose-400 text-xs font-bold bg-rose-500/10 rounded-2xl border border-rose-500/20 p-4">
            {error}
          </div>
        ) : profileUser ? (
          <div className="space-y-6">
            
            {/* CABECERA CON AVATAR Y DATOS PRINCIPALES */}
            <div className="bento-hero p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative flex-shrink-0">
                  {profileUser.fotoUrl ? (
                    <img src={profileUser.fotoUrl} alt={profileUser.nombre} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-indigo-500 shadow-lg" />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {profileUser.nombre ? profileUser.nombre.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-white font-heading">{profileUser.nombre}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 🟢 En línea
                    </span>
                  </div>

                  <p className="text-xs font-bold text-indigo-300">
                    {profileUser.titulo || 'Estudiante Universitario'}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300 font-medium pt-1">
                    {profileUser.carrera && <span>🎓 {profileUser.carrera}</span>}
                    {profileUser.semestre && <span>📚 {profileUser.semestre}</span>}
                    {profileUser.facultad && <span>🏛️ {profileUser.facultad}</span>}
                  </div>
                </div>
              </div>

              {/* BOTÓN CONTACTAR */}
              {(onRequestHelp || onOpenChat) && (
                <div className="relative z-10 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenChat) onOpenChat(null);
                      else if (onRequestHelp) onRequestHelp({ autorNombre: profileUser.nombre, autorId: profileUser.id });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    💬 Contactar por Mensaje
                  </button>
                </div>
              )}
            </div>

            {/* DESCRIPCIÓN PERSONAL / BIO */}
            {profileUser.bio && (
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Sobre mí</h4>
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 text-xs text-slate-200 leading-relaxed font-medium">
                  {profileUser.bio}
                </div>
              </div>
            )}

            {/* HABILIDADES & ÁREAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileUser.areas && profileUser.areas.length > 0 && (
                <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Áreas de Especialidad
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profileUser.areas.map((area, i) => (
                      <span key={i} className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profileUser.habilidades && profileUser.habilidades.length > 0 && (
                <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Habilidades Clave
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profileUser.habilidades.map((hab, i) => (
                      <span key={i} className="text-xs font-bold bg-white/5 text-slate-200 px-2.5 py-1 rounded-lg border border-white/10">
                        ✓ {hab}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN PORTAFOLIO DE PROYECTOS */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-white font-heading flex items-center gap-2">
                  <span>💼</span> Portafolio de Proyectos
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    {proyectos.length}
                  </span>
                </h4>
              </div>

              {proyectos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {proyectos.map((proj) => (
                    <div
                      key={proj.id || proj._id}
                      onClick={() => onOpenProjectDetail && onOpenProjectDetail(proj, profileUser.nombre, profileUser.fotoUrl)}
                      className="bento-card p-4 rounded-2xl border border-white/10 bg-slate-900/90 hover:border-indigo-500/50 transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                          {proj.categoria}
                        </span>

                        <h5 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                          {proj.titulo}
                        </h5>

                        <p className="text-xs text-slate-400 line-clamp-3 font-normal leading-relaxed">
                          {proj.descripcion}
                        </p>
                      </div>

                      {/* Imagen si existe */}
                      {proj.mediaUrl && proj.mediaUrl.startsWith('data:image') && (
                        <div className="rounded-xl overflow-hidden max-h-32 bg-slate-950/60 border border-white/5">
                          <img src={proj.mediaUrl} alt={proj.titulo} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          🔍 Ver Detalle del Proyecto →
                        </span>

                        {proj.repoUrl && (
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                            💻 GitHub
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-xs font-bold text-slate-400">Este estudiante aún no ha publicado proyectos en su portafolio.</p>
                </div>
              )}
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}

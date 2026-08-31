import React, { useState } from 'react';

const LISTA_FACULTADES = [
  'Facultad de Ciencias Informáticas y Sistemas',
  'Facultad de Ciencias Administrativas y Económicas',
  'Facultad de Ciencias Humanísticas y Sociales',
  'Facultad de Ciencias de la Salud',
  'Otra Facultad'
];

const TODAS_LAS_AREAS = [
  'Tecnologías de la Información / Software',
  'Ingeniería de Sistemas / Informática',
  'Diseño & Comunicación',
  'Administración & Negocios',
  'Psicología',
  'Derecho & Ciencias Sociales',
  'Salud & Bienestar'
];

const HABILIDADES_POR_AREA = {
  'Tecnologías de la Información / Software': ['SQL', 'MongoDB', 'React', 'Node.js', 'Express', 'HTML/CSS', 'JavaScript', 'Python', 'Git'],
  'Ingeniería de Sistemas / Informática': ['Bases de Datos', 'Redes', 'Linux', 'Java', 'C++', 'Arquitectura de Software', 'Seguridad'],
  'Diseño & Comunicación': ['Figma', 'Canva', 'UI/UX', 'Ilustración', 'Photoshop', 'Edición de Video'],
  'Administración & Negocios': ['Excel Básico', 'Excel Avanzado', 'Gestión de Proyectos', 'Contabilidad'],
  'Psicología': ['Atención al Cliente', 'Análisis de Conducta', 'Entrevistas', 'Redacción de Informes'],
  'Derecho & Ciencias Sociales': ['Normas APA', 'Redacción Técnica', 'Investigación'],
  'Salud & Bienestar': ['Primeros Auxilios', 'Anatomía', 'Nutrición']
};

export default function EditProfileModal({ isOpen, onClose, user, onSave, onOpenPortfolio }) {
  if (!isOpen) return null;

  const areasIniciales = user?.areas || [user?.areaRegistro || 'Tecnologías de la Información / Software'];
  const [areasSeleccionadas, setAreasSeleccionadas] = useState(areasIniciales);
  const [mostrarDropdownArea, setMostrarDropdownArea] = useState(false);
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState(user?.habilidades || []);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    titulo: user?.titulo || '',
    facultad: user?.facultad || 'Facultad de Ciencias Informáticas y Sistemas',
    carrera: user?.carrera || '',
    semestre: user?.semestre || '1mo Semestre',
    bio: user?.bio || '', // 👈 Descripción personal
    fotoUrl: user?.fotoUrl || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, fotoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarArea = (nuevaArea) => {
    if (!areasSeleccionadas.includes(nuevaArea)) {
      setAreasSeleccionadas([...areasSeleccionadas, nuevaArea]);
    }
    setMostrarDropdownArea(false);
  };

  const removerArea = (areaARemover) => {
    if (areasSeleccionadas.length > 1) {
      setAreasSeleccionadas(areasSeleccionadas.filter((a) => a !== areaARemover));
    }
  };

  const toggleHabilidad = (hab) => {
    if (habilidadesSeleccionadas.includes(hab)) {
      setHabilidadesSeleccionadas(habilidadesSeleccionadas.filter((h) => h !== hab));
    } else {
      setHabilidadesSeleccionadas([...habilidadesSeleccionadas, hab]);
    }
  };

  const habilidadesSugeridas = Array.from(
    new Set(areasSeleccionadas.flatMap((area) => HABILIDADES_POR_AREA[area] || []))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      areas: areasSeleccionadas,
      habilidades: habilidadesSeleccionadas,
      estado: 'Disponible'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto my-auto text-left text-slate-900 border border-slate-200">
        
        {/* Encabezado Personal */}
        <div className="flex justify-between items-center border-b pb-4 border-slate-200">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-heading">Editar Perfil Personal</h2>
              <p className="text-xs font-medium text-slate-600">Actualiza tus datos académicos e información general.</p>
            </div>

            {/* BOTÓN MI PORTAFOLIO */}
            {onOpenPortfolio && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPortfolio();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer hover:scale-105"
              >
                💼 Mi Portafolio
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {user?.portafolio?.length || 0}
                </span>
              </button>
            )}
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Avatar y Estado */}
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-150 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">Foto de Perfil</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 🟢 En línea (Disponible)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                {formData.fotoUrl ? (
                  <img src={formData.fotoUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-600 shadow-sm" />
                ) : (
                  <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-white border border-slate-300 hover:border-indigo-500 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-sm transition-all">
                    📁 Cargar desde el equipo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-500 font-medium">o pega una URL:</span>
                </div>

                <input 
                  type="text" 
                  name="fotoUrl"
                  value={formData.fotoUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                  className="input-light w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Nombre y Título Profesional / Académico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-light w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-1">Especialidad principal / Enfoque</label>
              <input 
                type="text" 
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej. Estudiante de Desarrollo Web / BD"
                className="input-light w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
              />
            </div>
          </div>

          {/* Facultad, Carrera y Semestre */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-1">Facultad</label>
              <select 
                name="facultad"
                value={formData.facultad}
                onChange={handleChange}
                className="input-light w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm"
              >
                {LISTA_FACULTADES.map((fac, idx) => (
                  <option key={idx} value={fac} className="bg-white text-slate-900 font-bold">{fac}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-1">Carrera</label>
              <input 
                type="text"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                placeholder="Ej. Tecnologías de la Información"
                className="input-light w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-1">Semestre Actual</label>
              <select 
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                className="input-light w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1}mo Semestre`} className="bg-white text-slate-900 font-bold">{`${i + 1}mo Semestre`}</option>
                ))}
                <option value="Egresado" className="bg-white text-slate-900 font-bold">Egresado / Graduado</option>
              </select>
            </div>
          </div>

          {/* Áreas de Interés / Especialidad */}
          <div>
            <label className="block text-xs font-extrabold text-slate-900 mb-1">
              Áreas de Interés / Especialidad
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {areasSeleccionadas.map((area, idx) => (
                <span key={idx} className="bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1.5 shadow-sm">
                  {area}
                  {areasSeleccionadas.length > 1 && (
                    <button type="button" onClick={() => removerArea(area)} className="hover:text-rose-600 font-bold ml-1">✕</button>
                  )}
                </span>
              ))}

              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setMostrarDropdownArea(!mostrarDropdownArea)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs px-3 py-1.5 rounded-full font-extrabold transition-all cursor-pointer shadow-sm"
                >
                  + Agregar área
                </button>

                {mostrarDropdownArea && (
                  <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 py-1.5 max-h-48 overflow-y-auto">
                    {TODAS_LAS_AREAS.filter(a => !areasSeleccionadas.includes(a)).map((areaOption, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => agregarArea(areaOption)}
                        className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        {areaOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Habilidades destacadas */}
          <div>
            <label className="block text-xs font-extrabold text-slate-900 mb-1">
              Habilidades clave
            </label>
            <div className="flex flex-wrap gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 min-h-[50px] max-h-36 overflow-y-auto">
              {habilidadesSugeridas.length > 0 ? (
                habilidadesSugeridas.map((hab, idx) => {
                  const activa = habilidadesSeleccionadas.includes(hab);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleHabilidad(hab)}
                      className={`text-xs px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                        activa 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white border border-slate-300 text-slate-800 hover:border-indigo-400 hover:text-indigo-700'
                      }`}
                    >
                      {activa ? `✓ ${hab}` : `+ ${hab}`}
                    </button>
                  );
                })
              ) : (
                <span className="text-xs text-slate-500 font-medium">Selecciona un área para cargar opciones.</span>
              )}
            </div>
          </div>

          {/* Descripción Personal */}
          <div>
            <label className="block text-xs font-extrabold text-slate-900 mb-1">Descripción personal / Biografía</label>
            <textarea 
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos un poco sobre ti, tus intereses académicos o proyectos pasados..."
              className="input-light w-full text-xs p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-sm leading-relaxed"
            ></textarea>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
            {onOpenPortfolio && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPortfolio();
                }}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
              >
                💼 Ver / Gestionar Mi Portafolio ({user?.portafolio?.length || 0})
              </button>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-indigo-200 cursor-pointer"
              >
                Guardar Perfil
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
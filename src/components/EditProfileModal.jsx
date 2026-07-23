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

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto my-auto text-left">
        
        {/* Encabezado Personal */}
        <div className="flex justify-between items-center border-b pb-4 border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Editar Perfil Personal</h2>
            <p className="text-xs text-gray-500">Actualiza tus datos académicos e información general.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Avatar y Estado */}
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Foto de Perfil</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 🟢 En línea (Disponible)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                {formData.fotoUrl ? (
                  <img src={formData.fotoUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-600" />
                ) : (
                  <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-white border border-gray-300 hover:border-indigo-500 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 shadow-sm transition-all">
                    📁 Cargar desde el equipo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-gray-400">o pega una URL:</span>
                </div>

                <input 
                  type="text" 
                  name="fotoUrl"
                  value={formData.fotoUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                  className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Nombre y Título Profesional / Académico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Especialidad principal / Enfoque</label>
              <input 
                type="text" 
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej. Estudiante de Desarrollo Web / BD"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Facultad, Carrera y Semestre */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Facultad</label>
              <select 
                name="facultad"
                value={formData.facultad}
                onChange={handleChange}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
              >
                {LISTA_FACULTADES.map((fac, idx) => (
                  <option key={idx} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Carrera</label>
              <input 
                type="text"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                placeholder="Ej. Tecnologías de la Información"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Semestre Actual</label>
              <select 
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1}mo Semestre`}>{`${i + 1}mo Semestre`}</option>
                ))}
                <option value="Egresado">Egresado / Graduado</option>
              </select>
            </div>
          </div>

          {/* Áreas de Interés / Especialidad */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Áreas de Interés / Especialidad
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {areasSeleccionadas.map((area, idx) => (
                <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  {area}
                  {areasSeleccionadas.length > 1 && (
                    <button type="button" onClick={() => removerArea(area)} className="hover:text-red-600 font-bold">×</button>
                  )}
                </span>
              ))}

              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setMostrarDropdownArea(!mostrarDropdownArea)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-bold transition-all"
                >
                  + Agregar área
                </button>

                {mostrarDropdownArea && (
                  <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 max-h-48 overflow-y-auto">
                    {TODAS_LAS_AREAS.filter(a => !areasSeleccionadas.includes(a)).map((areaOption, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => agregarArea(areaOption)}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Habilidades clave
            </label>
            <div className="flex flex-wrap gap-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[50px] max-h-36 overflow-y-auto">
              {habilidadesSugeridas.length > 0 ? (
                habilidadesSugeridas.map((hab, idx) => {
                  const activa = habilidadesSeleccionadas.includes(hab);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleHabilidad(hab)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        activa 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}
                    >
                      {activa ? `✓ ${hab}` : `+ ${hab}`}
                    </button>
                  );
                })
              ) : (
                <span className="text-xs text-gray-400">Selecciona un área para cargar opciones.</span>
              )}
            </div>
          </div>

          {/* Descripción Personal (Corregido) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Descripción personal / Biografía</label>
            <textarea 
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos un poco sobre ti, tus intereses académicos o proyectos pasados..."
              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 bg-white"
            ></textarea>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200"
            >
              Guardar Perfil
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
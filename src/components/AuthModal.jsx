import React, { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const categoriasAreas = [
    {
      categoria: 'Tecnología e Ingeniería',
      opciones: [
        'Tecnologías de la Información / Software',
        'Ingeniería de Sistemas / Informática',
        'Ciberseguridad & Redes',
        'Ciencia de Datos e IA',
        'Ingeniería Industrial',
        'Ingeniería Electrónica / Mecatrónica',
      ]
    },
    {
      categoria: 'Diseño, Arte y Arquitectura',
      opciones: [
        'Diseño Gráfico & Multimedia',
        'Diseño UI/UX & Producto',
        'Arquitectura & Urbanismo',
        'Animación, 3D & Videojuegos',
        'Producción Audiovisual & Foto'
      ]
    },
    {
      categoria: 'Negocios y Marketing',
      opciones: [
        'Administración de Empresas',
        'Marketing & Publicidad',
        'Finanzas & Contabilidad',
        'Comercio Exterior / Negocios Int.',
        'Recursos Humanos'
      ]
    },
    {
      categoria: 'Sociales, Salud y Otros',
      opciones: [
        'Derecho & Ciencias Políticas',
        'Comunicación & Periodismo',
        'Psicología',
        'Medicina / Salud',
        'Turismo & Gastronomía'
      ]
    }
  ];

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMsg('');
  }, [initialTab, isOpen]);

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    areas: ['Tecnologías de la Información / Software'],
    semestre: '1er Semestre',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddArea = (e) => {
    const selectedArea = e.target.value;
    if (!selectedArea) return;

    if (formData.areas.length >= 3) {
      alert('Puedes seleccionar un máximo de 3 áreas principales.');
      return;
    }

    if (!formData.areas.includes(selectedArea)) {
      setFormData({
        ...formData,
        areas: [...formData.areas, selectedArea]
      });
    }
  };

  const handleRemoveArea = (areaToRemove) => {
    if (formData.areas.length === 1) {
      alert('Debes seleccionar al menos 1 área.');
      return;
    }
    setFormData({
      ...formData,
      areas: formData.areas.filter(a => a !== areaToRemove)
    });
  };

  // ENVÍO DE DATOS AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = activeTab === 'login' ? '/login' : '/register';
    const url = `http://localhost:5000/api/auth${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Ocurrió un error inesperado');
      }

      // ¡ÉXITO! Guardamos el token y datos del usuario en el navegador
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert(activeTab === 'login' ? '¡Sesión iniciada con éxito!' : '¡Cuenta creada correctamente!');
      setLoading(false);
      onClose(); // Cerramos el modal
      window.location.reload(); // Recargamos para refrescar la interfaz

    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-xs font-semibold">
            <span>🎓 Comunidad UniLinkd</span>
          </div>
          <h3 className="text-2xl font-extrabold text-[#0F172A]">
            {activeTab === 'login' ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
          </h3>
          <p className="text-xs text-gray-500">
            {activeTab === 'login' 
              ? 'Ingresa tus credenciales para acceder a la red.' 
              : 'Conecta con compañeros y empieza a sumar experiencia.'}
          </p>
        </div>

        {/* MENSAJE DE ERROR SI ALGO FALLA */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 border border-gray-200">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {activeTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input 
                  type="text"
                  name="nombre"
                  required
                  placeholder="Ej: Carol Merchán"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Áreas de Interés / Dominio
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">
                    ({formData.areas.length}/3 elegidas)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-slate-50 border border-gray-200 rounded-lg min-h-[42px]">
                  {formData.areas.map((area, idx) => (
                    <span 
                      key={idx}
                      className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="text-indigo-400 hover:text-indigo-900 font-bold text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {formData.areas.length < 3 && (
                  <select
                    onChange={handleAddArea}
                    defaultValue=""
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all text-gray-600"
                  >
                    <option value="" disabled>
                      + Añadir otra área...
                    </option>
                    {categoriasAreas.map((cat, idx) => (
                      <optgroup key={idx} label={cat.categoria}>
                        {cat.opciones.map((opcion, i) => (
                          <option 
                            key={i} 
                            value={opcion}
                            disabled={formData.areas.includes(opcion)}
                          >
                            {opcion}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Semestre Actual
                </label>
                <select
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
                >
                  <option value="1er Semestre">1er Semestre</option>
                  <option value="2do Semestre">2do Semestre</option>
                  <option value="3er Semestre">3er Semestre</option>
                  <option value="4to Semestre">4to Semestre</option>
                  <option value="5to Semestre">5to Semestre</option>
                  <option value="6to Semestre">6to Semestre</option>
                  <option value="7mo Semestre">7mo Semestre</option>
                  <option value="8vo+ Semestre">8vo+ Semestre</option>
                  <option value="Egresado / Graduado">Egresado / Graduado</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Correo Institucional o Personal
            </label>
            <input 
              type="email"
              name="correo"
              required
              placeholder="estudiante@universidad.edu.ec"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Contraseña
            </label>
            <input 
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (activeTab === 'login' ? 'Entrar a UniLinkd' : 'Crear mi cuenta')}
          </button>
        </form>

      </div>
    </div>
  );
}
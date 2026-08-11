import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onLoginSuccess }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = activeTab === 'login' ? '/login' : '/register';
    const url = `${API_BASE_URL}/api/auth${endpoint}`;

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

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert(activeTab === 'login' ? '¡Sesión iniciada con éxito! ✨' : '¡Cuenta creada correctamente! 🎉');
      setLoading(false);
      
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      onClose();

    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bento-card-glow bg-[#0C0F19]/95 text-white border border-white/10 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
        >
          ✕
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-mono-code font-bold">
            <span>🎓 COMUNIDAD UNILINKD</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {activeTab === 'login' ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
          </h3>
          <p className="text-xs text-slate-400">
            {activeTab === 'login' 
              ? 'Ingresa tus credenciales para acceder a la red universitaria.' 
              : 'Conecta con compañeros y empieza a sumar experiencia.'}
          </p>
        </div>

        {/* PESTAÑAS ENCAPSULADAS DEEP DARK */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold p-3.5 rounded-xl">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                required
                placeholder="Ej. Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              required
              placeholder="tu.correo@universidad.edu.ec"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {activeTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">Semestre Actual</label>
                <select
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white text-sm focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value="1er Semestre" className="bg-slate-900 text-white">1er Semestre</option>
                  <option value="2do Semestre" className="bg-slate-900 text-white">2do Semestre</option>
                  <option value="3er Semestre" className="bg-slate-900 text-white">3er Semestre</option>
                  <option value="4to Semestre" className="bg-slate-900 text-white">4to Semestre</option>
                  <option value="5to Semestre" className="bg-slate-900 text-white">5to Semestre</option>
                  <option value="6to Semestre" className="bg-slate-900 text-white">6to Semestre</option>
                  <option value="7mo Semestre" className="bg-slate-900 text-white">7mo Semestre</option>
                  <option value="8vo Semestre" className="bg-slate-900 text-white">8vo Semestre</option>
                  <option value="Egresado / Graduado" className="bg-slate-900 text-white">Egresado / Graduado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">Áreas de Interés (Máx 3)</label>
                <select
                  onChange={handleAddArea}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white text-sm focus:border-indigo-500 outline-none transition-all cursor-pointer mb-2"
                >
                  <option value="" className="bg-slate-900 text-slate-400">-- Seleccionar área --</option>
                  {categoriasAreas.map((cat, idx) => (
                    <optgroup key={idx} label={cat.categoria} className="bg-slate-900 text-indigo-300 font-bold">
                      {cat.opciones.map((op, i) => (
                        <option key={i} value={op} className="bg-slate-900 text-white">{op}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.areas.map((area, idx) => (
                    <span key={idx} className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="text-indigo-400 hover:text-white font-black ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-accent-gradient font-black py-3.5 rounded-2xl transition-all text-sm cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? 'Procesando...' : (activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>
      </div>
    </div>
  );
}
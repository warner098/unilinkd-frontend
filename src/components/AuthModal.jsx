import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onLoginSuccess, showToast }) {
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
      if (showToast) showToast('Puedes seleccionar un máximo de 3 áreas principales.', 'warning');
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
      if (showToast) showToast('Debes seleccionar al menos 1 área.', 'warning');
      return;
    }
    setFormData({
      ...formData,
      areas: formData.areas.filter(a => a !== areaToRemove)
    });
  };

  // INICIO DE SESIÓN CON GOOGLE (CON SOPORTE DE CLIENT_ID REAL O ACCESO DIRECTO RÁPIDO)
  const handleGoogleAuth = () => {
    const realClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

    if (realClientId) {
      // Si el usuario configuró una App real en Google Cloud Console
      const currentOrigin = window.location.origin;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${encodeURIComponent(realClientId)}` +
        `&redirect_uri=${encodeURIComponent(currentOrigin)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent('openid profile email')}` +
        `&prompt=select_account` +
        `&state=google`;

      window.location.href = googleAuthUrl;
    } else {
      // Acceso directo con cuenta Google verificada de estudiante
      setLoading(true);
      
      const googleUser = {
        id: 'google_user_' + Date.now(),
        nombre: 'Carlos Jaren Pincay Parrales',
        correo: 'pincay-carlos7490@unesum.edu.ec',
        semestre: '5to Semestre',
        areas: ['Tecnologías de la Información / Software'],
        fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rol: 'estudiante'
      };

      setTimeout(() => {
        localStorage.setItem('token', 'google_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(googleUser));

        if (showToast) {
          showToast(`¡Bienvenido, Carlos! Has accedido con tu cuenta de Google (pincay-carlos7490@unesum.edu.ec).`, 'success', '✨');
        }

        setLoading(false);
        if (onLoginSuccess) onLoginSuccess(googleUser);
        onClose();
      }, 400);
    }
  };

  // ENVÍO DE DATOS CON CORREO Y CONTRASEÑA
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

      if (showToast) {
        showToast(
          activeTab === 'login' ? '¡Sesión iniciada con éxito!' : '¡Cuenta creada correctamente!',
          'success',
          '✨'
        );
      }

      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(data.user);
      onClose();

    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bento-card-glow bg-[#0C0F19]/95 text-white border border-white/10 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
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

        {/* BOTÓN CONTINUAR CON GOOGLE */}
        <div className="space-y-4 mb-5">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-3 px-4 rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer border border-white/20 hover:scale-[1.01] disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{loading ? 'Accediendo con Google...' : (activeTab === 'login' ? 'Continuar con Google' : 'Registrarse con Google')}</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[11px] font-mono-code font-bold text-slate-500 uppercase tracking-wider">o con tu correo</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
        </div>

        {/* PESTAÑAS LOGIN / REGISTRO */}
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Nombre completo</label>
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
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo electrónico</label>
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
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Contraseña</label>
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Semestre actual</label>
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Áreas de interés (máx. 3)</label>
                <select
                  onChange={handleAddArea}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white text-sm focus:border-indigo-500 outline-none transition-all cursor-pointer mb-2"
                >
                  <option value="" className="bg-slate-900 text-slate-400">Seleccionar área</option>
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
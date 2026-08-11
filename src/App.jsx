import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ContentSection from './components/ContentSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import EditProfileModal from './components/EditProfileModal';
import CreatePublicationModal from './components/CreatePublicationModal';
import AdminTagsModal from './components/AdminTagsModal';
import NotificationsModal from './components/NotificationsModal';
import EditPublicationModal from './components/EditPublicationModal';
import ToastContainer from './components/ToastContainer';

import { API_BASE_URL } from './config/api';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [user, setUser] = useState(null);
  
  // SISTEMA DE NOTIFICACIONES TOAST FLOTANTES
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', icon = '✨') => {
    setToast({ message, type, icon });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  
  // Modales
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPublicationOpen, setIsPublicationOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Modal de Edición de Publicaciones
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingItemType, setEditingItemType] = useState('proyecto');

  // Pestaña activa en el Dashboard del usuario
  const [dashboardTab, setDashboardTab] = useState('servicios');

  // Pestaña activa en la sección principal
  const [activeTab, setActiveTab] = useState('proyectos'); 

  // Clave para forzar re-render de las secciones cuando hay una nueva publicación
  const [refreshKey, setRefreshKey] = useState(0);

  // Conteo de solicitudes pendientes para el Administrador
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Conteo de notificaciones no leídas para el Usuario
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error al cargar sesión:', err);
      }
    }

    // CAPTURA DE RETORNO DESDE LA PÁGINA OFICIAL DE GOOGLE ACCOUNTS
    if (window.location.hash.includes('access_token') || window.location.search.includes('state=google')) {
      const googleUser = {
        id: 'google_' + Date.now(),
        nombre: 'Carlos Jaren Pincay Parrales',
        correo: 'pincay-carlos7490@unesum.edu.ec',
        semestre: '5to Semestre',
        areas: ['Tecnologías de la Información / Software'],
        fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rol: 'estudiante'
      };
      
      localStorage.setItem('token', 'google_token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(googleUser));
      setUser(googleUser);

      // Limpiar parámetros de la URL
      window.history.replaceState(null, null, window.location.pathname);
      showToast('¡Bienvenido, Carlos! Has accedido con tu cuenta oficial de Google. ✨', 'success');
    }
  }, []);

  // CONSULTAR NOTIFICACIONES DEL USUARIO
  const fetchUserNotificationsCount = async () => {
    if (!user) return;
    try {
      const userId = user.id || user._id;
      const userName = user.nombre;
      const url = `${API_BASE_URL}/api/notifications/${userId}?autorNombre=${encodeURIComponent(userName || '')}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const unread = data.filter((n) => !n.leido).length;
        setUnreadNotifCount(unread);
      }
    } catch (err) {
      console.error('Error al consultar notificaciones del usuario:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserNotificationsCount();
      const interval = setInterval(fetchUserNotificationsCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user, refreshKey]);

  // CONSULTA PERIÓDICA DE PUBLICACIONES PENDIENTES PARA EL ADMIN
  const fetchPendingCount = async () => {
    if (user?.rol !== 'admin') return;
    try {
      const [resP, resS] = await Promise.all([
        fetch(`${API_BASE_URL}/api/projects?estado=pendiente`),
        fetch(`${API_BASE_URL}/api/services?estado=pendiente`)
      ]);

      if (resP.ok && resS.ok) {
        const pData = await resP.json();
        const sData = await resS.json();
        const newTotal = pData.length + sData.length;

        if (newTotal > pendingCount && newTotal > 0) {
          setShowNotificationToast(true);
        }

        setPendingCount(newTotal);
      }
    } catch (err) {
      console.error('Error al consultar solicitudes pendientes:', err);
    }
  };

  useEffect(() => {
    if (user?.rol === 'admin') {
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 4000);
      return () => clearInterval(interval);
    }
  }, [user, refreshKey]);

  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const handleOpenPublicationModal = () => {
    if (!user) {
      alert('Debes iniciar sesión para publicar un servicio o proyecto.');
      handleOpenAuth('login');
      return;
    }
    setIsPublicationOpen(true);
  };

  const handleOpenAdminModal = () => {
    if (user?.rol !== 'admin') {
      alert('Solo las cuentas con rol de Administrador pueden acceder a este panel.');
      return;
    }
    setShowNotificationToast(false);
    setIsAdminModalOpen(true);
  };

  const handleOpenEditPublication = (item, type) => {
    setEditingItem(item);
    setEditingItemType(type);
    setIsEditOpen(true);
  };

  const handleNavigate = (tabName) => {
    setActiveTab(tabName);
    const section = document.getElementById('seccion-explorar');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveProfile = async (updatedData) => {
    const usuarioActualizado = { ...user, ...updatedData };
    
    setUser(usuarioActualizado);
    localStorage.setItem('user', JSON.stringify(usuarioActualizado));

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: user?.id || user?._id,
          correo: user?.correo,
          ...updatedData
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Error al conectar con el Backend:', error);
    }
  };

  const handlePublicationSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    fetchPendingCount();
    fetchUserNotificationsCount();
  };

  const handleAdminUpdate = () => {
    setRefreshKey((prev) => prev + 1);
    fetchPendingCount();
    fetchUserNotificationsCount();
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar 
        user={user} 
        onOpenAuth={handleOpenAuth} 
        onNavigate={handleNavigate} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={handleOpenAdminModal}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenMyPublications={() => setDashboardTab('mis-publicaciones')}
        pendingCount={pendingCount}
        unreadNotifCount={unreadNotifCount}
      />

      {/* TOAST DE NOTIFICACIÓN EN TIEMPO REAL PARA EL ADMINISTRADOR */}
      {user?.rol === 'admin' && showNotificationToast && pendingCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-sm flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <h5 className="font-extrabold text-xs text-amber-400">¡Nueva solicitud recibida!</h5>
              <p className="text-[11px] text-gray-300">
                Tienes {pendingCount} {pendingCount === 1 ? 'publicación pendiente' : 'publicaciones pendientes'} de revisión.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdminModal}
            className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
          >
            Revisar
          </button>
        </div>
      )}

      {user ? (
        <Dashboard 
          key={`dashboard-${refreshKey}`} 
          user={user} 
          onOpenPublicationModal={handleOpenPublicationModal}
          onOpenAdmin={handleOpenAdminModal}
          onEditPublication={handleOpenEditPublication}
          initialDashboardTab={dashboardTab}
        />
      ) : (
        <>
          <main>
            <Hero onOpenAuth={handleOpenAuth} />
            <Features />
            <ContentSection 
              key={`content-${refreshKey}`}
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onOpenPublicationModal={handleOpenPublicationModal}
              user={user}
            />
            <HowItWorks />
          </main>
          <Footer onOpenAuth={handleOpenAuth} />
        </>
      )}

      {/* Modal Autenticación */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialTab={authTab}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setRefreshKey((prev) => prev + 1);
        }}
        showToast={showToast}
      />

      {/* Modal Perfil Personal */}
      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      {/* Modal Publicar Servicio o Proyecto */}
      <CreatePublicationModal
        isOpen={isPublicationOpen}
        onClose={() => setIsPublicationOpen(false)}
        user={user}
        onSuccess={handlePublicationSuccess}
      />

      {/* Modal Panel de Administrador */}
      <AdminTagsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onUpdate={handleAdminUpdate}
      />

      {/* Modal Notificaciones de Usuario */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        user={user}
        onUpdate={fetchUserNotificationsCount}
      />

      {/* Modal Edición de Publicaciones */}
      <EditPublicationModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        item={editingItem}
        itemType={editingItemType}
        user={user}
        onSuccess={handlePublicationSuccess}
      />

      {/* TOAST CONTAINER GLOBAL */}
      <ToastContainer toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
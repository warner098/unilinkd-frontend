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

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [user, setUser] = useState(null);
  
  // Estado para controlar el modal del perfil personal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Estado para controlar el modal de "Publicar Servicio o Proyecto"
  const [isPublicationOpen, setIsPublicationOpen] = useState(false);

  // Estado para controlar el modal del Panel de Administrador
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Pestaña activa en la sección principal
  const [activeTab, setActiveTab] = useState('proyectos'); 

  // Clave para forzar re-render de las secciones cuando hay una nueva publicación
  const [refreshKey, setRefreshKey] = useState(0);

  // Conteo de solicitudes pendientes para el Administrador
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error al cargar sesión:', err);
      }
    }
  }, []);

  // CONSULTA PERIÓDICA DE PUBLICACIONES PENDIENTES DE REVISIÓN PARA EL ADMIN
  const fetchPendingCount = async () => {
    if (user?.rol !== 'admin') return;
    try {
      const [resP, resS] = await Promise.all([
        fetch('http://localhost:5000/api/projects?estado=pendiente'),
        fetch('http://localhost:5000/api/services?estado=pendiente')
      ]);

      if (resP.ok && resS.ok) {
        const pData = await resP.json();
        const sData = await resS.json();
        const newTotal = pData.length + sData.length;

        // Si se detectan nuevas solicitudes pendientes, desplegar toast de notificación
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
      const interval = setInterval(fetchPendingCount, 4000); // Polling rápido cada 4 segundos
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
      const response = await fetch('http://localhost:5000/api/auth/perfil', {
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
  };

  const handleAdminUpdate = () => {
    setRefreshKey((prev) => prev + 1);
    fetchPendingCount();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative">
      <Navbar 
        user={user} 
        onOpenAuth={handleOpenAuth} 
        onNavigate={handleNavigate} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={handleOpenAdminModal}
        pendingCount={pendingCount}
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

      {/* Modal Panel de Administrador de Etiquetas */}
      <AdminTagsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onUpdate={handleAdminUpdate}
      />
    </div>
  );
}

export default App;
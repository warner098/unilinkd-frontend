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

  const handlePublicationSuccess = (type, data) => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar 
        user={user} 
        onOpenAuth={handleOpenAuth} 
        onNavigate={handleNavigate} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={handleOpenAdminModal}
      />

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
      />
    </div>
  );
}

export default App;
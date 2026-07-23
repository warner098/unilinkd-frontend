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

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [user, setUser] = useState(null);
  
  // Estado para controlar el modal del perfil personal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Pestaña activa en la sección principal
  const [activeTab, setActiveTab] = useState('proyectos'); 

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

  const handleNavigate = (tabName) => {
    setActiveTab(tabName);
    const section = document.getElementById('seccion-explorar');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 🔴 AQUÍ ESTÁ LA NUEVA FUNCIÓN QUE REEMPLAZA A LA ANTERIOR
  const handleSaveProfile = async (updatedData) => {
    const usuarioActualizado = { ...user, ...updatedData };
    
    // Guarda de inmediato en el estado de React y en LocalStorage
    setUser(usuarioActualizado);
    localStorage.setItem('user', JSON.stringify(usuarioActualizado));

    try {
      // Petición a la ruta correcta del Backend (api/auth/perfil)
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
          // Si MongoDB responde OK, refrescamos con los datos de la base de datos
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Error al conectar con el Backend:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar 
        user={user} 
        onOpenAuth={handleOpenAuth} 
        onNavigate={handleNavigate} 
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {user ? (
        <Dashboard user={user} />
      ) : (
        <>
          <main>
            <Hero onOpenAuth={handleOpenAuth} />
            <Features />
            <ContentSection activeTab={activeTab} setActiveTab={setActiveTab} />
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
    </div>
  );
}

export default App;
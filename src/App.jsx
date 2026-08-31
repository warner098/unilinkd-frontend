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
import RequestHelpModal from './components/RequestHelpModal';
import ChatHubModal from './components/ChatHubModal';
import PortfolioModal from './components/PortfolioModal';
import PublicProfileModal from './components/PublicProfileModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import JoinProjectModal from './components/JoinProjectModal';

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
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isPublicationOpen, setIsPublicationOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Modal Perfil Público de Usuario
  const [isPublicProfileOpen, setIsPublicProfileOpen] = useState(false);
  const [publicProfileTarget, setPublicProfileTarget] = useState(null);

  // Modal Detalle Ampliado de Proyecto de Portafolio
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [selectedPortfolioProject, setSelectedPortfolioProject] = useState(null);
  const [projectAuthorInfo, setProjectAuthorInfo] = useState({ name: '', avatar: '' });

  // Modal Postularse / Unirme a Proyecto
  const [isJoinProjectOpen, setIsJoinProjectOpen] = useState(false);
  const [selectedProjectForJoin, setSelectedProjectForJoin] = useState(null);

  const handleOpenPublicProfile = (identifier) => {
    if (!identifier) return;
    setPublicProfileTarget(identifier);
    setIsPublicProfileOpen(true);
  };

  const handleOpenProjectDetail = (project, authorName = '', authorAvatar = '') => {
    if (!project) return;
    setSelectedPortfolioProject(project);
    setProjectAuthorInfo({ name: authorName, avatar: authorAvatar });
    setIsProjectDetailOpen(true);
  };

  const handleOpenJoinProject = (project) => {
    if (!user) {
      setAuthTab('login');
      setIsAuthOpen(true);
      showToast('Por favor inicia sesión para postularte a unirte a un proyecto.', 'warning');
      return;
    }
    setSelectedProjectForJoin(project);
    setIsJoinProjectOpen(true);
  };
  
  // Modal de Solicitud de Ayuda
  const [isRequestHelpOpen, setIsRequestHelpOpen] = useState(false);
  const [selectedServiceForHelp, setSelectedServiceForHelp] = useState(null);

  // Modal de Chat Hub Estilo Discord
  const [isChatHubOpen, setIsChatHubOpen] = useState(false);
  const [chatHubInitialRequestId, setChatHubInitialRequestId] = useState(null);
  const [chatHubFilterServiceId, setChatHubFilterServiceId] = useState(null);

  const handleOpenRequestHelp = (service) => {
    if (!user) {
      setAuthTab('login');
      setIsAuthOpen(true);
      showToast('Por favor inicia sesión para contactar por ayuda.', 'warning');
      return;
    }
    setSelectedServiceForHelp(service);
    setIsRequestHelpOpen(true);
  };

  const handleOpenChatHub = (requestId = null, filterServiceId = null) => {
    if (!user) {
      setAuthTab('login');
      setIsAuthOpen(true);
      showToast('Por favor inicia sesión para ver tus mensajes.', 'warning');
      return;
    }
    setChatHubInitialRequestId(requestId);
    setChatHubFilterServiceId(filterServiceId);
    setIsChatHubOpen(true);
  };
  
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
  }, [user]);

  // CONSULTAR SOLICITUDES PENDIENTES DEL ADMIN
  useEffect(() => {
    let isMounted = true;
    const fetchPendingCount = async () => {
      if (user && user.rol === 'admin') {
        try {
          const [resServices, resProjects] = await Promise.all([
            fetch(`${API_BASE_URL}/api/services?estado=pendiente`),
            fetch(`${API_BASE_URL}/api/projects?estado=pendiente`)
          ]);
          
          if (resServices.ok && resProjects.ok) {
            const services = await resServices.json();
            const projects = await resProjects.json();
            const total = services.length + projects.length;

            if (isMounted) {
              setPendingCount((prev) => {
                if (total > prev && prev !== 0) {
                  setShowNotificationToast(true);
                  setTimeout(() => setShowNotificationToast(false), 5000);
                }
                return total;
              });
            }
          }
        } catch (err) {
          console.error('Error al obtener contadores pendientes:', err);
        }
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, refreshKey]);

  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDashboardTab('servicios');
    showToast('Sesión cerrada con éxito.', 'info');
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id || user._id,
          correo: user.correo,
          ...updatedData
        })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast('Perfil actualizado con éxito en la base de datos.', 'success');
      } else {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        showToast('Perfil actualizado localmente.', 'info');
      }
    } catch (err) {
      console.error('Error al guardar perfil:', err);
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      showToast('Perfil guardado en modo local.', 'info');
    }
  };

  const handleUpdateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handlePublicationSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    if (user && user.rol === 'admin') {
      showToast('Publicación procesada exitosamente como Administrador.', 'success');
    } else {
      showToast('¡Tu propuesta se envió a revisión! El Administrador la aprobará pronto. 🚀', 'success');
    }
  };

  const handleAdminUpdate = () => {
    setRefreshKey((prev) => prev + 1);
    showToast('Base de datos y catálogo de etiquetas actualizados.', 'success');
  };

  const handleEditItem = (item, type) => {
    setEditingItem(item);
    setEditingItemType(type);
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* GLOW DE FONDO AMBIENTAL TIPO AWWWARDS */}
      <div className="glow-orb-dark bg-indigo-600/20 w-[600px] h-[600px] -top-30 -left-30"></div>
      <div className="glow-orb-dark bg-violet-600/15 w-[500px] h-[500px] top-60 -right-20"></div>

      {/* TOAST DE NOTIFICACIÓN DE ADMINISTRADOR */}
      {showNotificationToast && (
        <div className="fixed top-20 right-5 z-50 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-indigo-400/40">
          <span className="text-xl">🔔</span>
          <div>
            <p className="text-xs font-bold">¡Nueva solicitud recibida!</p>
            <p className="text-[11px] opacity-90">Tienes {pendingCount} publicaciones pendientes por revisar.</p>
          </div>
        </div>
      )}

      {/* NAVBAR NAVEGACIÓN GLOBAL */}
      <Navbar 
        user={user} 
        onOpenAuth={handleOpenAuth} 
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPortfolio={() => setIsPortfolioOpen(true)}
        onOpenPublication={() => setIsPublicationOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(false)}
        onOpenChatHub={() => handleOpenChatHub()}
        pendingCount={pendingCount}
        unreadNotifCount={unreadNotifCount}
        onSelectDashboardTab={(tab) => {
          setDashboardTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* VISTA PRINCIPAL O DASHBOARD DEL USUARIO */}
      {user ? (
        <main className="flex-1 w-full relative z-10">
          <Dashboard 
            user={user}
            onOpenPublicationModal={() => setIsPublicationOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onEditPublication={handleEditItem}
            onRequestHelp={handleOpenRequestHelp}
            onOpenServiceChats={(serviceId) => handleOpenChatHub(null, serviceId)}
            initialDashboardTab={dashboardTab}
            onOpenPublicProfile={handleOpenPublicProfile}
            onOpenJoinProject={handleOpenJoinProject}
          />
        </main>
      ) : (
        <>
          <main className="flex-1 relative z-10">
            <Hero 
              onOpenAuth={handleOpenAuth} 
              onOpenPublication={() => setIsPublicationOpen(true)}
            />
            <Features />
            <ContentSection 
              key={refreshKey} 
              onOpenAuth={handleOpenAuth} 
              user={user}
              onOpenPublication={() => setIsPublicationOpen(true)}
              onRequestHelp={handleOpenRequestHelp}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenPublicProfile={handleOpenPublicProfile}
              onOpenJoinProject={handleOpenJoinProject}
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
        onOpenPortfolio={() => setIsPortfolioOpen(true)}
      />

      {/* Modal Portafolio Personal */}
      <PortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUserData}
        showToast={showToast}
      />

      {/* Modal Perfil Público de Cualquier Estudiante */}
      <PublicProfileModal
        isOpen={isPublicProfileOpen}
        onClose={() => setIsPublicProfileOpen(false)}
        userIdentifier={publicProfileTarget}
        onOpenProjectDetail={handleOpenProjectDetail}
        onRequestHelp={handleOpenRequestHelp}
        onOpenChat={() => handleOpenChatHub()}
      />

      {/* Modal Detalle Ampliado de Proyecto de Portafolio */}
      <ProjectDetailModal
        isOpen={isProjectDetailOpen}
        onClose={() => setIsProjectDetailOpen(false)}
        project={selectedPortfolioProject}
        authorName={projectAuthorInfo.name}
        authorAvatar={projectAuthorInfo.avatar}
      />

      {/* Modal Postularse a Proyecto */}
      <JoinProjectModal
        isOpen={isJoinProjectOpen}
        onClose={() => setIsJoinProjectOpen(false)}
        project={selectedProjectForJoin}
        user={user}
        showToast={showToast}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
          handleOpenChatHub();
        }}
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
        onOpenChatRequest={(requestId) => handleOpenChatHub(requestId)}
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

      {/* Modal Redactar Petición de Ayuda */}
      <RequestHelpModal
        isOpen={isRequestHelpOpen}
        onClose={() => setIsRequestHelpOpen(false)}
        service={selectedServiceForHelp}
        user={user}
        showToast={showToast}
        onSuccess={() => {
          fetchUserNotificationsCount();
          handleOpenChatHub();
        }}
      />

      {/* Modal Chat Hub & Mensajes Estilo Discord */}
      <ChatHubModal
        isOpen={isChatHubOpen}
        onClose={() => setIsChatHubOpen(false)}
        user={user}
        initialRequestId={chatHubInitialRequestId}
        filterServiceId={chatHubFilterServiceId}
        showToast={showToast}
        onOpenPublicProfile={handleOpenPublicProfile}
      />

      {/* TOAST CONTAINER GLOBAL */}
      <ToastContainer toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
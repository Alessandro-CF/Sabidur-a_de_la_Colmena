import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

// Logo igual al de Home.jsx
function HexagonLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="16,3 29,10.5 29,25.5 16,33 3,25.5 3,10.5" fill="#FFF32B" stroke="#22223b" strokeWidth="2"/>
      <circle cx="16" cy="13" r="2" fill="#22223b"/>
    </svg>
  );
}

function ChevronDown(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.85a.75.75 0 01-1.02 0l-4.25-3.85a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

// Componente de icono de notificación
function NotificationIcon({ count = 0 }) {
  return (
    <div className="relative">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 hover:scale-110">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
}

function NavLink({ href, children, active, icon = null }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-500 transition flex items-center gap-2 ${active ? "bg-amber-300" : ""}`}
    >
      {icon}
      {children}
    </Link>
  );
}

function ProfileLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const isLoggedIn = false;

  // Obtener el número de notificaciones no leídas
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notificaciones/count');
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.count);
        }
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };

    // Ejecutar la función para obtener notificaciones
    fetchNotifications();
    
    // Actualizar las notificaciones cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-[#FFF32B] text-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre del sitio */}
          <Link href="/" className="flex items-center group focus:outline-none">
            <HexagonLogo />
            <span className="ml-3 font-bold text-gray-900 text-xl group-hover:underline transition">
              Sabiduría de la Colmena
            </span>
          </Link>
          {/* Menú de navegación para desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavLink href="/" active={window.location.pathname === "/"}>Inicio</NavLink>
              <NavLink href="/comunidad" active={window.location.pathname.startsWith("/comunidad")}>Comunidad</NavLink>
              <NavLink href="/productos" active={window.location.pathname === "/productos"}>Productos</NavLink>
              <NavLink href="/capacitaciones" active={window.location.pathname === "/capacitaciones"}>Capacitaciones</NavLink>
              
              {/* Notificaciones */}
              <NavLink 
                href="/comunidad/notificaciones" 
                active={window.location.pathname === "/comunidad/notificaciones"}
                icon={<NotificationIcon count={notificationCount} />}
              >
                Notificaciones
              </NavLink>
              
              {/* Perfil */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center px-3 py-2 rounded-md text-gray-900 hover:bg-amber-500 transition"
                >
                  {isLoggedIn ? "Usuario" : "Perfil"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    {isLoggedIn ? (
                      <>
                        <ProfileLink href="/perfil">Mi Perfil</ProfileLink>
                        <ProfileLink href="/configuracion">Configuración</ProfileLink>
                        <ProfileLink href="/logout">Cerrar Sesión</ProfileLink>
                      </>
                    ) : (
                      <>
                        <ProfileLink href="/login">Iniciar Sesión</ProfileLink>
                        <ProfileLink href="/register">Registrarse</ProfileLink>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-amber-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden mt-2">
            <NavLink href="/" active={window.location.pathname === "/"}>Inicio</NavLink>
            <NavLink href="/comunidad" active={window.location.pathname.startsWith("/comunidad")}>Comunidad</NavLink>
            <NavLink href="/productos" active={window.location.pathname === "/productos"}>Productos</NavLink>
            <NavLink href="/capacitaciones" active={window.location.pathname === "/capacitaciones"}>Capacitaciones</NavLink>
            
            {/* Notificaciones para móvil */}
            <NavLink 
              href="/comunidad/notificaciones" 
              active={window.location.pathname === "/comunidad/notificaciones"}
              icon={<NotificationIcon count={notificationCount} />}
            >
              Notificaciones
            </NavLink>
            
            <div className="border-t my-2"></div>
            {isLoggedIn ? (
              <>
                <ProfileLink href="/perfil">Mi Perfil</ProfileLink>
                <ProfileLink href="/configuracion">Configuración</ProfileLink>
                <ProfileLink href="/logout">Cerrar Sesión</ProfileLink>
              </>
            ) : (
              <>
                <ProfileLink href="/login">Iniciar Sesión</ProfileLink>
                <ProfileLink href="/register">Registrarse</ProfileLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

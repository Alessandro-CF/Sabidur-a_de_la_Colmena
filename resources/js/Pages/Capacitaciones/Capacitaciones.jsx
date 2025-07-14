import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import authService from '../../services/authService';
import { useForm } from '@inertiajs/react';


export default function Capacitaciones() {
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    nombre: '',
    email: '',
    telefono: '',
    curso_id: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post('/inscripciones', {
      onSuccess: () => {
        alert('Inscripción enviada con éxito');
        setShowModal(false);
        reset();
      }
    });
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        authService.removeToken();
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      authService.removeToken();
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Ejemplo de cursos
  const cursos = [
    {
      id: 1,
      titulo: "Introducción a la Apicultura",
      descripcion: "Aprende los conceptos básicos para comenzar con la apicultura, manejo de colmenas y cuidados esenciales.",
      duracion: "3 semanas",
      imagen: "https://arocha.org/wp-content/uploads/2024/04/Beekeeping_mc.jpg.webp" // aquí podrías poner url o importar imagen
    },
    {
      id: 2,
      titulo: "Producción y Cosecha de Miel",
      descripcion: "Curso avanzado para entender técnicas de producción, cosecha y procesamiento de miel de alta calidad.",
      duracion: "6 semanas",
      imagen: "https://cdn.www.gob.pe/uploads/document/file/6909174/1018817-vraem-mas-de-250-apicultores-diversifican-su-economia-con-la-produccion-de-miel-de-abeja.png"
    },
    {
      id: 3,
      titulo: "Salud y Enfermedades de las Abejas",
      descripcion: "Identifica enfermedades comunes y aprende a mantener colmenas saludables mediante buenas prácticas.",
      duracion: "4 semanas",
      imagen: "https://organicosanita.com/wp-content/uploads/2024/05/enfermedades-de-las-abejas.webp"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-amber-400 text-gray-900 shadow-md sticky top-0 z-50" style={{ backgroundColor: '#F8F32B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y nombre del sitio */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <HexagonLogo />
                <span className="ml-3 font-bold text-gray-900 text-xl">Sabiduría de la Colmena</span>
              </div>
            </div>

            {/* Menú desktop */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <NavLink href="/" active={false}>Inicio</NavLink>
                <NavLink href="/articulos" active={false}>Artículos</NavLink>
                <NavLink href="/productos" active={false}>Productos</NavLink>
                <NavLink href="/capacitaciones" active={true}>Capacitaciones</NavLink>

                {/* Perfil */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-gray-900 hover:bg-amber-500 transition"
                  >
                    {isLoggedIn ? (user?.name.split(' ')[0] || "Usuario") : "Perfil"}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {isLoggedIn ? (
                        <>
                          <ProfileLink href="/perfil">Mi Perfil</ProfileLink>
                          <ProfileLink href="/configuracion">Configuración</ProfileLink>
                          {user?.role === 'admin' && (
                            <ProfileLink href="/dashboard">Dashboard Administrativo</ProfileLink>
                          )}
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Cerrar Sesión
                          </button>
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
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/" active={false}>Inicio</MobileNavLink>
            <MobileNavLink href="/articulos" active={false}>Artículos</MobileNavLink>
            <MobileNavLink href="/productos" active={false}>Productos</MobileNavLink>
            <MobileNavLink href="/capacitaciones" active={true}>Capacitaciones</MobileNavLink>

            {isLoggedIn ? (
              <>
                <MobileNavLink href="/perfil">Mi Perfil</MobileNavLink>
                <MobileNavLink href="/configuracion">Configuración</MobileNavLink>
                {user?.role === 'admin' && (
                  <MobileNavLink href="/dashboard">Dashboard Administrativo</MobileNavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500 hover:text-gray-900"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/login">Iniciar Sesión</MobileNavLink>
                <MobileNavLink href="/register">Registrarse</MobileNavLink>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#e6e940ff' }}>
          Capacitaciones Disponibles
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                {/* Imagen placeholder */}
                {curso.imagen ? (
                  <img src={curso.imagen} alt={curso.titulo} className="object-cover w-full h-full" />
                ) : (
                  <span>Imagen del curso</span>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#39393A' }}>{curso.titulo}</h2>
                <p className="text-gray-700 mb-4">{curso.descripcion}</p>
                <p className="text-sm text-gray-500 mb-4">Duración: {curso.duracion}</p>
                <button
                  onClick={() => {
                    setSelectedCurso(curso);
                    setShowModal(true);
                    setData({
                      nombre: '',
                      email: '',
                      telefono: '',
                      curso_id: curso.id,
                    });
                  }}
                  className="inline-block px-4 py-2 rounded-lg font-medium text-white"
                  style={{ backgroundColor: '#FA9500' }}
                >
                  Más información
                </button>


              </div>
            </div>
          ))}
        </div>
        {showModal && selectedCurso && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-2">{selectedCurso.titulo}</h2>
              <p className="mb-4 text-gray-700">{selectedCurso.descripcion}</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    required
                    className="w-full border rounded p-2"
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    className="w-full border rounded p-2"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                {/* Teléfono */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={data.telefono}
                    onChange={(e) => setData('telefono', e.target.value)}
                    required
                    className="w-full border rounded p-2"
                  />
                  {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Enviar inscripción
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Componentes auxiliares para el Navbar
const NavLink = ({ href, active, children }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium transition ${active ? 'bg-amber-500 text-gray-900' : 'text-gray-900 hover:bg-amber-500'
      }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, active, children }) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium transition ${active ? 'bg-amber-500 text-gray-900' : 'text-gray-900 hover:bg-amber-500'
      }`}
  >
    {children}
  </Link>
);

const ProfileLink = ({ href, children }) => (
  <Link
    href={href}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
  >
    {children}
  </Link>
);

// Icono de Hexágono para logo
const HexagonLogo = ({ color = "#39393A", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <circle cx="12" cy="12" r="3" fill={color} />
  </svg>
);

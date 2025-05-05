import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, ChevronDown, User } from 'lucide-react';

// Componente principal
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulación de estado de login

  // Efecto para animaciones de entrada
  useEffect(() => {
    // Aquí podrías añadir animaciones con JS vanilla o alguna librería
  }, []);

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

            {/* Menú de navegación para desktop */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <NavLink href="/" active={true}>Inicio</NavLink>
                <NavLink href="/articulos">Artículos</NavLink>
                <NavLink href="/productos">Productos</NavLink>
                <NavLink href="/capacitaciones">Capacitaciones</NavLink>
                
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

            {/* Botón de menú móvil */}
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

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="/" active={true}>Inicio</MobileNavLink>
              <MobileNavLink href="/articulos">Artículos</MobileNavLink>
              <MobileNavLink href="/productos">Productos</MobileNavLink>
              <MobileNavLink href="/capacitaciones">Capacitaciones</MobileNavLink>
              
              {isLoggedIn ? (
                <>
                  <MobileNavLink href="/perfil">Mi Perfil</MobileNavLink>
                  <MobileNavLink href="/configuracion">Configuración</MobileNavLink>
                  <MobileNavLink href="/logout">Cerrar Sesión</MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink href="/login">Iniciar Sesión</MobileNavLink>
                  <MobileNavLink href="/register">Registrarse</MobileNavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Contenido principal */}
      <main>
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden" style={{ backgroundColor: '#EFF7FF' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
            {/* Texto principal */}
            <div className="w-full md:w-1/2 mb-12 md:mb-0 z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bienvenido a<br/>
                <span style={{ color: '#C06E52' }}>Sabiduría de la Colmena</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700">
                Descubre el fascinante mundo de la apicultura, una práctica milenaria 
                que contribuye a la biodiversidad y al equilibrio de nuestros ecosistemas.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  className="px-6 py-3 rounded-lg font-medium transition" 
                  style={{ backgroundColor: '#FA9500', color: '#EFF7FF' }}
                >
                  Explorar Artículos
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium border-2 transition"
                  style={{ borderColor: '#558C8C', color: '#558C8C' }}
                >
                  Ver Productos
                </button>
              </div>
            </div>
            
            {/* Imagen o gráfico */}
            <div className="w-full md:w-1/2 relative">
              <div className="relative">
                <HoneycombPattern />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BeeLogo width={120} height={120} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de información */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#39393A' }}>
                La Importancia de la Apicultura
              </h2>
              <div className="h-1 w-24 mx-auto" style={{ backgroundColor: '#FA9500' }}></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Polinización",
                  description: "Las abejas son responsables de la polinización del 80% de plantas con flores, contribuyendo a la biodiversidad.",
                  color: "#F8F32B"
                },
                {
                  title: "Productos Naturales",
                  description: "Además de la miel, las abejas producen propóleo, cera, jalea real y polen, todos con propiedades beneficiosas.",
                  color: "#558C8C"
                },
                {
                  title: "Equilibrio Ecológico",
                  description: "Son bioindicadores naturales: su presencia o ausencia revela la salud del ecosistema.",
                  color: "#C06E52"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-center mb-4">
                    <div 
                      className="w-16 h-16 flex items-center justify-center rounded-full" 
                      style={{ backgroundColor: item.color }}
                    >
                      <HexagonIcon color="#39393A" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de publicaciones destacadas */}
        <section className="py-16" style={{ backgroundColor: '#EFF7FF' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#39393A' }}>
                Publicaciones Destacadas
              </h2>
              <div className="h-1 w-24 mx-auto" style={{ backgroundColor: '#FA9500' }}></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3" style={{ backgroundColor: '#F8F32B' }}>
                      Artículo
                    </span>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#39393A' }}>
                      Consejos para principiantes en apicultura
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Descubre los mejores consejos para comenzar en el fascinante mundo de la apicultura...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Hace 3 días</span>
                      <button className="text-sm font-medium" style={{ color: '#558C8C' }}>Leer más</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <button 
                className="px-6 py-3 rounded-lg font-medium transition" 
                style={{ backgroundColor: '#FA9500', color: '#EFF7FF' }}
              >
                Ver todos los artículos
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: '#39393A', color: '#EFF7FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center mb-4">
                <HexagonLogo color="#F8F32B" />
                <span className="ml-3 font-bold text-xl">Sabiduría de la Colmena</span>
              </div>
              <p className="text-gray-300">
                Una comunidad dedicada a compartir conocimientos y experiencias sobre apicultura.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-400 transition">Inicio</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Artículos</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Productos</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Capacitaciones</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
              <p className="mb-2">contacto@sabiduriacolmena.com</p>
              <p>+1 123 456 7890</p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Sabiduría de la Colmena. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componentes auxiliares
const NavLink = ({ href, active, children }) => {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
        active
          ? 'bg-amber-500 text-gray-900'
          : 'text-gray-900 hover:bg-amber-500'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, active, children }) => {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium transition ${
        active
          ? 'bg-amber-500 text-gray-900'
          : 'text-gray-900 hover:bg-amber-500'
      }`}
    >
      {children}
    </Link>
  );
};

const ProfileLink = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
    >
      {children}
    </Link>
  );
};

// Componentes de hexágono y panal
const HexagonLogo = ({ color = "#39393A", size = 36 }) => {
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <circle cx="12" cy="12" r="3" fill={color} />
      </svg>
    </div>
  );
};

const HexagonIcon = ({ color = "#39393A", size = 24 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

const BeeLogo = ({ width = 100, height = 100 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="35" fill="#F8F32B" />
      <path
        d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 25C56.07 25 61.78 26.95 66.41 30.22L33.78 62.85C30.51 58.22 28.56 52.51 28.56 46.44C28.56 34.62 38.18 25 50 25ZM50 75C43.93 75 38.22 73.05 33.59 69.78L66.22 37.15C69.49 41.78 71.44 47.49 71.44 53.56C71.44 65.38 61.82 75 50 75Z"
        fill="#39393A"
      />
      <circle cx="40" cy="40" r="5" fill="#39393A" />
      <circle cx="60" cy="60" r="5" fill="#39393A" />
    </svg>
  );
};

const HoneycombPattern = () => {
  // Crear un patrón de panal con hexágonos
  const hexSize = 40;
  const hexagons = [];
  const rows = 8;
  const cols = 8;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offsetX = col * hexSize * 1.5;
      const offsetY = row * hexSize * 1.732;
      const evenRowOffset = row % 2 === 0 ? 0 : hexSize * 0.75;
      
      hexagons.push(
        <g key={`hex-${row}-${col}`} transform={`translate(${offsetX + evenRowOffset}, ${offsetY})`}>
          <path
            d={`M ${hexSize},0 L ${hexSize * 0.5},${hexSize * 0.866} L ${-hexSize * 0.5},${hexSize * 0.866} L ${-hexSize},0 L ${-hexSize * 0.5},${-hexSize * 0.866} L ${hexSize * 0.5},${-hexSize * 0.866} Z`}
            fill="transparent"
            stroke="#F8F32B"
            strokeOpacity={0.4}
            strokeWidth="2"
          />
        </g>
      );
    }
  }
  
  return (
    <div className="w-full h-96 relative overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0.7 }}
      >
        {hexagons}
      </svg>
    </div>
  );
};
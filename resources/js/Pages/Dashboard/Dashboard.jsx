import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
  Home, 
  Users, 
  ShoppingBag, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { HexagonLogo } from '../../Components/ProfileComponents';
import withAdminAuth from '../../Components/withAdminAuth';
import authService from '../../services/authService';
import DashboardStats from './DashboardStats';
import UsersManagement from './UsersManagement';
import ProductsManagement from './ProductsManagement';
import ArticlesManagement from './ArticlesManagement';
import DashboardSettings from './DashboardSettings';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      authService.removeToken();
      window.location.href = '/';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Resumen General', icon: BarChart3 },
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'products', label: 'Gestión de Productos', icon: ShoppingBag },
    { id: 'articles', label: 'Gestión de Artículos', icon: BookOpen },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardStats />;
      case 'users':
        return <UsersManagement />;
      case 'products':
        return <ProductsManagement />;
      case 'articles':
        return <ArticlesManagement />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } md:w-64`}>
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} md:space-x-3`}>
              <HexagonLogo size={32} />
              <span className={`font-bold text-gray-900 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                Admin Panel
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1 rounded hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-amber-100 text-amber-700 border-l-4 border-amber-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                    {item.label}
                  </span>
                  {activeTab === item.id && (
                    <ChevronRight size={16} className={`ml-auto ${sidebarOpen ? 'block' : 'hidden'} md:block`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Usuario y logout */}
          <div className="border-t border-gray-200 p-4">
            <div className={`flex items-center mb-3 ${sidebarOpen ? 'space-x-3' : 'justify-center'} md:space-x-3`}>
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Users size={16} className="text-amber-600" />
              </div>
              <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                href="/"
                className={`w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
                  sidebarOpen ? '' : 'justify-center'
                } md:justify-start`}
              >
                <Home size={16} />
                <span className={`ml-3 text-sm ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                  Volver al sitio
                </span>
              </Link>
              
              <button
                onClick={handleLogout}
                className={`w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                  sidebarOpen ? '' : 'justify-center'
                } md:justify-start`}
              >
                <LogOut size={16} />
                <span className={`ml-3 text-sm ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                  Cerrar sesión
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header principal */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-600">
                  Panel de administración - Sabiduría de la Colmena
                </p>
              </div>
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(Dashboard);

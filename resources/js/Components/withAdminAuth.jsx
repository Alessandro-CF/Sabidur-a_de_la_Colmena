import { useEffect, useState } from 'react';
import { HexagonLogo } from '../Components/ProfileComponents';
import authService from '../services/authService';
import dashboardService from '../services/dashboardService';

const withAdminAuth = (WrappedComponent) => {
  return function AdminProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const checkAccess = async () => {
        try {
          // Verificar si está autenticado
          if (!authService.isAuthenticated()) {
            window.location.href = '/login';
            return;
          }

          // Verificar acceso al dashboard
          await dashboardService.checkDashboardAccess();
          setHasAccess(true);
        } catch (error) {
          console.error('Dashboard access check failed:', error);
          setError(error.message);
          
          // Redirigir según el tipo de error
          if (error.message.includes('Authentication')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else if (error.message.includes('Admin')) {
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }
        } finally {
          setLoading(false);
        }
      };

      checkAccess();
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <HexagonLogo size={60} />
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="mt-2 text-gray-600">Verificando permisos de administrador...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <HexagonLogo size={60} />
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Acceso Denegado
              </h2>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <div className="space-y-3">
                {error.includes('Authentication') ? (
                  <p className="text-sm text-gray-500">
                    Redirigiendo al login en unos segundos...
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Redirigiendo a la página principal en unos segundos...
                  </p>
                )}
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <HexagonLogo size={60} />
            <p className="mt-4 text-gray-600">Acceso no autorizado</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;

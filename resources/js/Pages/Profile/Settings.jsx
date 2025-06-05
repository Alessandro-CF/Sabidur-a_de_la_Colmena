import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, Trash2, AlertTriangle } from 'lucide-react';
import authService from '../../services/authService';

// Componente Logo Hexagonal
const HexagonLogo = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 80 80" className="flex-shrink-0">
      <path
        d="M40 8 L65 23 L65 53 L40 68 L15 53 L15 23 Z"
        fill="#F8F32B"
        stroke="#39393A"
        strokeWidth="3"
      />
      <circle cx="40" cy="40" r="5" fill="#39393A" />
      <circle cx="30" cy="35" r="3" fill="#39393A" />
      <circle cx="50" cy="35" r="3" fill="#39393A" />
      <circle cx="35" cy="50" r="2" fill="#39393A" />
      <circle cx="45" cy="50" r="2" fill="#39393A" />
    </svg>
  );
};

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Estado para eliminación de cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos del usuario' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.changePassword(passwordData);
      if (response.success) {
        setPasswordData({ current_password: '', password: '', password_confirmation: '' });
        setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al cambiar la contraseña'
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.deleteAccount(deletePassword);
      if (response.success) {
        setMessage({ type: 'success', text: 'Cuenta eliminada correctamente' });
        // Redirigir después de un breve delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al eliminar la cuenta'
      });
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
      setDeletePassword('');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'moderator': return 'Moderador';
      default: return 'Usuario';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HexagonLogo />
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Configuración - Sabiduría de la Colmena" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/perfil"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al perfil
                </Link>
                <div className="flex items-center">
                  <HexagonLogo />
                  <h1 className="ml-3 text-xl font-semibold text-gray-900">Configuración de Cuenta</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Mensajes */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Información del usuario */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Información de la cuenta</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email} • {getRoleText(user?.role)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Cambiar contraseña</h2>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                    Contraseña actual
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="current_password"
                      id="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full pr-10 border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Tu contraseña actual"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nueva contraseña
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="password"
                      id="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      className="block w-full pr-10 border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                    Confirmar nueva contraseña
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="password_confirmation"
                      id="password_confirmation"
                      value={passwordData.password_confirmation}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full pr-10 border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Repite la nueva contraseña"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                    style={{ backgroundColor: '#F8F32B', color: '#39393A' }}
                  >
                    {changingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
                  </button>
                </div>
              </form>
            </div>

            {/* Zona de peligro */}
            <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-red-400">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Zona de peligro</h2>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Eliminar cuenta
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Una vez que elimines tu cuenta, no podrás recuperarla. Esta acción es permanente y eliminará todos tus datos.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Eliminar mi cuenta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal de confirmación para eliminar cuenta */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  ¿Estás seguro?
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
                  </p>
                  <div className="mt-4">
                    <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 text-left">
                      Confirma tu contraseña para continuar:
                    </label>
                    <input
                      type="password"
                      id="deletePassword"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Tu contraseña"
                    />
                  </div>
                </div>
                <div className="flex justify-center space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={!deletePassword || deletingAccount}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {deletingAccount ? 'Eliminando...' : 'Eliminar cuenta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

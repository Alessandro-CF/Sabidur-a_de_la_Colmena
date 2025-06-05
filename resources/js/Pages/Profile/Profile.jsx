import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setFormData({ name: userData.name, email: userData.email });
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos del usuario' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await authService.updateProfile(formData);
      if (response.success) {
        setUser(response.user);
        setEditing(false);
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al actualizar el perfil' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email });
    setEditing(false);
    setMessage({ type: '', text: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
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
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Mi Perfil - Sabiduría de la Colmena" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Link>
                <div className="flex items-center">
                  <HexagonLogo />
                  <h1 className="ml-3 text-xl font-semibold text-gray-900">Mi Perfil</h1>
                </div>
              </div>
              
              <Link
                href="/configuracion"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                style={{ backgroundColor: '#F8F32B', color: '#39393A' }}
              >
                Configuración
              </Link>
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

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Banner de perfil */}
            <div className="h-32 bg-gradient-to-r from-amber-400 to-yellow-300" style={{ background: 'linear-gradient(to right, #F8F32B, #FDE047)' }}></div>
            
            {/* Información del usuario */}
            <div className="px-6 py-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:space-x-5">
                  <div className="flex-shrink-0">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center -mt-12 border-4 border-white shadow-lg">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user?.name}</p>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleText(user?.role)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center sm:mt-0">
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar perfil
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formulario de perfil */}
            <div className="border-t border-gray-200 px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Nombre completo
                  </dt>
                  <dd className="mt-1">
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        placeholder="Tu nombre completo"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{user?.name}</span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Correo electrónico
                  </dt>
                  <dd className="mt-1">
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        placeholder="tu@email.com"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{user?.email}</span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Miembro desde
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.created_at ? formatDate(user.created_at) : 'No disponible'}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Rol en la plataforma
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {getRoleText(user?.role)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

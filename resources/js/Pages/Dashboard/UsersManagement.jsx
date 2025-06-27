import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  MoreVertical,
  AlertTriangle,
  X,
  Shield,
  ShieldCheck,
  Users,
  UserPlus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import userService from '../../services/userService';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterRole]);

  const fetchUsers = async () => {
    try {
      const response = await dashboardService.getUsers({
        search: searchTerm,
        role: filterRole
      });
      
      if (response.success) {
        setUsers(response.data.data); // Laravel pagination structure
      } else {
        // Fallback a datos simulados
        const mockUsers = [
          {
            id: 1,
            name: 'María González',
            email: 'maria@example.com',
            role: 'user',
            status: 'active',
            created_at: '2024-01-15',
            last_login: '2024-06-15'
          },
          {
            id: 2,
            name: 'Carlos Ruiz',
            email: 'carlos@example.com',
            role: 'moderator',
            status: 'active',
            created_at: '2024-02-10',
            last_login: '2024-06-14'
          },
          {
            id: 3,
            name: 'Ana Pérez',
            email: 'ana@example.com',
            role: 'user',
            status: 'inactive',
            created_at: '2024-03-05',
            last_login: '2024-06-10'
          },
          {
            id: 4,
            name: 'Luis Martínez',
            email: 'luis@example.com',
            role: 'admin',
            status: 'active',
            created_at: '2024-01-01',
            last_login: '2024-06-16'
          }
        ];
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Datos simulados como fallback
      const mockUsers = [
        {
          id: 1,
          name: 'María González',
          email: 'maria@example.com',
          role: 'user',
          status: 'active',
          created_at: '2024-01-15',
          last_login: '2024-06-15'
        },
        {
          id: 2,
          name: 'Carlos Ruiz',
          email: 'carlos@example.com',
          role: 'moderator',
          status: 'active',
          created_at: '2024-02-10',
          last_login: '2024-06-14'
        },
        {
          id: 3,
          name: 'Ana Pérez',
          email: 'ana@example.com',
          role: 'user',
          status: 'inactive',
          created_at: '2024-03-05',
          last_login: '2024-06-10'
        },
        {
          id: 4,
          name: 'Luis Martínez',
          email: 'luis@example.com',
          role: 'admin',
          status: 'active',
          created_at: '2024-01-01',
          last_login: '2024-06-16'
        }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleUserAction = async (action, userId) => {
    try {
      switch (action) {
        case 'view':
          console.log('Viewing user:', userId);
          // Implementar modal de vista
          break;
        case 'edit':
          console.log('Editing user:', userId);
          setEditingUser(userId);
          setShowUserModal(true);
          break;
        case 'toggle':
          const user = users.find(u => u.id === userId);
          const newStatus = user.status === 'active' ? 'inactive' : 'active';
          await dashboardService.updateUser(userId, { status: newStatus });
          fetchUsers(); // Recargar lista
          break;
        case 'delete':
          if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            await dashboardService.deleteUser(userId);
            fetchUsers(); // Recargar lista
          }
          break;
        default:
          console.log(`${action} user ${userId}`);
      }
    } catch (error) {
      console.error('Error performing user action:', error);
      alert('Error al realizar la acción. Por favor intenta de nuevo.');
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800'
    };
    
    const roleLabels = {
      admin: 'Administrador',
      moderator: 'Moderador',
      user: 'Usuario'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[role]}`}>
        {roleLabels[role]}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {status === 'active' ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y controles */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
              <p className="text-gray-600 mt-1">
                Administra los usuarios registrados en el sistema
              </p>
            </div>
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
              <Plus size={16} className="mr-2" />
              Agregar Usuario
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administradores</option>
                <option value="moderator">Moderadores</option>
                <option value="user">Usuarios</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total Usuarios</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className="text-sm text-gray-600">Administradores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'moderator').length}
              </p>
              <p className="text-sm text-gray-600">Moderadores</p>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.last_login).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleUserAction('view', user.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleUserAction('edit', user.id)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleUserAction('toggle', user.id)}
                        className={user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                      >
                        {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button 
                        onClick={() => handleUserAction('delete', user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredUsers.length}</span> de{' '}
              <span className="font-medium">{users.length}</span> resultados
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-amber-600 text-white">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-white hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

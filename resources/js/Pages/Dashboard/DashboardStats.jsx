import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  BookOpen, 
  TrendingUp, 
  Eye,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalArticles: 0,
    totalOrders: 0,
    recentActivity: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        // Fallback a datos simulados si hay error
        const mockStats = {
          totalUsers: 125,
          totalProducts: 48,
          totalArticles: 32,
          totalOrders: 267,
          recentActivity: [
            { id: 1, action: 'Nuevo usuario registrado', user: 'María González', time: '2 min' },
            { id: 2, action: 'Pedido realizado', user: 'Carlos Ruiz', time: '5 min' },
            { id: 3, action: 'Artículo publicado', user: 'Admin', time: '1 hora' },
            { id: 4, action: 'Producto actualizado', user: 'Admin', time: '2 horas' },
            { id: 5, action: 'Nueva consulta', user: 'Ana Pérez', time: '3 horas' }
          ],
          monthlyStats: [
            { month: 'Ene', users: 20, orders: 45, revenue: 1200 },
            { month: 'Feb', users: 25, orders: 52, revenue: 1450 },
            { month: 'Mar', users: 30, orders: 48, revenue: 1380 },
            { month: 'Abr', users: 28, orders: 55, revenue: 1620 },
            { month: 'May', users: 35, orders: 62, revenue: 1850 },
            { month: 'Jun', users: 40, orders: 67, revenue: 2100 }
          ]
        };
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Datos simulados como fallback
      const mockStats = {
        totalUsers: 125,
        totalProducts: 48,
        totalArticles: 32,
        totalOrders: 267,
        recentActivity: [
          { id: 1, action: 'Nuevo usuario registrado', user: 'María González', time: '2 min' },
          { id: 2, action: 'Pedido realizado', user: 'Carlos Ruiz', time: '5 min' },
          { id: 3, action: 'Artículo publicado', user: 'Admin', time: '1 hora' },
          { id: 4, action: 'Producto actualizado', user: 'Admin', time: '2 horas' },
          { id: 5, action: 'Nueva consulta', user: 'Ana Pérez', time: '3 horas' }
        ],
        monthlyStats: [
          { month: 'Ene', users: 20, orders: 45, revenue: 1200 },
          { month: 'Feb', users: 25, orders: 52, revenue: 1450 },
          { month: 'Mar', users: 30, orders: 48, revenue: 1380 },
          { month: 'Abr', users: 28, orders: 55, revenue: 1620 },
          { month: 'May', users: 35, orders: 62, revenue: 1850 },
          { month: 'Jun', users: 40, orders: 67, revenue: 2100 }
        ]
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}% este mes</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          trend={12.5}
        />
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={ShoppingBag}
          color="bg-green-500"
          trend={8.3}
        />
        <StatCard
          title="Total Artículos"
          value={stats.totalArticles}
          icon={BookOpen}
          color="bg-purple-500"
          trend={15.2}
        />
        <StatCard
          title="Total Pedidos"
          value={stats.totalOrders}
          icon={DollarSign}
          color="bg-amber-500"
          trend={20.1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad reciente */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              <Activity size={20} className="text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • hace {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                Ver toda la actividad
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas mensuales */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Estadísticas Mensuales</h3>
              <Calendar size={20} className="text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.monthlyStats.slice(-3).map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-amber-600">
                        {month.month}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {month.users} usuarios nuevos
                      </p>
                      <p className="text-xs text-gray-500">
                        {month.orders} pedidos • ${month.revenue}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      +{Math.round((month.users / 30) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                Ver reporte completo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Users size={20} className="text-blue-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">Gestionar Usuarios</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingBag size={20} className="text-green-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">Agregar Producto</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <BookOpen size={20} className="text-purple-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">Crear Artículo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Star,
  Filter
} from 'lucide-react';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Datos simulados
      const mockProducts = [
        {
          id: 1,
          name: 'Miel de Flores Silvestres',
          category: 'Miel',
          price: 25.99,
          stock: 50,
          status: 'active',
          image: 'miel1.jpg',
          created_at: '2024-05-01'
        },
        {
          id: 2,
          name: 'Propóleo Natural',
          category: 'Productos Naturales',
          price: 18.50,
          stock: 30,
          status: 'active',
          image: 'propoleo1.jpg',
          created_at: '2024-05-10'
        },
        {
          id: 3,
          name: 'Cera de Abeja Pura',
          category: 'Cera',
          price: 12.75,
          stock: 0,
          status: 'inactive',
          image: 'cera1.jpg',
          created_at: '2024-04-15'
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Sin Stock</span>;
    }
    if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Stock Bajo</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Disponible</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Productos</h2>
              <p className="text-gray-600 mt-1">
                Administra el catálogo de productos de la colmena
              </p>
            </div>
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
              <Plus size={16} className="mr-2" />
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">Todas las categorías</option>
              <option value="Miel">Miel</option>
              <option value="Productos Naturales">Productos Naturales</option>
              <option value="Cera">Cera</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <p className="text-sm text-gray-600">Total Productos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stock === 0).length}
              </p>
              <p className="text-sm text-gray-600">Sin Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Valor Total</p>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
                  <div className="flex items-center justify-center h-48 bg-amber-50 rounded-t-lg">
                    <Package size={48} className="text-amber-300" />
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-amber-600">
                          ${product.price}
                        </span>
                        {getStatusBadge(product.status, product.stock)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Package size={16} className="mr-1" />
                        <span>Stock: {product.stock} unidades</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalles">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Intenta ajustar tus filtros de búsqueda' 
                  : 'Comienza agregando tu primer producto al catálogo'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

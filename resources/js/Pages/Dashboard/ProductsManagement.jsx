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
  Filter,
  Upload,
  Download,
  MoreVertical,
  AlertTriangle,
  X
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';

// Componente Modal simple
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Componente de formulario de producto
function ProductForm({ product, categories, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
    imagen: null
  });

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        stock: product.stock || '',
        id_categoria: product.id_categoria || '',
        imagen: null
      });
    }
  }, [product, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del producto
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
        </label>
        <select
          name="id_categoria"
          value={formData.id_categoria}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagen del producto
        </label>
        <input
          type="file"
          name="imagen"
          onChange={handleChange}
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          {isEditing ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
}

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filterCategory, filterStatus, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getProductsManagement({
        search: searchTerm,
        categoria: filterCategory,
        status: filterStatus,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 12
      });
      
      if (response.success) {
        setProducts(response.data.data);
        setPagination(response.data);
        if (response.filters?.categorias) {
          setCategories(response.filters.categorias);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback a datos simulados en caso de error
      const mockProducts = [
        {
          id_producto: 1,
          nombre: 'Miel de Flores Silvestres',
          categoria: { nombre: 'Miel' },
          precio: 25.99,
          stock: 50,
          imagen_url: 'miel1.jpg',
          created_at: '2024-05-01'
        },
        {
          id_producto: 2,
          nombre: 'Propóleo Natural',
          categoria: { nombre: 'Productos Naturales' },
          precio: 18.50,
          stock: 30,
          imagen_url: 'propoleo1.jpg',
          created_at: '2024-05-10'
        },
        {
          id_producto: 3,
          nombre: 'Cera de Abeja Pura',
          categoria: { nombre: 'Cera' },
          precio: 12.75,
          stock: 0,
          imagen_url: 'cera1.jpg',
          created_at: '2024-04-15'
        }
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await dashboardService.getProductStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Estadísticas simuladas como fallback
      setStatistics({
        total_products: 25,
        products_in_stock: 20,
        products_out_of_stock: 3,
        products_low_stock: 2,
        total_inventory_value: 2500.00,
        average_price: 28.50
      });
    }
  };

  const handleProductAction = async (action, productId) => {
    try {
      switch (action) {
        case 'view':
          const productData = await dashboardService.getProduct(productId);
          if (productData.success) {
            setEditingProduct(productData.data);
            setShowEditModal(true);
          }
          break;
        case 'edit':
          const editData = await dashboardService.getProduct(productId);
          if (editData.success) {
            setEditingProduct(editData.data);
            setShowEditModal(true);
          }
          break;
        case 'delete':
          if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            await dashboardService.deleteProduct(productId);
            fetchProducts();
            fetchStatistics();
          }
          break;
        case 'stock':
          const stockValue = prompt('Nuevo valor de stock:');
          if (stockValue !== null && !isNaN(stockValue)) {
            await dashboardService.updateProductStock(productId, {
              stock: parseInt(stockValue),
              action: 'set'
            });
            fetchProducts();
          }
          break;
        default:
          console.log(`${action} product ${productId}`);
      }
    } catch (error) {
      console.error('Error performing product action:', error);
      alert('Error al realizar la acción. Por favor intenta de nuevo.');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      alert('Por favor selecciona al menos un producto');
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (window.confirm(`¿Estás seguro de eliminar ${selectedProducts.length} productos?`)) {
            await dashboardService.bulkUpdateProducts(selectedProducts, 'delete');
            setSelectedProducts([]);
            fetchProducts();
            fetchStatistics();
          }
          break;
        case 'update_category':
          const categoryId = prompt('ID de la nueva categoría:');
          if (categoryId) {
            await dashboardService.bulkUpdateProducts(selectedProducts, 'update_category', {
              categoria_id: parseInt(categoryId)
            });
            setSelectedProducts([]);
            fetchProducts();
          }
          break;
        default:
          console.log(`Bulk ${action} for products:`, selectedProducts);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error al realizar la acción masiva.');
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const formData = new FormData();
      formData.append('nombre', productData.nombre);
      formData.append('descripcion', productData.descripcion);
      formData.append('precio', productData.precio);
      formData.append('stock', productData.stock);
      formData.append('id_categoria', productData.id_categoria);
      
      if (productData.imagen) {
        formData.append('imagen', productData.imagen);
      }

      const response = await dashboardService.createProduct(formData);
      if (response.success) {
        fetchProducts();
        fetchStatistics();
        setShowCreateModal(false);
        alert('Producto creado exitosamente');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      const formData = new FormData();
      formData.append('nombre', productData.nombre);
      formData.append('descripcion', productData.descripcion);
      formData.append('precio', productData.precio);
      formData.append('stock', productData.stock);
      formData.append('id_categoria', productData.id_categoria);
      
      if (productData.imagen instanceof File) {
        formData.append('imagen', productData.imagen);
      }

      const response = await dashboardService.updateProduct(editingProduct.id_producto, formData);
      if (response.success) {
        fetchProducts();
        fetchStatistics();
        setShowEditModal(false);
        setEditingProduct(null);
        alert('Producto actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    }
  };

  const filteredProducts = products;

  const getStatusBadge = (stock) => {
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
            <button 
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
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
              {categories.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="stock_bajo">Stock Bajo</option>
              <option value="sin_stock">Sin Stock</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{statistics.total_products || 0}</p>
              <p className="text-sm text-gray-600">Total Productos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {statistics.products_in_stock || 0}
              </p>
              <p className="text-sm text-gray-600">En Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {statistics.products_out_of_stock || 0}
              </p>
              <p className="text-sm text-gray-600">Sin Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                ${Number(statistics.total_inventory_value || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Valor Inventario</p>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id_producto} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
                  <div className="flex items-center justify-center h-48 bg-amber-50 rounded-t-lg">
                    <Package size={48} className="text-amber-300" />
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.categoria?.nombre || 'Sin categoría'}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-amber-600">
                          ${Number(product.precio).toFixed(2)}
                        </span>
                        {getStatusBadge(product.stock)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Package size={16} className="mr-1" />
                        <span>Stock: {product.stock} unidades</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalles" onClick={() => handleProductAction('view', product.id_producto)}>
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Editar" onClick={() => handleProductAction('edit', product.id_producto)}>
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar" onClick={() => handleProductAction('delete', product.id_producto)}>
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

      {/* Modal para crear producto */}
      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Agregar Producto">
          <ProductForm 
            categories={categories}
            onSubmit={handleCreateProduct}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* Modal para editar producto */}
      {showEditModal && editingProduct && (
        <Modal 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }} 
          title="Editar Producto"
        >
          <ProductForm 
            product={editingProduct}
            categories={categories}
            onSubmit={handleUpdateProduct}
            onCancel={() => {
              setShowEditModal(false);
              setEditingProduct(null);
            }}
            isEditing={true}
          />
        </Modal>
      )}
    </div>
  );
}

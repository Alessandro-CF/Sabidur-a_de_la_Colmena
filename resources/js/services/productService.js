import axios from 'axios';
import authService from './authService';

// Configurar la base URL para las API
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const productService = {
  // Obtener todas las categorías
  async getCategories() {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Obtener productos con filtros
  async getProducts(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener productos públicos (sin autenticación)
  async getPublicProducts(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/products`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching public products:', error);
      throw error;
    }
  },

  // Obtener categorías públicas (sin autenticación)
  async getPublicCategories() {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public categories:', error);
      throw error;
    }
  },

  // Obtener productos por categoría con rotación
  async getProductsByCategory(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/products/by-category`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Obtener un producto específico
  async getProduct(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Obtener estadísticas de productos
  async getProductStatistics() {
    try {
      const response = await apiClient.get('/products/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching product statistics:', error);
      throw error;
    }
  },

  // Crear producto (solo admin)
  async createProduct(productData) {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await apiClient.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar producto (solo admin)
  async updateProduct(id, productData) {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      formData.append('_method', 'PUT');

      const response = await apiClient.post(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Eliminar producto (solo admin)
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Actualizar stock de producto
  async updateStock(id, stockData) {
    try {
      const response = await apiClient.patch(`/products/${id}/stock`, stockData);
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Operaciones en lote
  async bulkUpdate(bulkData) {
    try {
      const response = await apiClient.post('/products/bulk-update', bulkData);
      return response.data;
    } catch (error) {
      console.error('Error in bulk operation:', error);
      throw error;
    }
  }
};

export default productService;

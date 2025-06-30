import api from './api';

const productService = {
  // Obtener todas las categorías
  async getCategories() {
    try {
      const response = await api.get('/public/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Obtener productos con filtros
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener productos públicos (sin autenticación)
  async getPublicProducts(params = {}) {
    try {
      const response = await api.get('/public/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching public products:', error);
      throw error;
    }
  },

  // Obtener categorías públicas (sin autenticación)
  async getPublicCategories() {
    try {
      const response = await api.get('/public/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching public categories:', error);
      throw error;
    }
  },

  // Obtener productos por categoría con rotación
  async getProductsByCategory(params = {}) {
    try {
      const response = await api.get('/public/products/by-category', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts(params = {}) {
    try {
      const response = await api.get('/public/products/featured', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Obtener un producto específico
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Obtener estadísticas de productos
  async getProductStatistics() {
    try {
      const response = await api.get('/products/statistics');
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

      const response = await api.post('/products', formData, {
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

      const response = await api.post(`/products/${id}`, formData, {
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
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Actualizar stock de producto
  async updateStock(id, stockData) {
    try {
      const response = await api.patch(`/products/${id}/stock`, stockData);
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Operaciones en lote
  async bulkUpdate(bulkData) {
    try {
      const response = await api.post('/products/bulk-update', bulkData);
      return response.data;
    } catch (error) {
      console.error('Error in bulk operation:', error);
      throw error;
    }
  }
};

export default productService;

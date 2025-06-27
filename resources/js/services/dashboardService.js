import api from './api';

class DashboardService {
    // Obtener estadísticas del dashboard
    async getStats() {
        try {
            const response = await api.get('/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    // Obtener usuarios
    async getUsers(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.role && filters.role !== 'all') params.append('role', filters.role);
            if (filters.page) params.append('page', filters.page);

            const response = await api.get(`/dashboard/users?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Obtener productos
    async getProducts(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category && filters.category !== 'all') params.append('category', filters.category);
            if (filters.page) params.append('page', filters.page);

            const response = await api.get(`/dashboard/products?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // Obtener artículos
    async getArticles(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category && filters.category !== 'all') params.append('category', filters.category);
            if (filters.status && filters.status !== 'all') params.append('status', filters.status);
            if (filters.page) params.append('page', filters.page);

            const response = await api.get(`/dashboard/articles?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw error;
        }
    }

    // Actualizar usuario
    async updateUser(userId, userData) {
        try {
            const response = await api.put(`/dashboard/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Eliminar usuario
    async deleteUser(userId) {
        try {
            const response = await api.delete(`/dashboard/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Verificar si el usuario actual es admin
    isAdmin() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.role === 'admin';
    }

    // Verificar acceso al dashboard
    async checkDashboardAccess() {
        if (!this.isAdmin()) {
            throw new Error('Access denied: Admin role required');
        }
        
        try {
            // Intentar hacer una petición simple para verificar el token y permisos
            await this.getStats();
            return true;
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error('Access denied: Admin role required');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required');
            }
            throw error;
        }
    }

    // === GESTIÓN DE PRODUCTOS ===

    // Obtener productos con filtros
    async getProductsManagement(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.categoria && filters.categoria !== 'all') params.append('categoria', filters.categoria);
            if (filters.status && filters.status !== 'all') params.append('status', filters.status);
            if (filters.sort_by) params.append('sort_by', filters.sort_by);
            if (filters.sort_order) params.append('sort_order', filters.sort_order);
            if (filters.per_page) params.append('per_page', filters.per_page);
            if (filters.page) params.append('page', filters.page);

            const response = await api.get(`/products?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // Crear producto
    async createProduct(productData) {
        try {
            console.log('=== DEBUG: DashboardService.createProduct ===');
            console.log('Received productData:', productData);
            console.log('Is FormData?', productData instanceof FormData);
            
            // Si ya es FormData, usarlo directamente
            let dataToSend;
            let headers = {};
            
            if (productData instanceof FormData) {
                dataToSend = productData;
                console.log('Using FormData directly');
                // No establecer Content-Type para FormData, el navegador lo manejará automáticamente
            } else {
                console.log('Creating new FormData from object');
                // Si es un objeto, crear FormData
                const formData = new FormData();
                Object.keys(productData).forEach(key => {
                    if (productData[key] !== null && productData[key] !== undefined) {
                        formData.append(key, productData[key]);
                    }
                });
                dataToSend = formData;
                // No establecer Content-Type para FormData, el navegador lo manejará automáticamente
            }

            console.log('Final dataToSend:', dataToSend);
            console.log('Making API request...');

            const response = await api.post('/products', dataToSend, { headers });
            
            console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    }

    // Obtener producto por ID
    async getProduct(productId) {
        try {
            const response = await api.get(`/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    // Actualizar producto
    async updateProduct(productId, productData) {
        try {
            console.log('=== DEBUG: DashboardService.updateProduct ===');
            console.log('Product ID:', productId);
            console.log('Received productData:', productData);
            
            // Si ya es FormData, usarlo directamente
            let dataToSend;
            let headers = {};
            
            if (productData instanceof FormData) {
                dataToSend = productData;
                // Agregar método spoofing para Laravel
                dataToSend.append('_method', 'PUT');
                console.log('Using FormData directly for update with method spoofing');
            } else {
                console.log('Creating new FormData from object for update');
                const formData = new FormData();
                Object.keys(productData).forEach(key => {
                    if (productData[key] !== null && productData[key] !== undefined) {
                        formData.append(key, productData[key]);
                    }
                });
                // Agregar método spoofing para Laravel
                formData.append('_method', 'PUT');
                dataToSend = formData;
            }

            console.log('Making update API request with POST (method spoofing)...');
            
            // Debug: mostrar el contenido de FormData
            console.log('FormData contents before sending:');
            for (let [key, value] of dataToSend.entries()) {
                console.log(`${key}:`, value);
            }
            
            // Usar POST con method spoofing en lugar de PUT para FormData
            const response = await api.post(`/products/${productId}`, dataToSend, { headers });
            console.log('Update API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            console.error('Update error response:', error.response?.data);
            throw error;
        }
    }

    // Eliminar producto
    async deleteProduct(productId) {
        try {
            console.log('=== DEBUG: DashboardService.deleteProduct ===');
            console.log('Product ID:', productId);
            
            const response = await api.delete(`/products/${productId}`);
            console.log('Delete API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            console.error('Delete error response:', error.response?.data);
            throw error;
        }
    }

    // Actualizar stock de producto
    async updateProductStock(productId, stockData) {
        try {
            const response = await api.patch(`/products/${productId}/stock`, stockData);
            return response.data;
        } catch (error) {
            console.error('Error updating product stock:', error);
            throw error;
        }
    }

    // Obtener estadísticas de productos
    async getProductStatistics() {
        try {
            const response = await api.get('/products/statistics');
            return response.data;
        } catch (error) {
            console.error('Error fetching product statistics:', error);
            throw error;
        }
    }

    // Operaciones en lote
    async bulkUpdateProducts(productIds, action, data = null) {
        try {
            const response = await api.post('/products/bulk-update', {
                product_ids: productIds,
                action: action,
                data: data
            });
            return response.data;
        } catch (error) {
            console.error('Error performing bulk operation:', error);
            throw error;
        }
    }
}

export default new DashboardService();

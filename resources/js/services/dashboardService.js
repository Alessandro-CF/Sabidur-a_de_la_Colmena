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
}

export default new DashboardService();

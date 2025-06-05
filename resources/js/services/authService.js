import api from './api';
// import apiDev from './api-dev'; // Descomentar si necesitas usar servidor Laravel dev

// Para usar servidor de desarrollo Laravel (php artisan serve), cambiar por apiDev
const apiInstance = api;

class AuthService {    // Registrar usuario
    async register(name, email, password, password_confirmation) {
        try {            console.log('Attempting registration with:', { name, email, password: '***' });
            const response = await apiInstance.post('/auth/register', {
                name,
                email,
                password,
                password_confirmation
            });
            console.log('Registration response:', response.data);
            if (response.data.success) {
                localStorage.setItem('jwt_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    }// Iniciar sesión
    async login(email, password) {
        try {            console.log('Attempting login with:', { email, password: '***' });
            const response = await apiInstance.post('/auth/login', {
                email,
                password
            });
            console.log('Login response:', response.data);
            if (response.data.success) {
                localStorage.setItem('jwt_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    }    // Cerrar sesión
    async logout() {
        try {
            await apiInstance.post('/auth/logout');
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');
        }
    }    // Obtener usuario actual
    async getCurrentUser() {
        try {
            const response = await apiInstance.get('/auth/me');
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return response.data.user;
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Refrescar token
    async refreshToken() {
        try {
            const response = await apiInstance.post('/auth/refresh');
            if (response.data.success) {
                localStorage.setItem('jwt_token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!localStorage.getItem('jwt_token');
    }

    // Obtener usuario desde localStorage
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }    // Obtener token
    getToken() {
        return localStorage.getItem('jwt_token');
    }

    // Remover token
    removeToken() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
    }

    // Verificar rol
    hasRole(role) {
        const user = this.getUser();
        return user?.role === role;
    }

    // Verificar si es admin
    isAdmin() {
        return this.hasRole('admin');
    }

    // Verificar si es moderador
    isModerator() {
        return this.hasRole('moderator');
    }
}

export default new AuthService();

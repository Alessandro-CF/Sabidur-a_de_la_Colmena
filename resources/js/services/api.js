import axios from 'axios';

// Configuración base de Axios para Laravel
const api = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host}/api/v1`,
    timeout: 15000,
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Solo establecer Content-Type como JSON si no es FormData
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Solo redirigir si no estamos en la página de login o registro
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user');
                // Redirigir al login
                window.location.href = '/login';
            }
        } else if (error.response?.status === 403) {
            // Cuenta desactivada
            const errorMessage = error.response?.data?.message;
            if (errorMessage && (errorMessage.includes('desactivada') || errorMessage.includes('deactivated'))) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user');
                // Mostrar mensaje de cuenta desactivada y redirigir
                alert('Tu cuenta ha sido desactivada. Contacta al administrador para reactivarla.');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

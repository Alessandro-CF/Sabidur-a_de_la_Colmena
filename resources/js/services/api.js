import axios from 'axios';

// Configuración base de Axios para Laragon
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
            localStorage.removeItem('jwt_token');
            // Redirigir al login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

import axios from 'axios';

// Configuración para servidor de desarrollo Laravel
const apiDev = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false
});

// Interceptor para agregar token automáticamente
apiDev.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar respuestas
apiDev.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');
            // Redirigir al login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiDev;

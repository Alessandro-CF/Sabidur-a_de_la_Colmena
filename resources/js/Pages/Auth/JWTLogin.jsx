import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';

// Componente HexagonLogo
function HexagonLogo({ className = "w-8 h-8" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M50 5L85 25V75L50 95L15 75V25L50 5Z"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="2"
            />
            <circle cx="50" cy="50" r="15" fill="#FFB82E" />
            <circle cx="35" cy="35" r="4" fill="#FFB82E" />
            <circle cx="65" cy="35" r="4" fill="#FFB82E" />
            <circle cx="35" cy="65" r="4" fill="#FFB82E" />
            <circle cx="65" cy="65" r="4" fill="#FFB82E" />
        </svg>
    );
}

export default function JWTLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Limpiar errores cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        
        // Limpiar error general cuando el usuario empiece a escribir en email o password
        if ((name === 'email' || name === 'password') && errors.general) {
            setErrors(prev => ({ ...prev, general: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setMessage('');

        try {
            const response = await authService.login(formData.email, formData.password);
            
            if (response.success) {
                setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
                // Esperar un poco antes de redirigir para mostrar el mensaje
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        } catch (error) {
            console.log('Error en login:', error);
            
            if (error.response?.data?.errors) {
                // Errores de validación específicos
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                // Mensaje de error del servidor (ya en español)
                setErrors({ general: error.response.data.message });
            } else if (error.response?.status === 401) {
                // Error 401 - credenciales incorrectas
                setErrors({ general: 'Email o contraseña incorrectos. Por favor, verifica tus datos.' });
            } else if (error.response?.status === 403) {
                // Error 403 - cuenta desactivada
                setErrors({ general: 'Tu cuenta ha sido desactivada. Contacta al administrador para reactivarla.' });
            } else {
                // Error genérico
                setErrors({ general: 'Error al iniciar sesión. Por favor, intenta nuevamente.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Iniciar Sesión - Sabiduría de la Colmena" />
            
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <HexagonLogo className="w-20 h-20" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Iniciar Sesión
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Accede a la Sabiduría de la Colmena
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                            {/* Success Message */}
                            {message && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                                    {message}
                                </div>
                            )}

                            {/* General Error */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                    {errors.general}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                                            errors.password ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                        placeholder="Tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                                    Recordarme
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                        isLoading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
                                    } transition duration-150 ease-in-out`}
                                >
                                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </button>
                            </div>

                            {/* Links */}
                            <div className="text-center space-y-2">
                                <div>
                                    <a
                                        href="/register"
                                        className="text-sm text-amber-600 hover:text-amber-500"
                                    >
                                        ¿No tienes cuenta? Regístrate
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href="/forgot-password"
                                        className="text-sm text-gray-600 hover:text-gray-500"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href="/"
                                        className="text-sm text-gray-600 hover:text-gray-500"
                                    >
                                        ← Volver al inicio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>        </>
    );
}

export { HexagonLogo };

import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { HexagonLogo } from './JWTLogin';
import authService from '../../services/authService';

export default function JWTRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setMessage('');

        try {
            const response = await authService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation
            );
            
            if (response.success) {
                setMessage('¡Registro exitoso! Redirigiendo...');
                // Redirigir al home o dashboard
                window.location.href = '/';
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: error.response?.data?.message || 'Error al registrarse' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Registrarse - Sabiduría de la Colmena" />
            
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <HexagonLogo className="w-20 h-20" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Crear Cuenta
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Únete a la Sabiduría de la Colmena
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

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                    placeholder="Tu nombre completo"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                                )}
                            </div>

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
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                    placeholder="Mínimo 8 caracteres"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                                )}
                            </div>

                            {/* Password Confirmation Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    required
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                    placeholder="Repite tu contraseña"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
                                )}
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
                                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                </button>
                            </div>

                            {/* Links */}
                            <div className="text-center space-y-2">
                                <div>
                                    <a
                                        href="/login"
                                        className="text-sm text-amber-600 hover:text-amber-500"
                                    >
                                        ¿Ya tienes cuenta? Inicia sesión
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
            </div>
        </>
    );
}

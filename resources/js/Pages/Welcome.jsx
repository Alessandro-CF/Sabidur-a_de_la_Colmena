import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Sabiduría de la Colmena" />
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-4xl px-6">
                        <header className="text-center py-10">
                            <h1 className="text-4xl font-bold text-amber-800 mb-4">
                                🐝 Sabiduría de la Colmena
                            </h1>
                            <p className="text-lg text-amber-700 mb-8">
                                Plataforma de gestión apícola y conocimiento
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-amber-800 mb-3">
                                    Gestión de Productos
                                </h2>
                                <p className="text-gray-600">
                                    Administra tu inventario de productos apícolas
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-amber-800 mb-3">
                                    Asesorías Especializadas
                                </h2>
                                <p className="text-gray-600">
                                    Consulta con expertos en apicultura
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-amber-800 mb-3">
                                    Base de Conocimiento
                                </h2>
                                <p className="text-gray-600">
                                    Accede a artículos y recursos especializados
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-amber-800 mb-3">
                                    Gestión de Pedidos
                                </h2>
                                <p className="text-gray-600">
                                    Sistema completo de pedidos y ventas
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            {auth.user ? (
                                <div className="space-x-4">
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Ir al Dashboard
                                    </Link>
                                    <Link
                                        href="/perfil"
                                        className="inline-flex items-center px-6 py-3 bg-amber-100 text-amber-800 font-semibold rounded-lg hover:bg-amber-200 transition-colors"
                                    >
                                        Mi Perfil
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center px-6 py-3 bg-amber-100 text-amber-800 font-semibold rounded-lg hover:bg-amber-200 transition-colors"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

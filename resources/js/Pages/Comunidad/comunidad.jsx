import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

const categorias = [
    { nombre: 'Seguridad', icono: '🔒', color: 'bg-red-50 border-red-200' },
    { nombre: 'Cuidados y salud de la colmena', icono: '🐝', color: 'bg-amber-50 border-amber-200' },
    { nombre: 'Consejos y buenas prácticas', icono: '📋', color: 'bg-blue-50 border-blue-200' },
    { nombre: 'Limpieza', icono: '🧽', color: 'bg-green-50 border-green-200' },
    { nombre: 'Productos recomendados', icono: '🛒', color: 'bg-purple-50 border-purple-200' },
];

export default function Comunidad({ publicaciones, flash }) {
    const [mensaje, setMensaje] = useState(null);
    const [animatedCardId, setAnimatedCardId] = useState(null);
    
    useEffect(() => {
        // Mostrar mensaje flash si existe
        if (flash && (flash.success || flash.error)) {
            setMensaje({
                tipo: flash.success ? 'success' : 'error',
                texto: flash.success || flash.error
            });
            
            // Ocultar el mensaje después de 3 segundos
            const timer = setTimeout(() => {
                setMensaje(null);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleLike = (id) => {
        setAnimatedCardId(id);
        setTimeout(() => {
            router.post(route('comunidad.like', { publicacion: id }), {}, {
                preserveScroll: true
            });
        }, 300);
    };

    const handleGuardar = (id) => {
        setAnimatedCardId(id);
        setTimeout(() => {
            router.post(route('comunidad.guardar', { publicacion: id }), {}, {
                preserveScroll: true
            });
        }, 300);
    };

    return (
        <>
            <Head>
                <title>Comunidad | Sabiduría de la Colmena</title>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .animate-like-pulse {
                        animation: pulse 0.3s ease-in-out;
                    }
                `}</style>
            </Head>
            <Navbar />
            
            {/* Mensaje Flash */}
            {mensaje && (
                <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-500 transform translate-y-0 ${
                    mensaje.tipo === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 
                    'bg-red-100 border-l-4 border-red-500 text-red-700'
                }`}>
                    <div className="flex items-center">
                        <div className={`text-xl mr-2 ${mensaje.tipo === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {mensaje.tipo === 'success' ? '✅' : '❌'}
                        </div>
                        <p>{mensaje.texto}</p>
                    </div>
                </div>
            )}
            
            <div className="bg-gradient-to-b from-[#F7FAFC] to-[#EDF2F7] min-h-screen">
                {/* Barra superior sticky */}
                <div className="sticky top-0 z-30 bg-white shadow-md">
                    <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('comunidad.crear-publicacion')}
                                className="bg-gradient-to-r from-[#FA9500] to-[#fb8c00] text-white font-semibold px-5 py-2 rounded-lg shadow hover:shadow-lg transition duration-300 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Crear publicación
                            </Link>
                            <Link 
                                href={route('comunidad.mis-publicaciones')} 
                                className="text-[#FA9500] font-semibold hover:text-[#fb8c00] transition duration-300 flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                Tus publicaciones
                            </Link>
                            <Link 
                                href={route('comunidad.guardados')} 
                                className="text-[#FA9500] font-semibold hover:text-[#fb8c00] transition duration-300 flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                                Guardados
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar en comunidad..."
                                    className="border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-[#FA9500] transition-all w-64 pl-10"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <Link 
                                href={route('comunidad.notificaciones')} 
                                className="text-[#FA9500] hover:text-[#fb8c00] transition-colors" 
                                aria-label="Notificaciones"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                            </Link>
                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                <span className="bg-amber-500 h-2 w-2 rounded-full"></span>
                                <span className="font-semibold text-[#b8860b]">Usuario</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-amber-100 to-amber-50 py-12 border-b border-amber-200">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold text-amber-900 mb-4">Comunidad Apícola</h1>
                        <p className="text-lg text-amber-800 max-w-3xl mx-auto">Comparte tu conocimiento, experiencias y consejos con otros apicultores. Juntos construimos una comunidad más fuerte y sostenible.</p>
                    </div>
                </div>

                {/* Categorías */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold text-[#39393A] mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#FA9500]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        Explora nuestras Categorías
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {categorias.map((cat) => (
                            <div key={cat.nombre} className={`flex items-center gap-3 ${cat.color} rounded-xl px-4 py-6 font-semibold shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer border`}>
                                <span className="text-3xl">{cat.icono}</span>
                                <span>{cat.nombre}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mensaje motivacional */}
                <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FFF3C4] text-amber-800 text-center py-6 font-bold text-lg shadow-inner border-y border-amber-200">
                    <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        ¡Anímate a escribir y compartir tus conocimientos, para esta Gran Colmena!
                    </div>
                </div>

                {/* Publicaciones */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-3xl font-bold text-[#22223b] mb-8 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-[#FA9500]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Publicaciones de la comunidad
                    </h2>
                    
                    {publicaciones && publicaciones.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {publicaciones.map((pub) => (
                                <div 
                                    key={pub.id} 
                                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col ${animatedCardId === pub.id ? 'animate-like-pulse' : ''}`}
                                    onAnimationEnd={() => setAnimatedCardId(null)}
                                >
                                    <Link href={route('comunidad.publicacion', pub.id)} className="h-40 flex items-center justify-center border-b bg-gradient-to-r from-[#FFFBEB] to-[#FFF3C4] rounded-t-2xl hover:opacity-90 transition-opacity">
                                        <img 
                                            src={pub.imagen || "/images/colmena_logo.png"} 
                                            alt="Imagen de la publicación" 
                                            className="h-28 object-contain hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                                </svg>
                                                <span>{pub.usuario}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                <span>{pub.fecha}</span>
                                            </div>
                                            <button
                                                onClick={() => handleLike(pub.id)}
                                                className="flex items-center gap-1 focus:outline-none transition-transform hover:scale-110"
                                                aria-label="Me gusta"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill={pub.liked ? "#FA9500" : "none"}
                                                    viewBox="0 0 24 24"
                                                    stroke="#FA9500"
                                                    strokeWidth={2}
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5.318 6.318a4.5 4.5 0 016.364 0l.318.318.318-.318a4.5 4.5 0 116.364 6.364L12 21.364l-6.682-6.682a4.5 4.5 0 010-6.364z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <Link href={route('comunidad.publicacion', pub.id)} className="font-bold text-xl mb-2 text-[#39393A] hover:text-[#FA9500] transition-colors">{pub.titulo}</Link>
                                        <div className="text-gray-700 text-sm flex-1 leading-relaxed line-clamp-3">{pub.contenido}</div>
                                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FA9500] mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                </svg>
                                                <span className="text-[#FA9500] font-semibold">
                                                    {pub.likes} Me gusta
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleGuardar(pub.id)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${pub.guardado ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all duration-300 hover:shadow`}
                                            >
                                                {pub.guardado ? (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                                        </svg>
                                                        Guardado
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                        </svg>
                                                        Guardar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-2xl mx-auto border border-amber-100">
                                <div className="text-7xl mb-6 flex justify-center">🐝</div>
                                <h3 className="text-2xl font-bold text-[#FA9500] mb-3">¡Aún no hay publicaciones!</h3>
                                <p className="text-gray-600 mb-8 text-lg">Sé el primero en compartir tus conocimientos y experiencias con la comunidad apícola.</p>
                                <Link
                                    href={route('comunidad.crear-publicacion')}
                                    className="bg-gradient-to-r from-[#FA9500] to-[#fb8c00] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Crear publicación
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </>
    );
}

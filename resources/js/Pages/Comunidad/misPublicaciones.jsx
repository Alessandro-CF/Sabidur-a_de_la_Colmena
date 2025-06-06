import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link, router } from '@inertiajs/react';

export default function MisPublicaciones({ publicaciones }) {
    const [confirmDelete, setConfirmDelete] = useState(null);
    
    const handleLike = (id) => {
        router.post(route('comunidad.like', { publicacion: id }), {}, {
            preserveScroll: true
        });
    };

    const handleGuardar = (id) => {
        router.post(route('comunidad.guardar', { publicacion: id }), {}, {
            preserveScroll: true
        });
    };
    
    const handleEliminar = (id) => {
        if (confirmDelete === id) {
            router.delete(route('comunidad.eliminar', { publicacion: id }));
            setConfirmDelete(null);
        } else {
            setConfirmDelete(id);
        }
    };
    
    const cancelarEliminar = () => {
        setConfirmDelete(null);
    };

    return (
        <>
            <Navbar />
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
                <div className="bg-gradient-to-r from-amber-100 to-amber-50 py-8 border-b border-amber-200">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-3xl font-bold text-amber-900 mb-2">Tus Publicaciones</h1>
                        <p className="text-amber-800">Administra tus publicaciones en la comunidad apícola</p>
                    </div>
                </div>

                {/* Publicaciones */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#39393A] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#FA9500]" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Mis publicaciones
                        </h2>
                        <Link 
                            href={route('comunidad.index')} 
                            className="text-amber-600 hover:text-amber-800 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Volver a la comunidad
                        </Link>
                    </div>
                    
                    {publicaciones && publicaciones.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {publicaciones.map((pub) => (
                                <div key={pub.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="h-40 flex items-center justify-center border-b bg-gradient-to-r from-[#FFFBEB] to-[#FFF3C4] rounded-t-2xl">
                                        <img 
                                            src={pub.imagen || "/images/colmena_logo.png"} 
                                            alt="Imagen de la publicación" 
                                            className="h-28 object-contain"
                                        />
                                    </div>
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
                                                className="flex items-center gap-1 focus:outline-none"
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
                                        <div className="font-bold text-xl mb-2 text-[#39393A]">{pub.titulo}</div>
                                        <div className="text-gray-700 text-sm flex-1 leading-relaxed">{pub.contenido}</div>
                                        
                                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FA9500] mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                </svg>
                                                <span className="text-[#FA9500] font-semibold">
                                                    {pub.likes} Me gusta
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    href={route('comunidad.editar', { publicacion: pub.id })} 
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </Link>
                                                
                                                <button 
                                                    onClick={() => handleEliminar(pub.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors focus:outline-none"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                
                                                <Link 
                                                    href={route('comunidad.publicacion', { publicacion: pub.id })} 
                                                    className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors"
                                                >
                                                    Ver completo
                                                </Link>
                                            </div>
                                        </div>
                                        
                                        {confirmDelete === pub.id && (
                                            <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-200">
                                                <p className="text-red-700 text-sm mb-2">¿Estás seguro de que deseas eliminar esta publicación?</p>
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={cancelarEliminar}
                                                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-xs font-medium"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEliminar(pub.id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium"
                                                    >
                                                        Confirmar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-2xl mx-auto border border-amber-100">
                                <div className="text-7xl mb-6 flex justify-center">🐝</div>
                                <h3 className="text-2xl font-bold text-[#FA9500] mb-3">¡Aún no tienes publicaciones!</h3>
                                <p className="text-gray-600 mb-8 text-lg">Comparte tus conocimientos y experiencias con la comunidad apícola.</p>
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

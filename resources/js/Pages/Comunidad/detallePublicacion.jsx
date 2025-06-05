import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link, router } from '@inertiajs/react';

export default function DetallePublicacion({ publicacion }) {
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

    return (
        <>
            <Navbar />
            <div className="bg-[#F7FAFC] min-h-screen py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <Link href={route('comunidad.index')} className="text-[#FA9500] hover:underline flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver a la comunidad
                            </Link>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleLike(publicacion.id)}
                                    className="flex items-center gap-1 text-[#FA9500] hover:text-[#fb8c00] transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={publicacion.liked ? "#FA9500" : "none"}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.318 6.318a4.5 4.5 0 016.364 0l.318.318.318-.318a4.5 4.5 0 116.364 6.364L12 21.364l-6.682-6.682a4.5 4.5 0 010-6.364z"
                                        />
                                    </svg>
                                    <span>{publicacion.likes} Me gusta</span>
                                </button>
                                <button
                                    onClick={() => handleGuardar(publicacion.id)}
                                    className="flex items-center gap-1 text-[#FA9500] hover:text-[#fb8c00] transition"
                                >
                                    {publicacion.guardado ? (
                                        <>
                                            <span className="text-xl">★</span>
                                            <span>Guardado</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl">☆</span>
                                            <span>Guardar</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-[#39393A] mb-6">{publicacion.titulo}</h1>
                        
                        <div className="flex justify-between text-sm text-gray-500 mb-8">
                            <span>Por: {publicacion.usuario}</span>
                            <span>Publicado el: {publicacion.fecha}</span>
                        </div>
                        
                        {publicacion.imagen && (
                            <div className="flex justify-center mb-8">
                                <img 
                                    src={publicacion.imagen} 
                                    alt="Imagen de la publicación" 
                                    className="max-h-80 object-contain rounded-lg"
                                />
                            </div>
                        )}
                        
                        <div className="prose max-w-none text-[#39393A] mb-8">
                            {publicacion.contenido}
                        </div>
                        
                        <div className="border-t pt-6 mt-8">
                            <h3 className="font-semibold text-lg mb-4">Comentarios</h3>
                            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                                No hay comentarios aún. ¡Sé el primero en comentar!
                            </div>
                            {/* Formulario de comentarios (para futura implementación) */}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

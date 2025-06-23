import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link, router } from '@inertiajs/react';

export default function DetallePublicacion({ publicacion }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    
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
    
    const handleEliminar = () => {
        if (confirmDelete) {
            router.delete(route('comunidad.eliminar', { publicacion: publicacion.id }));
        } else {
            setConfirmDelete(true);
        }
    };
    
    const cancelarEliminar = () => {
        setConfirmDelete(false);
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
                        
                        {/* Opciones de edición y eliminación si el usuario es el propietario */}
                        {publicacion.usuario === 'Usuario' && (
                            <div className="flex gap-3 mb-8">
                                <Link
                                    href={route('comunidad.editar', { publicacion: publicacion.id })}
                                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Editar publicación
                                </Link>
                                
                                <button
                                    onClick={handleEliminar}
                                    className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {confirmDelete ? 'Confirmar eliminación' : 'Eliminar publicación'}
                                </button>
                                
                                {confirmDelete && (
                                    <button
                                        onClick={cancelarEliminar}
                                        className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        )}
                        
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

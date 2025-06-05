import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link, router } from '@inertiajs/react';

const categorias = [
    { nombre: 'Seguridad', icono: '🔒' },
    { nombre: 'Cuidados y salud de la colmena', icono: '🐝' },
    { nombre: 'Consejos y buenas prácticas', icono: '📋' },
    { nombre: 'Limpieza', icono: '🧽' },
    { nombre: 'Productos recomendados', icono: '🛒' },
];

export default function Comunidad({ publicaciones }) {
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
            <div className="bg-[#F7FAFC] min-h-screen">
                {/* Barra superior sticky */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
                    <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('comunidad.crear-publicacion')}
                                className="bg-[#FA9500] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#fb8c00] transition"
                            >
                                + Crear publicación
                            </Link>
                            <Link 
                                href={route('comunidad.mis-publicaciones')} 
                                className="text-[#FA9500] font-semibold hover:underline transition"
                            >
                                Tus publicaciones
                            </Link>
                            <Link 
                                href={route('comunidad.guardados')} 
                                className="text-[#FA9500] font-semibold hover:underline transition"
                            >
                                Guardados
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar en comunidad..."
                                    className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-[#FA9500] transition"
                                />
                                <span className="absolute right-2 top-2 text-gray-400">🔍</span>
                            </div>
                            <Link 
                                href={route('comunidad.notificaciones')} 
                                className="text-[#FA9500] text-xl" 
                                aria-label="Notificaciones"
                            >
                                🔔
                            </Link>
                            <span className="font-semibold text-[#b8860b]">Usuario</span>
                        </div>
                    </div>
                </div>

                {/* Categorías */}
                <section className="max-w-7xl mx-auto px-6 py-8">
                    <h2 className="text-2xl font-bold text-[#39393A] mb-4">Explora nuestras Categorías</h2>
                    <div className="flex flex-wrap gap-4">
                        {categorias.map((cat) => (
                            <div key={cat.nombre} className="flex items-center gap-2 bg-white border border-[#FA9500]/30 rounded-lg px-6 py-4 font-semibold shadow-sm hover:shadow-md transition min-w-[220px]">
                                <span className="text-2xl">{cat.icono}</span>
                                <span>{cat.nombre}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mensaje motivacional */}
                <div className="bg-[#FFF3C4] text-[#b8860b] text-center py-4 font-bold text-lg shadow-inner">
                    ¡Anímate a escribir y compartir tus conocimientos, para esta Gran Colmena!
                </div>

                {/* Publicaciones */}
                <section className="max-w-7xl mx-auto px-6 py-10">
                    <h2 className="text-3xl font-bold text-[#22223b] mb-8">Publicaciones de la comunidad</h2>
                    
                    {publicaciones && publicaciones.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {publicaciones.map((pub) => (
                                <div key={pub.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-0 flex flex-col">
                                    <div className="h-32 flex items-center justify-center border-b bg-[#FFF3C4] rounded-t-2xl">
                                        <img 
                                            src={pub.imagen || "/images/colmena_logo.png"} 
                                            alt="Imagen de la publicación" 
                                            className="h-20 object-contain"
                                        />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                                            <span>{pub.usuario}</span>
                                            <span>{pub.fecha}</span>
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
                                        <div className="font-bold text-lg mb-1 text-[#39393A]">{pub.titulo}</div>
                                        <div className="text-gray-700 text-sm flex-1">{pub.contenido}</div>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-[#FA9500] font-semibold text-sm">
                                                {pub.likes} Me gusta
                                            </span>
                                            <button
                                                onClick={() => handleGuardar(pub.id)}
                                                className="text-[#FA9500] text-sm font-medium hover:underline flex items-center gap-1"
                                            >
                                                {pub.guardado ? '★ Guardado' : '☆ Guardar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                                <div className="text-6xl mb-4">🐝</div>
                                <h3 className="text-xl font-bold text-[#FA9500] mb-2">¡Aún no hay publicaciones!</h3>
                                <p className="text-gray-600 mb-6">Sé el primero en compartir tus conocimientos y experiencias con la comunidad apícola.</p>
                                <Link
                                    href={route('comunidad.crear-publicacion')}
                                    className="bg-[#FA9500] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#fb8c00] transition inline-block"
                                >
                                    + Crear publicación
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

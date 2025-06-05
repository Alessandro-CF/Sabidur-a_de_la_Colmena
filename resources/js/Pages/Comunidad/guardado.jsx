import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";

export default function Guardados({ publicaciones = [] }) {
  return (
    <>
      <Navbar />
      <div className="bg-[#F7FAFC] min-h-screen">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href={route('comunidad.crear-publicacion')}
                className="bg-[#FA9500] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#fb8c00] transition"
              >
                + Crear publicación
              </Link>
              <Link href={route('comunidad.mis-publicaciones')} className="text-[#FA9500] font-semibold hover:underline transition">
                Tus publicaciones
              </Link>
              <Link href={route('comunidad.guardados')} className="text-[#FA9500] font-semibold hover:underline transition">
                Guardados
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar en guardados..."
                  className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-[#FA9500] transition"
                />
                <span className="absolute right-2 top-2 text-gray-400">🔍</span>
              </div>              <Link href={route('comunidad.notificaciones')} className="text-[#FA9500] text-xl" aria-label="Notificaciones">
                🔔
              </Link>
              <span className="font-semibold text-[#b8860b]">Usuario</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-[#22223b] mb-8">Tus guardados</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">            {publicaciones.length > 0 ? (
              publicaciones.map((pub) => (
                <div key={pub.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
                  <img src={pub.imagen} alt="Guardado" className="w-40 h-32 object-contain mb-2" />
                  <h2 className="text-lg font-bold text-[#22223b] mt-2">{pub.titulo}</h2>
                  <p className="text-gray-600 mt-2 mb-4 text-center">{pub.contenido}</p>
                  <div className="flex justify-between w-full text-xs text-gray-500">
                    <span>Por: {pub.usuario}</span>
                    <span>Fecha: {pub.fecha}</span>
                  </div>
                  <div className="text-xs text-[#FA9500] mt-2 font-semibold">
                    {pub.likes} Me gusta
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-gray-700">No tienes publicaciones guardadas</h2>
                <p className="text-gray-500 mt-2">Las publicaciones que guardes aparecerán aquí.</p>
              </div>
            )}          </div>
          <div className="flex justify-center mt-8">
            <Link
              href={route('comunidad.index')}
              className="bg-[#FA9500] hover:bg-[#fb8c00] text-white font-semibold px-6 py-2 rounded shadow transition flex items-center gap-2 mx-auto"
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ir a la Comunidad
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

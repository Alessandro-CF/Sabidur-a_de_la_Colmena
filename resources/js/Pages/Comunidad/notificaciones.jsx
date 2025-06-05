import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";

export default function Notificaciones() {
  const notificaciones = [
    {
      id: 1,
      mensaje: (
        <>
          <span className="font-bold text-[#FA9500]">Alguien</span> le dio like a tu publicación <span className="font-medium">"Ejemplo de publicación"</span>.
        </>
      ),
      fecha: "01/01/2025 12:00",
      icon: (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3C4]">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#FFF3C4"/>
            <path d="M12 21s-6-4.35-6-8.5A3.5 3.5 0 0112 7a3.5 3.5 0 016 5.5C18 16.65 12 21 12 21z" fill="#FA7EA6"/>
          </svg>
        </span>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-[#F7FAFC] min-h-screen">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/comunidad/crear-publicacion"
                className="bg-[#FA9500] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#fb8c00] transition"
              >
                + Crear publicación
              </Link>
              <Link href="/comunidad/tus-publicaciones" className="text-[#FA9500] font-semibold hover:underline transition">
                Tus publicaciones
              </Link>
              <Link href="/comunidad/guardados" className="text-[#FA9500] font-semibold hover:underline transition">
                Guardados
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar notificaciones..."
                  className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-[#FA9500] transition"
                />
                <span className="absolute right-2 top-2 text-gray-400">🔍</span>
              </div>
              <Link href="/comunidad/notificaciones" className="text-[#FA9500] text-xl" aria-label="Notificaciones">
                🔔
              </Link>
              <span className="font-semibold text-[#b8860b]">Usuario</span>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-[#22223b] text-center mb-2">Tus Notificaciones</h1>
          <div className="flex justify-center mb-6">
            <div>
              <div className="h-1 w-24 mx-auto mb-4" style={{ backgroundColor: '#FA9500' }}></div>
              <Link
                href="/comunidad"
                className="bg-[#FA9500] hover:bg-[#fb8c00] text-white font-semibold px-6 py-2 rounded shadow transition flex items-center gap-2 mx-auto"
              >
                <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ir a la Comunidad
              </Link>
            </div>
          </div>
          {notificaciones.length > 0 ? (
            <div className="mb-8">
              {notificaciones.map((n) => (
                <div key={n.id} className="flex items-center bg-white rounded-2xl shadow p-5 mb-6">
                  {n.icon}
                  <div className="ml-4">
                    <div className="text-gray-800 text-base">{n.mensaje}</div>
                    <div className="text-xs text-gray-400 mt-1">{n.fecha}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mb-8">
              No tienes notificaciones recientes.
            </div>
          )}
          <div className="text-center text-gray-500">
            No tienes notificaciones recientes.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

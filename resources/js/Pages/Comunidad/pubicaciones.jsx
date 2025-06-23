import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";

export default function PublicacionesUsuario() {
  const publicaciones = [
    {
      titulo: "Cómo cuidar tus abejas en verano",
      contenido: "Consejos prácticos para mantener saludables tus colmenas durante los meses más calurosos del año.",
      fecha: "10/06/2024",
      edicion: "12/06/2024",
      imagen: "/images/colmena_logo.png",
    },
    {
      titulo: "Receta: Miel casera y sus beneficios",
      contenido: "Descubre cómo preparar miel casera y los beneficios que aporta a tu salud y bienestar.",
      fecha: "05/05/2024",
      edicion: "06/05/2024",
      imagen: "/images/colmena_logo.png",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-[#F7FAFC] min-h-screen">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
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
                  placeholder="Buscar tus publicaciones..."
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
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-[#22223b] mb-8">Tus publicaciones</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {publicaciones.map((pub, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
                <img src={pub.imagen} alt="Publicación" className="w-40 h-32 object-contain mb-2" />
                <h2 className="text-lg font-bold text-[#22223b] mt-2">{pub.titulo}</h2>
                <p className="text-gray-600 mt-2 mb-4 text-center">{pub.contenido}</p>
                <div className="flex justify-between w-full text-xs text-gray-500">
                  <span>{pub.fecha}</span>
                  <span>Última edición: {pub.edicion}</span>
                </div>
              </div>
            ))}
            {publicaciones.length === 0 && (
              <div className="col-span-2 text-gray-500 text-base text-center">
                No tienes publicaciones aún.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

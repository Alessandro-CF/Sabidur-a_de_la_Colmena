import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";

export default function Guardados({ publicaciones = [] }) {
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
                  placeholder="Buscar en guardados..."
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
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 py-10 border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Tus publicaciones guardadas
            </h1>
            <p className="text-amber-800">Aquí encontrarás todas las publicaciones que has guardado para consultar más tarde.</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">            
            {publicaciones.length > 0 ? (
              publicaciones.map((pub) => (
                <div key={pub.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                  <div className="h-48 flex items-center justify-center border-b bg-gradient-to-r from-[#FFFBEB] to-[#FFF3C4] rounded-t-2xl p-4">
                    <img src={pub.imagen || "/images/colmena_logo.png"} alt="Imagen de la publicación" className="h-full object-contain" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-[#22223b] mb-3">{pub.titulo}</h2>
                    <p className="text-gray-700 mb-4 flex-1">{pub.contenido}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm text-gray-500">
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
                      <div className="flex items-center gap-1 text-[#FA9500]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="font-semibold">{pub.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg p-10 max-w-2xl mx-auto border border-amber-100">
                  <div className="text-7xl mb-6 flex justify-center">📚</div>
                  <h2 className="text-2xl font-bold text-[#FA9500] mb-3">No tienes publicaciones guardadas</h2>
                  <p className="text-gray-600 mt-2 mb-8 text-lg">Las publicaciones que guardes aparecerán aquí para que puedas consultarlas más tarde.</p>
                  <Link
                    href={route('comunidad.index')}
                    className="bg-gradient-to-r from-[#FA9500] to-[#fb8c00] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Explorar la Comunidad
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

import React, { useState, useEffect } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link, useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";

export default function Notificaciones({ notificaciones = [] }) {
  const { post } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotificaciones, setFilteredNotificaciones] = useState(notificaciones);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Effect to filter notifications based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNotificaciones(notificaciones);
    } else {
      const filtered = notificaciones.filter(
        (n) =>
          n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotificaciones(filtered);
    }
  }, [searchTerm, notificaciones]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotificaciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotificaciones.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para marcar una notificación como leída
  const marcarComoLeida = (id) => {
    post(route('comunidad.leer-notificacion', id));
  };

  // Función para marcar todas las notificaciones como leídas
  const marcarTodasComoLeidas = () => {
    post(route('comunidad.leer-todas-notificaciones'));
  };

  // Función para obtener el icono según el tipo de notificación
  const getIconoNotificacion = (tipo) => {
    switch (tipo) {
      case 'like':
        return (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3C4]">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#FFF3C4"/>
              <path d="M12 21s-6-4.35-6-8.5A3.5 3.5 0 0112 7a3.5 3.5 0 016 5.5C18 16.65 12 21 12 21z" fill="#FA7EA6"/>
            </svg>
          </span>
        );
      case 'guardado':
        return (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3C4]">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#FFF3C4"/>
              <path d="M6 6h12v12l-6-3-6 3V6z" fill="#FA9500" stroke="#FA9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3C4]">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#FFF3C4"/>
              <path d="M12 8v4m0 4h.01M8.2 3h7.6c.68 0 1.2 0 1.64.13a3 3 0 012.23 2.23c.13.44.13.96.13 1.64v10c0 .68 0 1.2-.13 1.64a3 3 0 01-2.23 2.23c-.44.13-.96.13-1.64.13H8.2c-.68 0-1.2 0-1.64-.13a3 3 0 01-2.23-2.23C4.2 18.2 4.2 17.68 4.2 17V7c0-.68 0-1.2.13-1.64a3 3 0 012.23-2.23C7 3 7.52 3 8.2 3z" stroke="#22223b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        );
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <>
      <Head>
        <title>Notificaciones | Sabiduría de la Colmena</title>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
          }
        `}</style>
      </Head>
      <Navbar />
      <div className="bg-[#F7FAFC] min-h-screen">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/comunidad/crear"
                className="bg-[#FA9500] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#fb8c00] transition"
              >
                + Crear publicación
              </Link>
              <Link href="/comunidad/mis-publicaciones" className="text-[#FA9500] font-semibold hover:underline transition">
                Tus publicaciones
              </Link>
              <Link href="/comunidad/guardados" className="text-[#FA9500] font-semibold hover:underline transition">
                Guardados
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/comunidad" className="text-[#FA9500] font-semibold hover:underline transition">
                Ver comunidad
              </Link>
              <span className="font-semibold text-[#b8860b]">Usuario</span>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-[#22223b] text-center mb-2">Tus Notificaciones</h1>
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-lg">
              <div className="h-1 w-24 mx-auto mb-4" style={{ backgroundColor: '#FA9500' }}></div>
              
              {/* Search Bar */}
              <div className={`relative mb-6 transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FA9500] focus:border-[#FA9500] transition duration-300"
                  placeholder="Buscar en notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchTerm("")}
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {notificacionesNoLeidas > 0 && (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="bg-[#FA9500] hover:bg-[#fb8c00] text-white font-semibold px-6 py-2 rounded shadow transition flex items-center gap-2 mx-auto mb-4"
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Marcar todas como leídas
                </button>
              )}
              <Link
                href="/comunidad"
                className="bg-[#22223b] hover:bg-[#33334b] text-white font-semibold px-6 py-2 rounded shadow transition flex items-center gap-2 mx-auto"
              >
                <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
                  <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Volver a la Comunidad
              </Link>
            </div>
          </div>
          
          {filteredNotificaciones.length > 0 ? (
            <div className="mb-8 space-y-4">
              {currentItems.map((notif, index) => (
                <div 
                  key={notif.id} 
                  className={`flex items-start bg-white rounded-2xl shadow-md hover:shadow-lg p-5 transition-all duration-300 transform hover:-translate-y-1 ${!notif.leida ? 'border-l-4 border-[#FA9500]' : 'border-l border-gray-100'} animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="transition-transform duration-300 hover:scale-110">
                    {getIconoNotificacion(notif.tipo)}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-[#22223b]">{notif.titulo}</h3>
                        <div className="text-gray-700">{notif.mensaje}</div>
                        <div className="text-xs text-gray-500 mt-1">{notif.fecha_completa}</div>
                      </div>
                      {!notif.leida && (
                        <span className="inline-flex h-3 w-3 bg-[#FA9500] rounded-full ml-2 mt-2 animate-pulse"></span>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end">
                      {!notif.leida ? (
                        <button
                          onClick={() => marcarComoLeida(notif.id)}
                          className="text-sm text-[#FA9500] hover:text-[#fb8c00] font-medium flex items-center gap-1 transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Marcar como leída
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Leída
                        </span>
                      )}
                      <Link
                        href={notif.enlace}
                        className="ml-4 text-sm bg-[#FA9500] text-white px-4 py-1.5 rounded-md hover:bg-[#fb8c00] transition-all duration-300 flex items-center gap-1 shadow hover:shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pagination Controls */}
              {filteredNotificaciones.length > itemsPerPage && (
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
                        currentPage === 1 
                          ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' 
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === index + 1
                            ? 'z-10 bg-[#FA9500] border-[#FA9500] text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                        currentPage === totalPages 
                          ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' 
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
              
              <div className="flex justify-center mt-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FA9500] focus:border-[#FA9500]"
                >
                  <option value="5">5 por página</option>
                  <option value="10">10 por página</option>
                  <option value="15">15 por página</option>
                  <option value="20">20 por página</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md mb-8 transition-all duration-500 transform hover:shadow-lg">
              <div className="relative">
                <svg className="mx-auto h-20 w-20 text-gray-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center opacity-0 animate-fadeIn" 
                     style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                  <span className="text-xl">🐝</span>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">No tienes notificaciones</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Cuando alguien interactúe con tus publicaciones dando "me gusta" o guardándolas, verás las notificaciones aquí.
              </p>
              <div className="mt-6">
                <Link
                  href="/comunidad"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FA9500] hover:bg-[#fb8c00] transition-all duration-300 gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Explorar la comunidad
                </Link>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={prevPage}
                className="px-4 py-2 text-sm font-semibold text-[#FA9500] bg-white rounded-lg shadow-md hover:bg-[#f9f9f9] transition-all duration-300 flex items-center gap-1"
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Anterior
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={nextPage}
                className="px-4 py-2 text-sm font-semibold text-[#FA9500] bg-white rounded-lg shadow-md hover:bg-[#f9f9f9] transition-all duration-300 flex items-center gap-1"
                disabled={currentPage === totalPages}
              >
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

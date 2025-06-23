import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link, useForm } from "@inertiajs/react";

export default function EditarPublicacion({ publicacion }) {
  const { data, setData, post, processing, errors } = useForm({
    titulo: publicacion.titulo,
    contenido: publicacion.contenido,
    imagen: null
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagenPreview, setImagenPreview] = useState(publicacion.imagen);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!data.titulo.trim() || !data.contenido.trim()) {
      setErrorMessage('Por favor completa los campos requeridos');
      return;
    }    
    
    post(route('comunidad.update', { publicacion: publicacion.id }), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        setSuccessMessage('¡Publicación actualizada con éxito!');
        // Redirect after short delay to show success message
        setTimeout(() => {
          window.location.href = route('comunidad.mis-publicaciones');
        }, 1500);
      },
      onError: (errors) => {
        if (errors.titulo) {
          setErrorMessage(errors.titulo);
        } else if (errors.contenido) {
          setErrorMessage(errors.contenido);
        } else if (errors.imagen) {
          setErrorMessage(errors.imagen);
        } else {
          setErrorMessage('Ocurrió un error al actualizar la publicación');
        }
      }
    });
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
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Editar Publicación</h1>
            <p className="text-amber-800">Actualiza tu publicación en la comunidad apícola</p>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold text-[#FA9500] mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Título
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FA9500] focus:border-[#FA9500] transition-all"
                  placeholder="Ej: Cómo cuidar tus colmenas en invierno"
                  value={data.titulo}
                  onChange={e => setData('titulo', e.target.value)}
                  maxLength={80}
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {data.titulo.length}/80 caracteres
                </div>
              </div>
              
              <div>
                <label className="block font-semibold text-[#FA9500] mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Contenido
                </label>
                <textarea
                  className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-[#FA9500] focus:border-[#FA9500] transition-all"
                  placeholder="Comparte tu experiencia, consejos o historia... (máx. 350 caracteres)"
                  value={data.contenido}
                  onChange={e => setData('contenido', e.target.value)}
                  maxLength={350}
                  required
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span className={data.contenido.length > 300 ? 'text-amber-600 font-semibold' : ''}>
                    {data.contenido.length}/350 caracteres
                  </span>
                  <span>Mínimo recomendado: 50 caracteres</span>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                <label className="block font-semibold text-[#FA9500] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Imagen <span className="text-gray-500 font-normal ml-1">(opcional)</span>
                </label>
                
                {imagenPreview && (
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-500 mb-2">Imagen actual:</p>
                    <img 
                      src={imagenPreview} 
                      alt="Vista previa" 
                      className="h-32 object-contain mx-auto border border-amber-200 rounded-lg p-2 bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Para cambiar la imagen, selecciona una nueva abajo</p>
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-amber-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="pt-1 text-sm tracking-wider text-gray-600 group-hover:text-gray-600">
                        {data.imagen ? data.imagen.name : 'Selecciona una nueva imagen'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="opacity-0" 
                      onChange={e => {
                        const file = e.target.files[0];
                        setData('imagen', file);
                        if (file) {
                          // Crear URL para vista previa
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setImagenPreview(e.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 2MB
                </p>
              </div>
              
              {errorMessage && (
                <div className="bg-red-50 text-red-600 font-semibold p-4 rounded-lg border border-red-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errorMessage}
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 text-green-600 font-semibold p-4 rounded-lg border border-green-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {successMessage}
                </div>
              )}
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-[#FA9500] to-[#fb8c00] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-70"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                      Guardar cambios
                    </>
                  )}
                </button>
                
                <div className="flex justify-center mt-6">
                  <Link
                    href={route('comunidad.mis-publicaciones')}
                    className="text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Cancelar y volver
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link, useForm } from "@inertiajs/react";

export default function CrearPublicacion() {
  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    contenido: '',
    imagen: null
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!data.titulo.trim() || !data.contenido.trim()) {
      setErrorMessage('Por favor completa los campos requeridos');
      return;
    }    post(route('comunidad.store'), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        setSuccessMessage('¡Publicación creada con éxito!');
        setData('titulo', '');
        setData('contenido', '');
        setData('imagen', '');
        // Redirect after short delay to show success message
        setTimeout(() => {
          window.location.href = route('comunidad.index');
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
          setErrorMessage('Ocurrió un error al crear la publicación');
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F7FAFC] min-h-screen">
        {/* Barra superior sticky */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">              <Link
                href={route('comunidad.crear-publicacion')}
                className="bg-[#FA9500] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#fb8c00] transition"
              >
                + Crear publicación
              </Link>              <Link href={route('comunidad.mis-publicaciones')} className="text-[#FA9500] font-semibold hover:underline transition">
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
                  placeholder="Buscar en comunidad..."
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
        {/* Contenido principal */}
        <div className="flex flex-col items-center py-10">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-8">
              <span className="bg-[#FFF3C4] rounded-full p-3 mr-3">
                <svg width={28} height={28} fill="none" viewBox="0 0 24 24">
                  <path d="M12 20v-6M12 14l-2 2m2-2l2 2M12 4v6m0 0l-2-2m2 2l2-2" stroke="#FA9500" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#FA9500]">
                Crear Nueva Publicación
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-semibold text-[#FA9500] mb-1">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-[#FA9500] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA9500] transition"
                  placeholder="Ej: Cómo cuidar tus colmenas en invierno"                  value={data.titulo}
                  onChange={e => setData('titulo', e.target.value)}
                  maxLength={80}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#FA9500] mb-1">
                  Contenido
                </label>
                <textarea
                  className="w-full border-2 border-[#FA9500] rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#FA9500] transition"
                  placeholder="Comparte tu experiencia, consejos o historia... (máx. 350 caracteres)"                  value={data.contenido}
                  onChange={e => setData('contenido', e.target.value)}
                  maxLength={350}
                  required
                />                <div className="text-right text-xs text-gray-400 mt-1">
                  {data.contenido.length}/350
                </div>
              </div>              <div>
                <label className="block font-semibold text-[#FA9500] mb-1">
                  Imagen <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border-2 border-[#FA9500] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA9500] transition"
                  onChange={e => setData('imagen', e.target.files[0])}
                />
              </div>{errorMessage && (
                <div className="text-red-600 font-semibold">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="text-green-600 font-semibold">{successMessage}</div>
              )}
              <button
                type="submit"
                className="w-full bg-[#FA9500] hover:bg-[#fb8c00] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
                  <path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="white"/>
                </svg>
                Publicar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

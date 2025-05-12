import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function Capacitaciones() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Head title="Capacitaciones" />
      <h1 className="text-2xl font-bold mb-4">Gestión de Capacitaciones</h1>

      <button
        onClick={toggleFormulario}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {mostrarFormulario ? 'Cerrar Formulario' : 'Nueva Capacitación'}
      </button>

      {mostrarFormulario && (
        <form className="mt-6 space-y-4 bg-gray-100 p-4 rounded shadow">
          <div>
            <label className="block font-semibold">Título:</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="Ej. Capacitación en Apicultura"
            />
          </div>

          <div>
            <label className="block font-semibold">Descripción:</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="Describe los temas de la capacitación..."
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold">Fecha:</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Guardar Capacitación
          </button>
        </form>
      )}
    </div>
  );
}

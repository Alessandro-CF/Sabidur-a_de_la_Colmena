import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, PencilLine, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function CategoriasCrud() {
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState({ nombre: "", descripcion: "" });
    const [editandoId, setEditandoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const res = await axios.get("/api/v1/categorias");
            setCategorias(res.data);
        } catch {
            setError("Error al cargar categorías.");
        }
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
        if (!form.nombre.trim()) {
            setError("El nombre es obligatorio.");
            return;
        }

        setLoading(true);
        setError(null);
        setMensaje(null);

        try {
            if (editandoId) {
                await axios.put(`/api/v1/categorias/${editandoId}`, form);
                setMensaje("Categoría actualizada correctamente.");
            } else {
                await axios.post("/api/v1/categorias", form);
                setMensaje("Categoría agregada correctamente.");
            }
            await fetchCategorias();
            resetFormulario();
        } catch {
            setError("Error al guardar la categoría.");
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm("¿Eliminar categoría?")) return;
        try {
            await axios.delete(`/api/v1/categorias/${id}`);
            await fetchCategorias();
            setMensaje("Categoría eliminada.");
        } catch {
            setError("No se pudo eliminar.");
        }
    };

    const handleEditar = (cat) => {
        setForm({ nombre: cat.nombre, descripcion: cat.descripcion });
        setEditandoId(cat.id);
    };

    const resetFormulario = () => {
        setForm({ nombre: "", descripcion: "" });
        setEditandoId(null);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">📁 Gestión de Categorías</h3>

            {error && (
                <div className="flex items-center bg-red-100 text-red-700 p-3 rounded mb-4">
                    <XCircle className="mr-2" /> {error}
                </div>
            )}

            {mensaje && (
                <div className="flex items-center bg-green-100 text-green-700 p-3 rounded mb-4">
                    <CheckCircle2 className="mr-2" /> {mensaje}
                </div>
            )}

            <div className="grid gap-3 mb-6">
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                />
                <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleGuardar}
                        disabled={loading}
                        className={`px-4 py-2 rounded text-white ${editandoId ? "bg-blue-600" : "bg-amber-600"} hover:opacity-90 flex items-center gap-1`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} /> Guardando...
                            </>
                        ) : editandoId ? (
                            <>
                                <PencilLine size={18} /> Actualizar
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={18} /> Agregar
                            </>
                        )}
                    </button>
                    {editandoId && (
                        <button
                            onClick={resetFormulario}
                            className="border border-gray-500 px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            <ul className="space-y-2">
                {categorias.map((cat) => (
                    <li
                        key={cat.id}
                        className="bg-white shadow p-3 rounded flex justify-between items-center"
                    >
                        <div>
                            <strong>{cat.nombre}</strong>
                            <br />
                            <span className="text-sm text-gray-600">{cat.descripcion}</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleEditar(cat)}
                                className="text-blue-600 hover:underline flex items-center"
                            >
                                <PencilLine size={18} className="mr-1" />
                            </button>
                            <button
                                onClick={() => handleEliminar(cat.id)}
                                className="text-red-600 hover:underline flex items-center"
                            >
                                <Trash2 size={18} className="mr-1" /> 
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

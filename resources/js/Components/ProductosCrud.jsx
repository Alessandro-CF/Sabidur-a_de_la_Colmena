import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, PencilLine, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function ProductosCrud() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen_url: "",
        categoria_id: "",
    });
    const [editandoId, setEditandoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const fetchProductos = async () => {
        try {
            const res = await axios.get("/api/v1/productos");
            setProductos(res.data);
        } catch {
            setError("Error al cargar productos.");
        }
    };

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
        setLoading(true);
        setError(null);
        setMensaje(null);

        try {
            if (editandoId) {
                await axios.put(`/api/v1/productos/${editandoId}`, form);
                setMensaje("Producto actualizado correctamente.");
            } else {
                await axios.post("/api/v1/productos", form);
                setMensaje("Producto agregado correctamente.");
            }
            await fetchProductos();
            resetFormulario();
        } catch {
            setError("Error al guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm("¿Eliminar producto?")) return;
        try {
            await axios.delete(`/api/v1/productos/${id}`);
            await fetchProductos();
            setMensaje("Producto eliminado.");
        } catch {
            setError("No se pudo eliminar.");
        }
    };

    const handleEditar = (prod) => {
        setForm({
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            precio: prod.precio,
            stock: prod.stock,
            imagen_url: prod.imagen_url,
            categoria_id: prod.categoria_id || "",
        });
        setEditandoId(prod.id);
    };

    const resetFormulario = () => {
        setForm({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            imagen_url: "",
            categoria_id: "",
        });
        setEditandoId(null);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">📦 Gestión de Productos</h3>

            {error && (
                <div className="flex items-center bg-red-100 text-red-700 p-3 rounded mb-4">
                    <XCircle className="mr-2" />
                    {error}
                </div>
            )}

            {mensaje && (
                <div className="flex items-center bg-green-100 text-green-700 p-3 rounded mb-4">
                    <CheckCircle2 className="mr-2" />
                    {mensaje}
                </div>
            )}

            <div className="grid grid-cols-1 gap-3 mb-6">
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
                <input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    value={form.precio}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                />
                <input
                    type="text"
                    name="imagen_url"
                    placeholder="URL de imagen"
                    value={form.imagen_url}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                />
                <select
                    name="categoria_id"
                    value={form.categoria_id}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                >
                    <option value="">Seleccione categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
                <div className="flex gap-2">
                    <button
                        onClick={handleGuardar}
                        disabled={loading}
                        className={`px-4 py-2 rounded text-white ${
                            editandoId ? "bg-blue-600" : "bg-amber-600"
                        } hover:opacity-90 flex items-center gap-1`}
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

            <div className="space-y-4">
                {productos.map((prod) => (
                    <div
                        key={prod.id}
                        className="bg-white p-4 rounded shadow flex justify-between items-center"
                    >
                        <div>
                            <h4 className="text-lg font-semibold">{prod.nombre}</h4>
                            <p className="text-sm text-gray-600">{prod.descripcion}</p>
                            <p className="text-sm">💲 S/. {prod.precio} | 🧮 Stock: {prod.stock}</p>
                            <p className="text-sm italic">
                                Categoría: {prod.categoria?.nombre || "Sin categoría"}
                            </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            {prod.imagen_url && (
                                <img
                                    src={prod.imagen_url}
                                    alt={prod.nombre}
                                    className="w-16 h-16 rounded object-cover"
                                />
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditar(prod)}
                                    className="text-blue-600 hover:underline flex items-center"
                                >
                                    <PencilLine size={18} className="mr-1" />
                                    
                                </button>
                                <button
                                    onClick={() => handleEliminar(prod.id)}
                                    className="text-red-600 hover:underline flex items-center"
                                >
                                    <Trash2 size={18} className="mr-1" />
                                    
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

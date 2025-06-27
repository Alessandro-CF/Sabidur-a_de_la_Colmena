<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        try {
            $query = Producto::with('categoria');

            // Aplicar filtros
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('descripcion', 'like', "%{$search}%");
                });
            }

            if ($request->has('categoria') && $request->categoria !== 'all') {
                $query->where('id_categoria', $request->categoria);
            }

            if ($request->has('status')) {
                if ($request->status === 'sin_stock') {
                    $query->where('stock', '<=', 0);
                } elseif ($request->status === 'stock_bajo') {
                    $query->where('stock', '>', 0)->where('stock', '<=', 10);
                } elseif ($request->status === 'disponible') {
                    $query->where('stock', '>', 10);
                }
            }

            // Ordenamiento
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->get('per_page', 12);
            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $products,
                'filters' => [
                    'categorias' => Categoria::select('id_categoria', 'nombre')->get()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        try {
            // Log temporal para debug
            Log::info('Frontend product creation attempt', [
                'all_data' => $request->all(),
                'files' => $request->allFiles(),
                'content_type' => $request->header('content-type'),
                'auth_header' => $request->header('authorization') ? 'present' : 'missing'
            ]);

            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'precio' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'id_categoria' => 'required|exists:categorias,id_categoria',
                'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            if ($validator->fails()) {
                Log::error('Frontend validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'received_data' => $request->all()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Manejar subida de imagen
            if ($request->hasFile('imagen')) {
                $imagen = $request->file('imagen');
                
                // Verificar que el archivo sea válido
                if (!$imagen->isValid()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El archivo de imagen no es válido'
                    ], 400);
                }

                // Generar nombre único para la imagen
                $extension = $imagen->getClientOriginalExtension();
                $nombreImagen = time() . '_' . uniqid() . '.' . $extension;
                
                // Crear directorio si no existe
                $directorio = 'productos';
                if (!Storage::disk('public')->exists($directorio)) {
                    Storage::disk('public')->makeDirectory($directorio);
                }
                
                // Guardar la imagen
                $rutaImagen = $imagen->storeAs($directorio, $nombreImagen, 'public');
                
                if (!$rutaImagen) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Error al guardar la imagen'
                    ], 500);
                }
                
                $data['imagen_url'] = $rutaImagen;
            }

            $producto = Producto::create($data);
            $producto->load('categoria');

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $producto
            ], 201);
        } catch (\Exception $e) {
            // Si hay error y se subió una imagen, eliminarla
            if (isset($rutaImagen) && Storage::disk('public')->exists($rutaImagen)) {
                Storage::disk('public')->delete($rutaImagen);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product
     */
    public function show($id)
    {
        try {
            $producto = Producto::with('categoria')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $producto
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, $id)
    {
        try {
            // Log temporal para debug
            Log::info('Frontend product update attempt', [
                'id' => $id,
                'all_data' => $request->all(),
                'files' => $request->allFiles(),
                'content_type' => $request->header('content-type')
            ]);

            $producto = Producto::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'sometimes|required|string|max:255',
                'descripcion' => 'sometimes|required|string',
                'precio' => 'sometimes|required|numeric|min:0',
                'stock' => 'sometimes|required|integer|min:0',
                'id_categoria' => 'sometimes|required|exists:categorias,id_categoria',
                'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            if ($validator->fails()) {
                Log::error('Frontend update validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'received_data' => $request->all()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $imagenAnterior = $producto->imagen_url;

            // Manejar subida de nueva imagen
            if ($request->hasFile('imagen')) {
                $imagen = $request->file('imagen');
                
                // Verificar que el archivo sea válido
                if (!$imagen->isValid()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El archivo de imagen no es válido'
                    ], 400);
                }

                // Generar nombre único para la imagen
                $extension = $imagen->getClientOriginalExtension();
                $nombreImagen = time() . '_' . uniqid() . '.' . $extension;
                
                // Guardar la nueva imagen
                $rutaImagen = $imagen->storeAs('productos', $nombreImagen, 'public');
                
                if (!$rutaImagen) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Error al guardar la nueva imagen'
                    ], 500);
                }
                
                $data['imagen_url'] = $rutaImagen;
            }

            $producto->update($data);
            $producto->load('categoria');

            // Si se actualizó la imagen y había una anterior, eliminar la anterior
            if (isset($rutaImagen) && $imagenAnterior && Storage::disk('public')->exists($imagenAnterior)) {
                Storage::disk('public')->delete($imagenAnterior);
            }

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $producto
            ]);
        } catch (\Exception $e) {
            // Si hay error y se subió una nueva imagen, eliminarla
            if (isset($rutaImagen) && Storage::disk('public')->exists($rutaImagen)) {
                Storage::disk('public')->delete($rutaImagen);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product
     */
    public function destroy($id)
    {
        try {
            Log::info('Frontend product delete attempt', ['id' => $id]);

            $producto = Producto::findOrFail($id);

            // Verificar si el producto tiene pedidos asociados
            if ($producto->detalles()->exists()) {
                Log::warning('Cannot delete product with orders', ['id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un producto que tiene pedidos asociados'
                ], 400);
            }

            $imagenPath = $producto->imagen_url;

            // Eliminar el producto
            $producto->delete();

            // Eliminar imagen si existe (después de eliminar el producto)
            if ($imagenPath && Storage::disk('public')->exists($imagenPath)) {
                Storage::disk('public')->delete($imagenPath);
                Log::info('Product image deleted', ['path' => $imagenPath]);
            }

            Log::info('Product deleted successfully', ['id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting product', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update product stock
     */
    public function updateStock(Request $request, $id)
    {
        try {
            $producto = Producto::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'stock' => 'required|integer|min:0',
                'action' => 'required|in:set,add,subtract'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $newStock = $request->stock;
            $action = $request->action;

            switch ($action) {
                case 'set':
                    $producto->stock = $newStock;
                    break;
                case 'add':
                    $producto->stock += $newStock;
                    break;
                case 'subtract':
                    $producto->stock = max(0, $producto->stock - $newStock);
                    break;
            }

            $producto->save();

            return response()->json([
                'success' => true,
                'message' => 'Stock updated successfully',
                'data' => $producto
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get product statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_products' => Producto::count(),
                'total_categories' => Categoria::count(),
                'products_in_stock' => Producto::where('stock', '>', 0)->count(),
                'products_out_of_stock' => Producto::where('stock', '<=', 0)->count(),
                'products_low_stock' => Producto::where('stock', '>', 0)->where('stock', '<=', 10)->count(),
                'total_inventory_value' => Producto::selectRaw('SUM(precio * stock) as total')->value('total'),
                'average_price' => Producto::avg('precio'),
                'most_expensive' => Producto::max('precio'),
                'cheapest' => Producto::min('precio'),
                'categories_with_products' => Categoria::has('productos')->count(),
                'top_categories' => Categoria::withCount('productos')
                    ->orderBy('productos_count', 'desc')
                    ->limit(5)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update products
     */
    public function bulkUpdate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_ids' => 'required|array',
                'product_ids.*' => 'exists:productos,id_producto',
                'action' => 'required|in:delete,update_category,update_stock',
                'data' => 'required_if:action,update_category,update_stock'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $productIds = $request->product_ids;
            $action = $request->action;
            $actionData = $request->data;

            switch ($action) {
                case 'delete':
                    $productos = Producto::whereIn('id_producto', $productIds)->get();
                    foreach ($productos as $producto) {
                        if ($producto->detalles()->exists()) {
                            continue; // Skip products with orders
                        }
                        if ($producto->imagen_url && Storage::disk('public')->exists($producto->imagen_url)) {
                            Storage::disk('public')->delete($producto->imagen_url);
                        }
                        $producto->delete();
                    }
                    break;

                case 'update_category':
                    Producto::whereIn('id_producto', $productIds)
                           ->update(['id_categoria' => $actionData['categoria_id']]);
                    break;

                case 'update_stock':
                    if ($actionData['type'] === 'set') {
                        Producto::whereIn('id_producto', $productIds)
                               ->update(['stock' => $actionData['value']]);
                    } elseif ($actionData['type'] === 'add') {
                        Producto::whereIn('id_producto', $productIds)
                               ->increment('stock', $actionData['value']);
                    }
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Bulk operation completed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error performing bulk operation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    /**
     * Get all categories for public view
     */
    public function getCategories()
    {
        try {
            $categories = Categoria::withCount('productos')
                ->orderBy('nombre')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products for public view
     */
    public function getProducts(Request $request)
    {
        try {
            $query = Producto::with('categoria')
                ->where('stock', '>', 0); // Solo productos con stock

            // Filtrar por categoría si se especifica
            if ($request->has('categoria') && $request->categoria !== 'all') {
                $query->where('id_categoria', $request->categoria);
            }

            // Filtrar por búsqueda
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('descripcion', 'like', "%{$search}%");
                });
            }

            // Ordenamiento
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('per_page', 12);
            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $products
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
     * Get products by category with rotation
     */
    public function getProductsByCategory(Request $request)
    {
        try {
            // Obtener todas las categorías con productos
            $categories = Categoria::has('productos')
                ->withCount('productos')
                ->orderBy('nombre')
                ->get();

            if ($categories->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }

            // Determinar qué categorías mostrar basado en el tiempo
            $currentHour = now()->hour;
            $categoriesPerRotation = 4;
            $totalCategories = $categories->count();
            
            // Calcular el índice de inicio basado en la hora
            $startIndex = ($currentHour % ceil($totalCategories / $categoriesPerRotation)) * $categoriesPerRotation;
            
            // Obtener las categorías para esta rotación
            $rotatingCategories = $categories->slice($startIndex, $categoriesPerRotation);
            
            // Si no hay suficientes categorías, completar desde el inicio
            if ($rotatingCategories->count() < $categoriesPerRotation && $totalCategories > $categoriesPerRotation) {
                $remaining = $categoriesPerRotation - $rotatingCategories->count();
                $additionalCategories = $categories->slice(0, $remaining);
                $rotatingCategories = $rotatingCategories->merge($additionalCategories);
            }

            $result = [];
            
            foreach ($rotatingCategories as $category) {
                // Obtener productos de esta categoría
                $products = Producto::where('id_categoria', $category->id_categoria)
                    ->where('stock', '>', 0)
                    ->orderBy('created_at', 'desc')
                    ->limit(8) // Limitar a 8 productos por categoría
                    ->get();

                $result[] = [
                    'category' => $category,
                    'products' => $products
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $result,
                'rotation_info' => [
                    'current_hour' => $currentHour,
                    'total_categories' => $totalCategories,
                    'showing_categories' => $rotatingCategories->count(),
                    'next_rotation_in_hours' => ceil($totalCategories / $categoriesPerRotation) - ($currentHour % ceil($totalCategories / $categoriesPerRotation))
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching products by category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts(Request $request)
    {
        try {
            $limit = $request->get('limit', 8);
            
            $products = Producto::with('categoria')
                ->where('stock', '>', 0)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching featured products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get product details
     */
    public function getProduct($id)
    {
        try {
            $product = Producto::with('categoria')
                ->where('stock', '>', 0)
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}

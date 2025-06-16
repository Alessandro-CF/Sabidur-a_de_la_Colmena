<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        //
    }

    /**
     * API Methods
     */
    
    /**
     * Display a listing of products via API.
     */
    public function indexApi(): JsonResponse
    {
        $productos = Producto::all();
        
        return response()->json([
            'data' => $productos,
            'message' => 'Productos obtenidos con éxito'
        ], 200);
    }

    /**
     * Display the specified product via API.
     */
    public function showApi(Producto $producto): JsonResponse
    {
        return response()->json([
            'data' => $producto,
            'message' => 'Producto obtenido con éxito'
        ], 200);
    }
}

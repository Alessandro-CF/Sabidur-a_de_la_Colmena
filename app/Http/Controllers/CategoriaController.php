<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaController extends Controller
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
    public function show(Categoria $categoria)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categoria $categoria)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categoria $categoria)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categoria $categoria)
    {
        //
    }

    /**
     * API Methods
     */
    
    /**
     * Display a listing of categories via API.
     */
    public function indexApi(): JsonResponse
    {
        $categorias = Categoria::all();
        
        return response()->json([
            'data' => $categorias,
            'message' => 'Categorías obtenidas con éxito'
        ], 200);
    }

    /**
     * Display the specified category via API.
     */
    public function showApi(Categoria $categoria): JsonResponse
    {
        return response()->json([
            'data' => $categoria,
            'message' => 'Categoría obtenida con éxito'
        ], 200);
    }
}

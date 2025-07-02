<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use Illuminate\Http\Request;

class InscripcionController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefono' => 'required|string|max:20',
            'curso_id' => 'required|integer',
        ]);

        Inscripcion::create($data);

        return redirect()->back()->with('success', 'Inscripción registrada exitosamente.');
    }
}

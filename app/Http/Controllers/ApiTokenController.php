<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ApiTokenController extends Controller
{
    /**
     * Generate a new API token for the user.
     */
    public function token(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        return response()->json([
            'token' => $user->createToken($request->device_name)->plainTextToken
        ]);
    }

    /**
     * Revoke all tokens for the authenticated user.
     */
    public function revokeTokens(Request $request)
    {
        $request->user()->tokens()->delete();
        
        return response()->json([
            'message' => 'Se han revocado todos los tokens exitosamente'
        ]);
    }
    
    /**
     * Revoke a specific token for the authenticated user.
     */
    public function revokeToken(Request $request, $tokenId)
    {
        $request->user()->tokens()->where('id', $tokenId)->delete();
        
        return response()->json([
            'message' => 'Token revocado exitosamente'
        ]);
    }
}

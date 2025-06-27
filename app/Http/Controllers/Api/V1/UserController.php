<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Filtro por estado
            if ($request->has('estado') && $request->estado !== '') {
                $query->where('estado', $request->estado);
            }

            // Filtro por rol
            if ($request->has('role') && $request->role !== '') {
                $query->where('role', $request->role);
            }

            // Búsqueda por nombre o email
            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Ordenamiento
            $sortField = $request->get('sort_field', 'created_at');
            $sortDirection = $request->get('sort_direction', 'desc');
            
            $allowedSortFields = ['id_usuario', 'name', 'email', 'role', 'estado', 'created_at'];
            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection);
            }

            // Paginación
            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Usuarios obtenidos correctamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener usuarios: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los usuarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        // Este método podría devolver datos necesarios para el formulario
        return response()->json([
            'success' => true,
            'data' => [
                'roles' => ['admin', 'user', 'moderator'],
                'estados' => ['activo', 'inactivo']
            ]
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Creando nuevo usuario', $request->all());

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'required|in:admin,user,moderator',
                'estado' => 'sometimes|in:activo,inactivo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'estado' => $request->get('estado', 'activo') // Por defecto activo
            ];

            $user = User::create($userData);

            Log::info('Usuario creado exitosamente', ['user_id' => $user->id_usuario]);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Usuario creado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(string $id)
    {
        try {
            $user = User::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Usuario obtenido correctamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = User::findOrFail($id);
            
            Log::info('Actualizando usuario', ['user_id' => $id, 'data' => $request->all()]);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id . ',id_usuario',
                'password' => 'sometimes|string|min:8|confirmed',
                'role' => 'sometimes|required|in:admin,user,moderator',
                'estado' => 'sometimes|required|in:activo,inactivo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [];

            if ($request->has('name')) {
                $updateData['name'] = $request->name;
            }

            if ($request->has('email')) {
                $updateData['email'] = $request->email;
            }

            if ($request->has('password') && $request->password) {
                $updateData['password'] = Hash::make($request->password);
            }

            if ($request->has('role')) {
                $updateData['role'] = $request->role;
            }

            if ($request->has('estado')) {
                $updateData['estado'] = $request->estado;
            }

            $user->update($updateData);

            Log::info('Usuario actualizado exitosamente', ['user_id' => $id]);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'Usuario actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al actualizar usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);

            // Verificar que no se esté eliminando a sí mismo
            if (Auth::user()->id_usuario == $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propia cuenta'
                ], 400);
            }

            Log::info('Eliminando usuario', ['user_id' => $id]);

            $user->delete();

            Log::info('Usuario eliminado exitosamente', ['user_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al eliminar usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle user status (activate/deactivate).
     */
    public function toggleStatus(string $id)
    {
        try {
            $user = User::findOrFail($id);

            // Verificar que no se esté desactivando a sí mismo
            if (Auth::user()->id_usuario == $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes cambiar el estado de tu propia cuenta'
                ], 400);
            }

            $newStatus = $user->toggleStatus();

            Log::info('Estado de usuario cambiado', [
                'user_id' => $id,
                'new_status' => $newStatus
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user->fresh(),
                    'new_status' => $newStatus
                ],
                'message' => $newStatus === 'activo' ? 'Usuario activado' : 'Usuario desactivado'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al cambiar estado de usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado del usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update user status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_ids' => 'required|array',
                'user_ids.*' => 'exists:users,id_usuario',
                'estado' => 'required|in:activo,inactivo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userIds = $request->user_ids;
            $estado = $request->estado;

            // Verificar que no se incluya el usuario actual
            if (in_array(Auth::user()->id_usuario, $userIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes cambiar el estado de tu propia cuenta'
                ], 400);
            }

            $updatedCount = User::whereIn('id_usuario', $userIds)
                               ->update(['estado' => $estado]);

            Log::info('Actualización masiva de estado de usuarios', [
                'user_ids' => $userIds,
                'estado' => $estado,
                'updated_count' => $updatedCount
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'updated_count' => $updatedCount,
                    'estado' => $estado
                ],
                'message' => "Se actualizaron {$updatedCount} usuarios a estado: {$estado}"
            ]);

        } catch (\Exception $e) {
            Log::error('Error en actualización masiva de usuarios: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error en la actualización masiva',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics.
     */
    public function statistics()
    {
        try {
            $stats = [
                'total' => User::count(),
                'active' => User::active()->count(),
                'inactive' => User::inactive()->count(),
                'by_role' => [
                    'admin' => User::where('role', 'admin')->count(),
                    'user' => User::where('role', 'user')->count(),
                    'moderator' => User::where('role', 'moderator')->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas obtenidas correctamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas de usuarios: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

import api from './api';

class UserService {
  // Obtener lista de usuarios con filtros
  async getUsers(params = {}) {
    try {
      const response = await api.get('/v1/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtener un usuario específico
  async getUser(id) {
    try {
      const response = await api.get(`/v1/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const response = await api.post('/v1/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/v1/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async deleteUser(id) {
    try {
      const response = await api.delete(`/v1/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  // Cambiar estado de usuario (activar/desactivar)
  async toggleUserStatus(id) {
    try {
      const response = await api.patch(`/v1/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      throw error;
    }
  }

  // Actualización masiva de estado de usuarios
  async bulkUpdateStatus(userIds, estado) {
    try {
      const response = await api.post('/v1/users/bulk-update-status', {
        user_ids: userIds,
        estado
      });
      return response.data;
    } catch (error) {
      console.error('Error en actualización masiva:', error);
      throw error;
    }
  }

  // Obtener estadísticas de usuarios
  async getStatistics() {
    try {
      const response = await api.get('/v1/users/statistics');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Obtener opciones para formularios (roles, estados)
  async getFormOptions() {
    try {
      const response = await api.get('/v1/users/create');
      return response.data;
    } catch (error) {
      console.error('Error al obtener opciones de formulario:', error);
      throw error;
    }
  }

  // Validar email único
  async validateEmail(email, userId = null) {
    try {
      const params = { email };
      if (userId) {
        params.exclude_id = userId;
      }
      const response = await api.get('/v1/users/validate-email', { params });
      return response.data;
    } catch (error) {
      // Si devuelve 422, el email ya existe
      if (error.response?.status === 422) {
        return { valid: false, message: 'El email ya está en uso' };
      }
      throw error;
    }
  }

  // Búsqueda de usuarios
  async searchUsers(query, filters = {}) {
    try {
      const params = {
        search: query,
        ...filters
      };
      const response = await api.get('/v1/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error en búsqueda de usuarios:', error);
      throw error;
    }
  }
}

export default new UserService();

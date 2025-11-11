import api from './api';
import type { Rol } from './usuarios.service';

class RolesService {
  private baseURL = '/api/roles';

  /**
   * Obtener todos los roles
   */
  async obtenerTodos(): Promise<Rol[]> {
    const response = await api.get<Rol[]>(this.baseURL);
    return response.data;
  }

  /**
   * Obtener rol por ID
   */
  async obtenerPorId(id: number): Promise<Rol> {
    const response = await api.get<Rol>(`${this.baseURL}/${id}`);
    return response.data;
  }
}

export const rolesService = new RolesService();


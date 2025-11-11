import api from './api';

// Interfaces según la API
export interface Permiso {
  idPermiso: number;
  nombre: string;
  descripcion: string;
}

export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcion: string;
  permisos: Permiso[];
}

export interface Usuario {
  idUsuario: number;
  rol: Rol;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  estado: string;
  fechaCreacion: string;
  fechaUltimoLogin: string | null;
}

export interface CreateUsuarioRequest {
  idRol: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  contrasena: string;
  telefono?: string;
}

export interface UpdateUsuarioRequest {
  idRol: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  contrasena?: string; // Opcional, si está vacío no se actualiza
  telefono?: string;
}

class UsuariosService {
  private baseURL = '/api/usuarios';

  /**
   * Obtener todos los usuarios
   */
  async obtenerTodos(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>(this.baseURL);
    return response.data;
  }

  /**
   * Obtener usuario por ID
   */
  async obtenerPorId(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Obtener solo usuarios activos
   */
  async obtenerActivos(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>(`${this.baseURL}/activos`);
    return response.data;
  }

  /**
   * Obtener usuarios por rol
   */
  async obtenerPorRol(idRol: number): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>(`${this.baseURL}/rol/${idRol}`);
    return response.data;
  }

  /**
   * Crear nuevo usuario
   */
  async crear(data: CreateUsuarioRequest): Promise<Usuario> {
    const response = await api.post<Usuario>(this.baseURL, data);
    return response.data;
  }

  /**
   * Actualizar usuario existente
   */
  async actualizar(id: number, data: UpdateUsuarioRequest): Promise<Usuario> {
    const response = await api.put<Usuario>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  /**
   * Cambiar estado de usuario (ACTIVO/INACTIVO)
   */
  async cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Promise<void> {
    await api.patch(`${this.baseURL}/${id}/estado`, null, {
      params: { estado }
    });
  }

  /**
   * Eliminar usuario (eliminación lógica - cambia estado a INACTIVO)
   */
  async eliminar(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }
}

export const usuariosService = new UsuariosService();


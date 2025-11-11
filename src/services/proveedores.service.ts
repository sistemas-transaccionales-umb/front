import api from './api';

export interface Proveedor {
  idProveedor: number;
  nitRuc: string;
  nombre: string;
  nombreContacto: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  observaciones: string;
  fechaCreacion: string;
}

export interface CreateProveedorRequest {
  nitRuc: string;
  nombre: string;
  nombreContacto?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  observaciones?: string;
}

export interface UpdateProveedorRequest extends CreateProveedorRequest {}

class ProveedoresService {
  private baseURL = '/api/proveedores';

  /**
   * Obtener todos los proveedores
   */
  async obtenerTodos(): Promise<Proveedor[]> {
    const response = await api.get<Proveedor[]>(this.baseURL);
    return response.data;
  }

  /**
   * Obtener proveedor por ID
   */
  async obtenerPorId(id: number): Promise<Proveedor> {
    const response = await api.get<Proveedor>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Obtener solo proveedores activos
   */
  async obtenerActivos(): Promise<Proveedor[]> {
    const response = await api.get<Proveedor[]>(`${this.baseURL}/activos`);
    return response.data;
  }

  /**
   * Crear nuevo proveedor
   */
  async crear(data: CreateProveedorRequest): Promise<Proveedor> {
    const response = await api.post<Proveedor>(this.baseURL, data);
    return response.data;
  }

  /**
   * Actualizar proveedor existente
   */
  async actualizar(id: number, data: UpdateProveedorRequest): Promise<Proveedor> {
    const response = await api.put<Proveedor>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  /**
   * Cambiar estado de proveedor (ACTIVO/INACTIVO)
   */
  async cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Promise<void> {
    await api.patch(`${this.baseURL}/${id}/estado`, null, {
      params: { estado }
    });
  }

  /**
   * Eliminar proveedor (eliminación lógica - cambia estado a INACTIVO)
   */
  async eliminar(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }
}

export const proveedoresService = new ProveedoresService();


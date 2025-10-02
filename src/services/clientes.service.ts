import api from './api';

export interface Cliente {
  idCliente: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  fechaCreacion: string;
}

export interface CreateClienteRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  email: string;
  contrasenaHash?: string;
}

export interface UpdateClienteRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  email: string;
  contrasenaHash?: string | null;
}

export const clientesService = {
  async crear(data: CreateClienteRequest): Promise<Cliente> {
    const response = await api.post<Cliente>('/api/clientes', data);
    return response.data;
  },

  async actualizar(id: number, data: UpdateClienteRequest): Promise<Cliente> {
    const response = await api.put<Cliente>(`/api/clientes/${id}`, data);
    return response.data;
  },

  async obtenerPorId(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/api/clientes/${id}`);
    return response.data;
  },

  async obtenerTodos(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>('/api/clientes');
    return response.data;
  },

  async obtenerActivos(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>('/api/clientes/activos');
    return response.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/api/clientes/${id}`);
  },
};


import api from './api';

export interface Bodega {
  idBodega: number;
  nombre: string;
  ubicacion: string;
  estado: string;
  fechaCreacion: string;
}

export interface CreateBodegaRequest {
  nombre: string;
  ubicacion: string;
}

export interface UpdateBodegaRequest {
  nombre: string;
  ubicacion: string;
}

export const bodegasService = {
  async crear(data: CreateBodegaRequest): Promise<Bodega> {
    const response = await api.post<Bodega>('/api/bodegas', data);
    return response.data;
  },

  async actualizar(id: number, data: UpdateBodegaRequest): Promise<Bodega> {
    const response = await api.put<Bodega>(`/api/bodegas/${id}`, data);
    return response.data;
  },

  async obtenerPorId(id: number): Promise<Bodega> {
    const response = await api.get<Bodega>(`/api/bodegas/${id}`);
    return response.data;
  },

  async obtenerTodas(): Promise<Bodega[]> {
    const response = await api.get<Bodega[]>('/api/bodegas');
    return response.data;
  },

  async obtenerActivas(): Promise<Bodega[]> {
    const response = await api.get<Bodega[]>('/api/bodegas/activas');
    return response.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/api/bodegas/${id}`);
  },
};


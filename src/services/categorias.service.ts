import api from './api';

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string;
}

export interface CreateCategoriaRequest {
  nombreCategoria: string;
  descripcion: string;
}

export interface UpdateCategoriaRequest {
  nombreCategoria: string;
  descripcion: string;
}

export const categoriasService = {
  async crear(data: CreateCategoriaRequest): Promise<Categoria> {
    const response = await api.post<Categoria>('/api/categorias', data);
    return response.data;
  },

  async actualizar(id: number, data: UpdateCategoriaRequest): Promise<Categoria> {
    const response = await api.put<Categoria>(`/api/categorias/${id}`, data);
    return response.data;
  },

  async obtenerPorId(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/api/categorias/${id}`);
    return response.data;
  },

  async obtenerTodas(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>('/api/categorias');
    return response.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/api/categorias/${id}`);
  },
};


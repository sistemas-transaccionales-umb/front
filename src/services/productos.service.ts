import api from './api';

export interface Producto {
  idProducto: number;
  nombreCategoria: string;
  codigoBarras: string;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  porcentajeIva: number;
  estado: string;
  fechaCreacion: string;
}

export interface CreateProductoRequest {
  idCategoria: number;
  codigoBarras: string;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  porcentajeIva: number;
}

export interface UpdateProductoRequest {
  idCategoria: number;
  codigoBarras: string;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  porcentajeIva: number;
}

export const productosService = {
  async crear(data: CreateProductoRequest): Promise<Producto> {
    const response = await api.post<Producto>('/api/productos', data);
    return response.data;
  },

  async actualizar(id: number, data: UpdateProductoRequest): Promise<Producto> {
    const response = await api.put<Producto>(`/api/productos/${id}`, data);
    return response.data;
  },

  async obtenerPorId(id: number): Promise<Producto> {
    const response = await api.get<Producto>(`/api/productos/${id}`);
    return response.data;
  },

  async obtenerTodos(): Promise<Producto[]> {
    const response = await api.get<Producto[]>('/api/productos');
    return response.data;
  },

  async obtenerActivos(): Promise<Producto[]> {
    const response = await api.get<Producto[]>('/api/productos/activos');
    return response.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/api/productos/${id}`);
  },
};


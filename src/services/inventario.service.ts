import api from './api';

export interface Inventario {
  idInventario: number;
  nombreProducto: string;
  codigoBarras: string;
  nombreBodega: string;
  cantidad: number;
  stockMinimo: number;
  fechaActualizacion: string;
  stockBajo: boolean;
}

export interface CreateInventarioRequest {
  idProducto: number;
  idBodega: number;
  cantidad: number;
  stockMinimo: number;
}

export interface AjustarInventarioRequest {
  idProducto: number;
  idBodega: number;
  cantidad: number;
  motivo: string;
}

export const inventarioService = {
  async crear(data: CreateInventarioRequest): Promise<Inventario> {
    const response = await api.post<Inventario>('/api/inventario', data);
    return response.data;
  },

  async ajustar(data: AjustarInventarioRequest): Promise<Inventario> {
    const response = await api.post<Inventario>('/api/inventario/ajustar', data);
    return response.data;
  },

  async obtenerPorId(id: number): Promise<Inventario> {
    const response = await api.get<Inventario>(`/api/inventario/${id}`);
    return response.data;
  },

  async obtenerTodo(): Promise<Inventario[]> {
    const response = await api.get<Inventario[]>('/api/inventario');
    return response.data;
  },

  async obtenerPorBodega(idBodega: number): Promise<Inventario[]> {
    const response = await api.get<Inventario[]>(`/api/inventario/bodega/${idBodega}`);
    return response.data;
  },

  async obtenerStockBajo(): Promise<Inventario[]> {
    const response = await api.get<Inventario[]>('/api/inventario/stock-bajo');
    return response.data;
  },
};


import api from './api';

export interface DetalleVenta {
  idDetalleVenta?: number;
  nombreProducto?: string;
  codigoBarras?: string;
  idProducto?: number;
  cantidad: number;
  precioUnitario: number;
  subtotalLinea?: number;
  totalIvaLinea?: number;
  totalLinea?: number;
}

export interface Venta {
  idVenta: number;
  nombreCliente: string;
  nombreUsuario: string;
  numeroFactura: string;
  fechaVenta: string;
  totalDescuento: number;
  totalVenta: number;
  observaciones: string;
  olaCode: string;
  estadoPago: string;
  detalles: DetalleVenta[];
}

export interface CreateVentaRequest {
  idCliente: number;
  idUsuario: number;
  numeroFactura: string;
  totalDescuento: number;
  observaciones: string;
  olaCode: string;
  detalles: {
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
  }[];
}

export const ventasService = {
  async crear(data: CreateVentaRequest): Promise<Venta> {
    const response = await api.post<Venta>('/api/ventas', data);
    return response.data;
  },

  async obtenerPorId(id: number): Promise<Venta> {
    const response = await api.get<Venta>(`/api/ventas/${id}`);
    return response.data;
  },

  async obtenerTodas(): Promise<Venta[]> {
    const response = await api.get<Venta[]>('/api/ventas');
    return response.data;
  },

  async actualizarEstadoPago(id: number, estadoPago: string): Promise<Venta> {
    const response = await api.put<Venta>(`/api/ventas/${id}/estado-pago?estadoPago=${estadoPago}`);
    return response.data;
  },

  async obtenerPorCliente(idCliente: number): Promise<Venta[]> {
    const response = await api.get<Venta[]>(`/api/ventas/cliente/${idCliente}`);
    return response.data;
  },

  async obtenerPorPeriodo(fechaInicio: string, fechaFin: string): Promise<Venta[]> {
    const response = await api.get<Venta[]>(
      `/api/ventas/periodo?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`
    );
    return response.data;
  },
};


import api from './api';
import type { Proveedor } from './proveedores.service';

export interface ProductoSimple {
  idProducto: number;
  codigoBarras: string;
  nombre: string;
  porcentajeIva: number;
}

export interface BodegaSimple {
  idBodega: number;
  nombreBodega: string;
}

export interface UsuarioSimple {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  email: string;
}

export interface DetalleCompra {
  idDetalleCompra: number;
  producto: ProductoSimple;
  bodega: BodegaSimple;
  cantidad: number;
  precioUnitarioCompra: number;
  subtotalLinea: number;
  totalIvaLinea: number;
  totalLinea: number;
}

export interface Compra {
  idCompra: number;
  proveedor: Proveedor;
  usuario: UsuarioSimple;
  numeroCompra: string;
  fechaCompra: string;
  subtotal: number;
  totalIva: number;
  totalCompra: number;
  estado: string; // PENDIENTE | RECIBIDA | CANCELADA
  observaciones: string;
  fechaCreacion: string;
  detalles: DetalleCompra[];
}

export interface DetalleCompraRequest {
  idProducto: number;
  idBodega: number;
  cantidad: number;
  precioUnitarioCompra: number;
}

export interface CreateCompraRequest {
  idProveedor: number;
  idUsuario: number;
  numeroCompra: string;
  fechaCompra: string;
  observaciones?: string;
  detalles: DetalleCompraRequest[];
}

class ComprasService {
  private baseURL = '/api/compras';

  /**
   * Obtener todas las compras
   */
  async obtenerTodas(): Promise<Compra[]> {
    const response = await api.get<Compra[]>(this.baseURL);
    return response.data;
  }

  /**
   * Obtener compra por ID
   */
  async obtenerPorId(id: number): Promise<Compra> {
    const response = await api.get<Compra>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Obtener compras por proveedor
   */
  async obtenerPorProveedor(idProveedor: number): Promise<Compra[]> {
    const response = await api.get<Compra[]>(`${this.baseURL}/proveedor/${idProveedor}`);
    return response.data;
  }

  /**
   * Obtener compras por estado
   */
  async obtenerPorEstado(estado: 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA'): Promise<Compra[]> {
    const response = await api.get<Compra[]>(`${this.baseURL}/estado/${estado}`);
    return response.data;
  }

  /**
   * Obtener compras por rango de fechas
   */
  async obtenerPorRangoFechas(fechaInicio: string, fechaFin: string): Promise<Compra[]> {
    const response = await api.get<Compra[]>(`${this.baseURL}/rango-fechas`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data;
  }

  /**
   * Crear nueva compra
   */
  async crear(data: CreateCompraRequest): Promise<Compra> {
    const response = await api.post<Compra>(this.baseURL, data);
    return response.data;
  }

  /**
   * Recibir compra (ingresar stock al inventario)
   */
  async recibir(id: number): Promise<Compra> {
    const response = await api.post<Compra>(`${this.baseURL}/${id}/recibir`);
    return response.data;
  }

  /**
   * Cancelar compra
   */
  async cancelar(id: number, motivo?: string): Promise<Compra> {
    const response = await api.post<Compra>(`${this.baseURL}/${id}/cancelar`, null, {
      params: motivo ? { motivo } : {}
    });
    return response.data;
  }
}

export const comprasService = new ComprasService();


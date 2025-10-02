import api from './api';

export interface DetalleTransferencia {
  idDetalleTransferencia?: number;
  nombreProducto?: string;
  codigoBarras?: string;
  idProducto?: number;
  cantidad: number;
}

export interface Transferencia {
  idTransferencia: number;
  bodegaOrigen: string;
  bodegaDestino: string;
  nombreUsuario: string;
  fechaSolicitud: string;
  fechaRecibo: string | null;
  estado: string;
  observaciones: string;
  detalles: DetalleTransferencia[];
}

export interface CreateTransferenciaRequest {
  idBodegaOrigen: number;
  idBodegaDestino: number;
  idUsuario: number;
  observaciones: string;
  detalles: {
    idProducto: number;
    cantidad: number;
  }[];
}

export const transferenciasService = {
  async crear(data: CreateTransferenciaRequest): Promise<Transferencia> {
    const response = await api.post<Transferencia>('/api/transferencias', data);
    return response.data;
  },

  async obtenerPorId(id: number): Promise<Transferencia> {
    const response = await api.get<Transferencia>(`/api/transferencias/${id}`);
    return response.data;
  },

  async obtenerTodas(): Promise<Transferencia[]> {
    const response = await api.get<Transferencia[]>('/api/transferencias');
    return response.data;
  },

  async obtenerPendientes(): Promise<Transferencia[]> {
    const response = await api.get<Transferencia[]>('/api/transferencias/pendientes');
    return response.data;
  },

  async procesar(id: number): Promise<Transferencia> {
    const response = await api.post<Transferencia>(`/api/transferencias/${id}/procesar`);
    return response.data;
  },

  async recibir(id: number): Promise<Transferencia> {
    const response = await api.post<Transferencia>(`/api/transferencias/${id}/recibir`);
    return response.data;
  },
};


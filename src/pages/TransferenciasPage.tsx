import { useEffect, useState } from 'react';
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { transferenciasService, bodegasService, productosService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import type { Transferencia, CreateTransferenciaRequest } from '../services/transferencias.service';
import type { Bodega } from '../services/bodegas.service';
import type { Producto } from '../services/productos.service';

export default function TransferenciasPage() {
  const { user } = useAuth();
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPendientes, setShowPendientes] = useState(false);
  const [formData, setFormData] = useState<CreateTransferenciaRequest>({
    idBodegaOrigen: 0,
    idBodegaDestino: 0,
    idUsuario: user?.idUsuario || 0,
    observaciones: '',
    detalles: [],
  });
  const [detalleActual, setDetalleActual] = useState({
    idProducto: 0,
    cantidad: 0,
  });

  useEffect(() => {
    loadTransferencias();
    loadBodegas();
    loadProductos();
  }, [showPendientes]);

  const loadTransferencias = async () => {
    try {
      setLoading(true);
      const data = showPendientes
        ? await transferenciasService.obtenerPendientes()
        : await transferenciasService.obtenerTodas();
      setTransferencias(data);
    } catch (error) {
      console.error('Error cargando transferencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBodegas = async () => {
    try {
      const data = await bodegasService.obtenerActivas();
      setBodegas(data);
    } catch (error) {
      console.error('Error cargando bodegas:', error);
    }
  };

  const loadProductos = async () => {
    try {
      const data = await productosService.obtenerActivos();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.detalles.length === 0) {
      toast.warning('Debe agregar al menos un producto');
      return;
    }
    try {
      setLoading(true);
      await transferenciasService.crear(formData);
      toast.success('Transferencia creada exitosamente');
      setShowModal(false);
      resetForm();
      loadTransferencias();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Error al crear transferencia');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      idBodegaOrigen: 0,
      idBodegaDestino: 0,
      idUsuario: user?.idUsuario || 0,
      observaciones: '',
      detalles: [],
    });
    setDetalleActual({ idProducto: 0, cantidad: 0 });
  };

  const agregarDetalle = () => {
    if (detalleActual.idProducto === 0 || detalleActual.cantidad <= 0) {
      toast.warning('Complete los datos del producto');
      return;
    }
    setFormData({
      ...formData,
      detalles: [...formData.detalles, detalleActual],
    });
    setDetalleActual({ idProducto: 0, cantidad: 0 });
  };

  const eliminarDetalle = (index: number) => {
    setFormData({
      ...formData,
      detalles: formData.detalles.filter((_, i) => i !== index),
    });
  };

  const handleProcesar = async (id: number) => {
    if (!window.confirm('¿Procesar esta transferencia?')) return;
    try {
      await transferenciasService.procesar(id);
      toast.success('Transferencia procesada');
      loadTransferencias();
    } catch (error) {
      toast.error('Error al procesar transferencia');
    }
  };

  const handleRecibir = async (id: number) => {
    if (!window.confirm('¿Confirmar recepción de esta transferencia?')) return;
    try {
      await transferenciasService.recibir(id);
      toast.success('Transferencia recibida');
      loadTransferencias();
    } catch (error) {
      toast.error('Error al recibir transferencia');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESADO':
        return 'bg-blue-100 text-blue-800';
      case 'RECIBIDO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transferencias entre Bodegas</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPendientes(!showPendientes)}
            className={`px-4 py-2 rounded-lg ${
              showPendientes ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {showPendientes ? 'Mostrar Todas' : 'Solo Pendientes'}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Transferencia
          </button>
        </div>
      </div>

      {/* Lista de Transferencias */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : transferencias.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay transferencias</div>
        ) : (
          transferencias.map((transferencia) => (
            <div key={transferencia.idTransferencia} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Transferencia #{transferencia.idTransferencia}
                  </h3>
                  <p className="text-sm text-gray-600">
                    De <span className="font-semibold">{transferencia.bodegaOrigen}</span> a{' '}
                    <span className="font-semibold">{transferencia.bodegaDestino}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Usuario: {transferencia.nombreUsuario}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                      transferencia.estado
                    )}`}
                  >
                    {transferencia.estado}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(transferencia.fechaSolicitud).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>

              {transferencia.observaciones && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Observaciones:</span>{' '}
                  {transferencia.observaciones}
                </p>
              )}

              {/* Detalles */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Productos:</h4>
                <div className="space-y-2">
                  {transferencia.detalles.map((detalle) => (
                    <div
                      key={detalle.idDetalleTransferencia}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {detalle.nombreProducto} ({detalle.codigoBarras})
                      </span>
                      <span className="font-semibold">x{detalle.cantidad}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-2 mt-4">
                {transferencia.estado === 'PENDIENTE' && (
                  <button
                    onClick={() => handleProcesar(transferencia.idTransferencia)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Procesar
                  </button>
                )}
                {transferencia.estado === 'PROCESADO' && (
                  <button
                    onClick={() => handleRecibir(transferencia.idTransferencia)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Recibir
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Nueva Transferencia */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nueva Transferencia</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bodega Origen
                  </label>
                  <select
                    value={formData.idBodegaOrigen}
                    onChange={(e) =>
                      setFormData({ ...formData, idBodegaOrigen: Number(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {bodegas.map((bodega) => (
                      <option key={bodega.idBodega} value={bodega.idBodega}>
                        {bodega.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bodega Destino
                  </label>
                  <select
                    value={formData.idBodegaDestino}
                    onChange={(e) =>
                      setFormData({ ...formData, idBodegaDestino: Number(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {bodegas
                      .filter((b) => b.idBodega !== formData.idBodegaOrigen)
                      .map((bodega) => (
                        <option key={bodega.idBodega} value={bodega.idBodega}>
                          {bodega.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* Agregar Productos */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Productos a Transferir</h3>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="col-span-2">
                    <select
                      value={detalleActual.idProducto}
                      onChange={(e) =>
                        setDetalleActual({
                          ...detalleActual,
                          idProducto: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Seleccione producto...</option>
                      {productos.map((prod) => (
                        <option key={prod.idProducto} value={prod.idProducto}>
                          {prod.nombre} - {prod.codigoBarras}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={detalleActual.cantidad || ''}
                    onChange={(e) =>
                      setDetalleActual({
                        ...detalleActual,
                        cantidad: Number(e.target.value),
                      })
                    }
                    placeholder="Cantidad"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  + Agregar Producto
                </button>

                {/* Lista de Productos Agregados */}
                {formData.detalles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.detalles.map((detalle, index) => {
                      const producto = productos.find((p) => p.idProducto === detalle.idProducto);
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">
                            {producto?.nombre} x{detalle.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => eliminarDetalle(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Transferencia'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


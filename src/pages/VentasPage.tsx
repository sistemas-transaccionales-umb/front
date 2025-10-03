import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { ventasService, clientesService } from '../services';
import type { Venta } from '../services/ventas.service';
import type { Cliente } from '../services/clientes.service';

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    idCliente: 0,
    estadoPago: '',
  });

  useEffect(() => {
    loadVentas();
    loadClientes();
  }, []);

  const loadVentas = async () => {
    try {
      setLoading(true);
      const data = await ventasService.obtenerTodas();
      setVentas(data);
    } catch (error) {
      console.error('Error cargando ventas:', error);
      toast.error('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await clientesService.obtenerTodos();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const handleFiltrar = async () => {
    try {
      setLoading(true);
      if (filtros.fechaInicio && filtros.fechaFin) {
        const data = await ventasService.obtenerPorPeriodo(
          filtros.fechaInicio,
          filtros.fechaFin
        );
        setVentas(data);
      } else if (filtros.idCliente > 0) {
        const data = await ventasService.obtenerPorCliente(filtros.idCliente);
        setVentas(data);
      } else {
        loadVentas();
      }
    } catch (error) {
      console.error('Error filtrando ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarEstado = async (idVenta: number, nuevoEstado: string) => {
    try {
      await ventasService.actualizarEstadoPago(idVenta, nuevoEstado);
      toast.success('Estado actualizado exitosamente');
      loadVentas();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const verDetalle = (venta: Venta) => {
    setSelectedVenta(venta);
    setShowDetalleModal(true);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PAGADO':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ventasFiltradas = ventas.filter((venta) => {
    if (filtros.estadoPago && venta.estadoPago !== filtros.estadoPago) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Ventas</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select
              value={filtros.idCliente}
              onChange={(e) => setFiltros({ ...filtros, idCliente: Number(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={0}>Todos los clientes</option>
              {clientes.map((cliente) => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.nombre} {cliente.apellidos}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado de Pago
            </label>
            <select
              value={filtros.estadoPago}
              onChange={(e) => setFiltros({ ...filtros, estadoPago: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADO">Pagado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleFiltrar}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
          Buscar
        </button>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((venta) => (
                  <tr key={venta.idVenta} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {venta.numeroFactura}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(venta.fechaVenta).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {venta.nombreCliente}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {venta.nombreUsuario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      ${venta.totalVenta.toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                          venta.estadoPago
                        )}`}
                      >
                        {venta.estadoPago}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => verDetalle(venta)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <DocumentTextIcon className="h-5 w-5 inline" />
                      </button>
                      {venta.estadoPago === 'PENDIENTE' && (
                        <button
                          onClick={() => handleActualizarEstado(venta.idVenta, 'PAGADO')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircleIcon className="h-5 w-5 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {showDetalleModal && selectedVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold">Factura: {selectedVenta.numeroFactura}</h2>
              <p className="text-sm text-gray-600">
                Fecha: {new Date(selectedVenta.fechaVenta).toLocaleString('es-CO')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Cliente</h3>
                <p>{selectedVenta.nombreCliente}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Vendedor</h3>
                <p>{selectedVenta.nombreUsuario}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Estado</h3>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                    selectedVenta.estadoPago
                  )}`}
                >
                  {selectedVenta.estadoPago}
                </span>
              </div>
              {selectedVenta.olaCode && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Código OLA</h3>
                  <p>{selectedVenta.olaCode}</p>
                </div>
              )}
            </div>

            {selectedVenta.observaciones && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-1">Observaciones</h3>
                <p className="text-sm text-gray-600">{selectedVenta.observaciones}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Detalles de la Venta</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      Subtotal
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      IVA
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedVenta.detalles.map((detalle) => (
                    <tr key={detalle.idDetalleVenta}>
                      <td className="px-4 py-2 text-sm">
                        {detalle.nombreProducto}
                        <br />
                        <span className="text-xs text-gray-500">{detalle.codigoBarras}</span>
                      </td>
                      <td className="px-4 py-2 text-sm">{detalle.cantidad}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        ${detalle.precioUnitario.toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        ${detalle.subtotalLinea?.toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        ${detalle.totalIvaLinea?.toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold">
                        ${detalle.totalLinea?.toLocaleString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-end space-y-2">
                <div className="w-64 space-y-2">
                  {selectedVenta.totalDescuento > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Descuento:</span>
                      <span className="text-red-600">
                        -${selectedVenta.totalDescuento.toLocaleString('es-CO')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-blue-600">
                      ${selectedVenta.totalVenta.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowDetalleModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


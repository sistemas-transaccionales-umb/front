import { useEffect, useState } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import {
  comprasService,
  proveedoresService,
  productosService,
  bodegasService,
} from '../services';
import type {
  Compra,
  CreateCompraRequest,
  DetalleCompraRequest,
  Proveedor,
  Producto,
  Bodega,
} from '../services';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedAction } from '../components/auth/ProtectedAction';
import { Permission } from '../types/permissions';

interface DetalleConCalculo extends DetalleCompraRequest {
  subtotalLinea: number;
  ivaLinea: number;
  totalLinea: number;
  porcentajeIva: number;
}

export default function ComprasPage() {
  const { user } = useAuth();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Formulario de compra
  const [formData, setFormData] = useState<CreateCompraRequest>({
    idProveedor: 0,
    idUsuario: user?.idUsuario || 0,
    numeroCompra: '',
    fechaCompra: new Date().toISOString().split('T')[0],
    observaciones: '',
    detalles: [],
  });

  // Detalle actual para agregar
  const [detalleActual, setDetalleActual] = useState<DetalleCompraRequest>({
    idProducto: 0,
    idBodega: 0,
    cantidad: 1,
    precioUnitarioCompra: 0,
  });

  useEffect(() => {
    loadCompras();
    loadProveedores();
    loadProductos();
    loadBodegas();
  }, []);

  const loadCompras = async () => {
    try {
      setLoading(true);
      const data = await comprasService.obtenerTodas();
      setCompras(data);
    } catch (error) {
      console.error('Error cargando compras:', error);
      toast.error('Error al cargar compras');
    } finally {
      setLoading(false);
    }
  };

  const loadProveedores = async () => {
    try {
      const data = await proveedoresService.obtenerActivos();
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
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

  const loadBodegas = async () => {
    try {
      const data = await bodegasService.obtenerActivas();
      setBodegas(data);
    } catch (error) {
      console.error('Error cargando bodegas:', error);
    }
  };

  const generateNumeroCompra = () => {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `COMP-${year}-${timestamp}`;
  };

  const calcularDetalleConTotales = (
    detalle: DetalleCompraRequest
  ): DetalleConCalculo => {
    const producto = productos.find((p) => p.idProducto === detalle.idProducto);
    const porcentajeIva = producto?.porcentajeIva || 0;
    const subtotal = detalle.cantidad * detalle.precioUnitarioCompra;
    const iva = subtotal * (porcentajeIva / 100);
    const total = subtotal + iva;

    return {
      ...detalle,
      subtotalLinea: subtotal,
      ivaLinea: iva,
      totalLinea: total,
      porcentajeIva,
    };
  };

  const calcularTotalesGenerales = () => {
    const detallesConCalculo = formData.detalles.map(calcularDetalleConTotales);
    return detallesConCalculo.reduce(
      (acc, detalle) => ({
        subtotal: acc.subtotal + detalle.subtotalLinea,
        iva: acc.iva + detalle.ivaLinea,
        total: acc.total + detalle.totalLinea,
      }),
      { subtotal: 0, iva: 0, total: 0 }
    );
  };

  const agregarDetalle = () => {
    if (detalleActual.idProducto === 0) {
      toast.warning('Seleccione un producto');
      return;
    }
    if (detalleActual.idBodega === 0) {
      toast.warning('Seleccione una bodega');
      return;
    }
    if (detalleActual.cantidad <= 0) {
      toast.warning('La cantidad debe ser mayor a 0');
      return;
    }
    if (detalleActual.precioUnitarioCompra <= 0) {
      toast.warning('El precio debe ser mayor a 0');
      return;
    }

    setFormData({
      ...formData,
      detalles: [...formData.detalles, { ...detalleActual }],
    });

    setDetalleActual({
      idProducto: 0,
      idBodega: 0,
      cantidad: 1,
      precioUnitarioCompra: 0,
    });
  };

  const eliminarDetalle = (index: number) => {
    setFormData({
      ...formData,
      detalles: formData.detalles.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.detalles.length === 0) {
      toast.warning('Debe agregar al menos un producto');
      return;
    }

    try {
      setLoading(true);
      await comprasService.crear(formData);
      toast.success('Compra creada exitosamente');
      setShowModal(false);
      resetForm();
      loadCompras();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Error al crear compra');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      idProveedor: 0,
      idUsuario: user?.idUsuario || 0,
      numeroCompra: '',
      fechaCompra: new Date().toISOString().split('T')[0],
      observaciones: '',
      detalles: [],
    });
    setDetalleActual({
      idProducto: 0,
      idBodega: 0,
      cantidad: 1,
      precioUnitarioCompra: 0,
    });
  };

  const handleRecibirCompra = async (id: number) => {
    if (
      !window.confirm(
        '¿Confirma que recibió la mercancía? El stock se ingresará automáticamente al inventario.'
      )
    )
      return;

    try {
      await comprasService.recibir(id);
      toast.success('Compra recibida exitosamente. Stock actualizado.');
      loadCompras();
      if (selectedCompra && selectedCompra.idCompra === id) {
        const compraActualizada = await comprasService.obtenerPorId(id);
        setSelectedCompra(compraActualizada);
      }
    } catch (error) {
      toast.error('Error al recibir la compra');
    }
  };

  const handleCancelarCompra = async (id: number) => {
    const motivo = window.prompt('Ingrese el motivo de la cancelación:');
    if (!motivo) return;

    try {
      await comprasService.cancelar(id, motivo);
      toast.success('Compra cancelada exitosamente');
      loadCompras();
      if (selectedCompra && selectedCompra.idCompra === id) {
        const compraActualizada = await comprasService.obtenerPorId(id);
        setSelectedCompra(compraActualizada);
      }
    } catch (error) {
      toast.error('Error al cancelar la compra');
    }
  };

  const verDetalle = async (compra: Compra) => {
    setSelectedCompra(compra);
    setShowDetalleModal(true);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RECIBIDA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const comprasFiltradas = compras.filter((compra) => {
    if (filtroEstado && compra.estado !== filtroEstado) return false;
    if (
      searchTerm &&
      !compra.numeroCompra.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !compra.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const totales = calcularTotalesGenerales();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Compras</h1>
        <ProtectedAction permission={Permission.COMPRAS_CREAR}>
          <button
            onClick={() => {
              resetForm();
              setFormData((prev) => ({
                ...prev,
                numeroCompra: generateNumeroCompra(),
              }));
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Compra
          </button>
        </ProtectedAction>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número de compra o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="RECIBIDA">Recibidas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Compras */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
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
              ) : comprasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay compras registradas
                  </td>
                </tr>
              ) : (
                comprasFiltradas.map((compra) => (
                  <tr key={compra.idCompra} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {compra.numeroCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(compra.fechaCompra).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {compra.proveedor.nombre}
                      </div>
                      <div className="text-xs text-gray-500">{compra.proveedor.nitRuc}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      ${compra.totalCompra.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                          compra.estado
                        )}`}
                      >
                        {compra.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {compra.usuario.nombres} {compra.usuario.apellidos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => verDetalle(compra)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalle"
                      >
                        <DocumentTextIcon className="h-5 w-5 inline" />
                      </button>
                      {compra.estado === 'PENDIENTE' && (
                        <>
                          <ProtectedAction permission={Permission.COMPRAS_RECIBIR}>
                            <button
                              onClick={() => handleRecibirCompra(compra.idCompra)}
                              className="text-green-600 hover:text-green-900"
                              title="Recibir mercancía"
                            >
                              <CheckCircleIcon className="h-5 w-5 inline" />
                            </button>
                          </ProtectedAction>
                          <ProtectedAction permission={Permission.COMPRAS_CANCELAR}>
                            <button
                              onClick={() => handleCancelarCompra(compra.idCompra)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancelar compra"
                            >
                              <NoSymbolIcon className="h-5 w-5 inline" />
                            </button>
                          </ProtectedAction>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nueva Compra - Continuará en el siguiente mensaje... */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nueva Compra</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sección 1: Datos Generales */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Datos Generales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Número de Compra <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.numeroCompra}
                      onChange={(e) =>
                        setFormData({ ...formData, numeroCompra: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Proveedor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.idProveedor}
                      onChange={(e) =>
                        setFormData({ ...formData, idProveedor: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccione proveedor...</option>
                      {proveedores.map((prov) => (
                        <option key={prov.idProveedor} value={prov.idProveedor}>
                          {prov.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de Compra <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fechaCompra}
                      onChange={(e) =>
                        setFormData({ ...formData, fechaCompra: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({ ...formData, observaciones: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>

              {/* Sección 2: Detalles de Compra */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Detalles de Compra</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Producto</label>
                    <select
                      value={detalleActual.idProducto}
                      onChange={(e) =>
                        setDetalleActual({
                          ...detalleActual,
                          idProducto: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Seleccione...</option>
                      {productos.map((prod) => (
                        <option key={prod.idProducto} value={prod.idProducto}>
                          {prod.nombre} - {prod.codigoBarras}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bodega</label>
                    <select
                      value={detalleActual.idBodega}
                      onChange={(e) =>
                        setDetalleActual({
                          ...detalleActual,
                          idBodega: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Seleccione...</option>
                      {bodegas.map((bod) => (
                        <option key={bod.idBodega} value={bod.idBodega}>
                          {bod.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={detalleActual.cantidad}
                      onChange={(e) =>
                        setDetalleActual({
                          ...detalleActual,
                          cantidad: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Precio Unit.
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={detalleActual.precioUnitarioCompra}
                      onChange={(e) =>
                        setDetalleActual({
                          ...detalleActual,
                          precioUnitarioCompra: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  + Agregar Producto
                </button>

                {/* Tabla de Productos Agregados */}
                {formData.detalles.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                            Producto
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                            Bodega
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                            Cant.
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                            Precio U.
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                            Subtotal
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                            IVA
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                            Total
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.detalles.map((detalle, index) => {
                          const detalleCalc = calcularDetalleConTotales(detalle);
                          const producto = productos.find(
                            (p) => p.idProducto === detalle.idProducto
                          );
                          const bodega = bodegas.find((b) => b.idBodega === detalle.idBodega);

                          return (
                            <tr key={index} className="text-sm">
                              <td className="px-3 py-2">{producto?.nombre}</td>
                              <td className="px-3 py-2">{bodega?.nombre}</td>
                              <td className="px-3 py-2 text-right">{detalle.cantidad}</td>
                              <td className="px-3 py-2 text-right">
                                ${detalle.precioUnitarioCompra.toLocaleString('es-CO')}
                              </td>
                              <td className="px-3 py-2 text-right">
                                ${detalleCalc.subtotalLinea.toLocaleString('es-CO')}
                              </td>
                              <td className="px-3 py-2 text-right">
                                ${detalleCalc.ivaLinea.toLocaleString('es-CO')}
                              </td>
                              <td className="px-3 py-2 text-right font-semibold">
                                ${detalleCalc.totalLinea.toLocaleString('es-CO')}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => eliminarDetalle(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XMarkIcon className="h-5 w-5 inline" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sección 3: Resumen */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Resumen de Compra</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${totales.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA:</span>
                    <span>${totales.iva.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-blue-600">
                      ${totales.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading || formData.detalles.length === 0}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Guardando...' : 'Guardar Compra'}
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

      {/* Modal de Detalle de Compra - Continuará... */}
      {showDetalleModal && selectedCompra && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold">
                Compra: {selectedCompra.numeroCompra}
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-600">Proveedor:</p>
                  <p className="font-semibold">{selectedCompra.proveedor.nombre}</p>
                  <p className="text-gray-500">{selectedCompra.proveedor.nitRuc}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha:</p>
                  <p className="font-semibold">
                    {new Date(selectedCompra.fechaCompra).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Usuario:</p>
                  <p className="font-semibold">
                    {selectedCompra.usuario.nombres} {selectedCompra.usuario.apellidos}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Estado:</p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                      selectedCompra.estado
                    )}`}
                  >
                    {selectedCompra.estado}
                  </span>
                </div>
              </div>
              {selectedCompra.observaciones && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm">Observaciones:</p>
                  <p className="text-sm">{selectedCompra.observaciones}</p>
                </div>
              )}
            </div>

            {/* Tabla de Detalles */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Productos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Producto
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Bodega
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        Cantidad
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        Precio U.
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
                    {selectedCompra.detalles.map((detalle) => (
                      <tr key={detalle.idDetalleCompra} className="text-sm">
                        <td className="px-4 py-2">
                          {detalle.producto.nombre}
                          <br />
                          <span className="text-xs text-gray-500">
                            {detalle.producto.codigoBarras}
                          </span>
                        </td>
                        <td className="px-4 py-2">{detalle.bodega.nombreBodega}</td>
                        <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                        <td className="px-4 py-2 text-right">
                          ${detalle.precioUnitarioCompra.toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-2 text-right">
                          ${detalle.subtotalLinea.toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-2 text-right">
                          ${detalle.totalIvaLinea.toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          ${detalle.totalLinea.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totales */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${selectedCompra.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA:</span>
                    <span>${selectedCompra.totalIva.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-blue-600">
                      ${selectedCompra.totalCompra.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-between mt-6 space-x-3">
              <button
                onClick={() => setShowDetalleModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
              {selectedCompra.estado === 'PENDIENTE' && (
                <div className="flex space-x-3">
                  <ProtectedAction permission={Permission.COMPRAS_RECIBIR}>
                    <button
                      onClick={() => {
                        handleRecibirCompra(selectedCompra.idCompra);
                        setShowDetalleModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Recibir Mercancía
                    </button>
                  </ProtectedAction>
                  <ProtectedAction permission={Permission.COMPRAS_CANCELAR}>
                    <button
                      onClick={() => {
                        handleCancelarCompra(selectedCompra.idCompra);
                        setShowDetalleModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancelar
                    </button>
                  </ProtectedAction>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


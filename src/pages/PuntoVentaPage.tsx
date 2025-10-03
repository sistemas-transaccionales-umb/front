import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { ventasService, clientesService, productosService, bodegasService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import type { CreateVentaRequest } from '../services/ventas.service';
import type { Cliente } from '../services/clientes.service';
import type { Producto } from '../services/productos.service';
import type { Bodega } from '../services/bodegas.service';

interface ItemVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export default function PuntoVentaPage() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedBodega, setSelectedBodega] = useState<number>(0);
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [searchProducto, setSearchProducto] = useState('');
  const [loading, setLoading] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    loadClientes();
    loadProductos();
    loadBodegas();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await clientesService.obtenerActivos();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
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
      if (data.length > 0) {
        setSelectedBodega(data[0].idBodega);
      }
    } catch (error) {
      console.error('Error cargando bodegas:', error);
    }
  };

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find((item) => item.producto.idProducto === producto.idProducto);
    if (itemExistente) {
      setCarrito(
        carrito.map((item) =>
          item.producto.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * producto.precioVenta }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          producto,
          cantidad: 1,
          subtotal: producto.precioVenta,
        },
      ]);
    }
  };

  const actualizarCantidad = (idProducto: number, delta: number) => {
    setCarrito(
      carrito
        .map((item) =>
          item.producto.idProducto === idProducto
            ? {
                ...item,
                cantidad: Math.max(0, item.cantidad + delta),
                subtotal: Math.max(0, item.cantidad + delta) * item.producto.precioVenta,
              }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (idProducto: number) => {
    setCarrito(carrito.filter((item) => item.producto.idProducto !== idProducto));
  };

  const calcularSubtotal = () => {
    return carrito.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calcularIVA = () => {
    return carrito.reduce((sum, item) => {
      const ivaLinea = (item.subtotal * item.producto.porcentajeIva) / 100;
      return sum + ivaLinea;
    }, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA() - descuento;
  };

  const handleFinalizarVenta = async () => {
    if (!selectedCliente) {
      toast.warning('Debe seleccionar un cliente');
      return;
    }
    if (!selectedBodega) {
      toast.warning('Debe seleccionar una bodega');
      return;
    }
    if (carrito.length === 0) {
      toast.warning('El carrito está vacío');
      return;
    }

    try {
      setLoading(true);
      const ventaData: CreateVentaRequest = {
        idCliente: selectedCliente.idCliente,
        idUsuario: user?.idUsuario || 0,
        numeroFactura: `FAC-${Date.now()}`,
        totalDescuento: descuento,
        observaciones: observaciones,
        olaCode: '',
        detalles: carrito.map((item) => ({
          idProducto: item.producto.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precioVenta,
        })),
      };

      await ventasService.crear(ventaData);
      toast.success('Venta realizada exitosamente');
      
      // Limpiar formulario
      setCarrito([]);
      setSelectedCliente(null);
      setDescuento(0);
      setObservaciones('');
      setSearchProducto('');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Error al realizar la venta');
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
      p.codigoBarras.includes(searchProducto)
  );

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Punto de Venta</h1>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de Productos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto por nombre o código de barras..."
                value={searchProducto}
                onChange={(e) => setSearchProducto(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar Bodega
              </label>
              <select
                value={selectedBodega}
                onChange={(e) => setSelectedBodega(Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {bodegas.map((bodega) => (
                  <option key={bodega.idBodega} value={bodega.idBodega}>
                    {bodega.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              {productosFiltrados.map((producto) => (
                <button
                  key={producto.idProducto}
                  onClick={() => agregarAlCarrito(producto)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                >
                  <h3 className="font-semibold text-sm mb-1">{producto.nombre}</h3>
                  <p className="text-xs text-gray-500 mb-2">{producto.codigoBarras}</p>
                  <p className="text-lg font-bold text-blue-600">
                    ${producto.precioVenta.toLocaleString('es-CO')}
                  </p>
                  <p className="text-xs text-gray-500">IVA: {producto.porcentajeIva}%</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Carrito y Resumen */}
        <div className="space-y-4">
          {/* Cliente */}
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
            <select
              value={selectedCliente?.idCliente || ''}
              onChange={(e) => {
                const cliente = clientes.find((c) => c.idCliente === Number(e.target.value));
                setSelectedCliente(cliente || null);
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.nombre} {cliente.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Carrito */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Carrito ({carrito.length})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {carrito.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Carrito vacío</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.producto.idProducto} className="border-b pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.producto.nombre}</p>
                        <p className="text-xs text-gray-500">
                          ${item.producto.precioVenta.toLocaleString('es-CO')} c/u
                        </p>
                      </div>
                      <button
                        onClick={() => eliminarDelCarrito(item.producto.idProducto)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => actualizarCantidad(item.producto.idProducto, -1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(item.producto.idProducto, 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="font-semibold">
                        ${item.subtotal.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calcularSubtotal().toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA:</span>
                <span>${calcularIVA().toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Descuento:</span>
                <input
                  type="number"
                  value={descuento}
                  onChange={(e) => setDescuento(Number(e.target.value))}
                  className="w-24 text-right border rounded px-2 py-1"
                  min="0"
                />
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span className="text-blue-600">${calcularTotal().toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
                placeholder="Notas adicionales..."
              />
            </div>

            <button
              onClick={handleFinalizarVenta}
              disabled={loading || carrito.length === 0 || !selectedCliente}
              className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Procesando...' : 'Finalizar Venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


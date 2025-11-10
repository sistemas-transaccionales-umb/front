import { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { inventarioService, bodegasService } from '../services';
import type { Inventario } from '../services/inventario.service';
import type { Bodega } from '../services/bodegas.service';

export default function InventarioPage() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBodega, setSelectedBodega] = useState<number | 'all'>('all');
  const showStockBajo = false;
  //const [showStockBajo, setShowStockBajo] = useState(false);
  const [showAjusteModal, setShowAjusteModal] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState<Inventario | null>(null);
  const [ajusteData, setAjusteData] = useState({
    cantidad: 0,
    motivo: '',
  });

  useEffect(() => {
    loadBodegas();
    loadInventario();
  }, [selectedBodega, showStockBajo]);

  const loadBodegas = async () => {
    try {
      const data = await bodegasService.obtenerActivas();
      setBodegas(data);
    } catch (error) {
      console.error('Error cargando bodegas:', error);
    }
  };

  const loadInventario = async () => {
    try {
      setLoading(true);
      if (showStockBajo) {
        const data = await inventarioService.obtenerStockBajo();
        setInventario(data);
      } else if (selectedBodega === 'all') {
        const data = await inventarioService.obtenerTodo();
        setInventario(data);
      } else {
        const data = await inventarioService.obtenerPorBodega(Number(selectedBodega));
        setInventario(data);
      }
    } catch (error) {
      console.error('Error cargando inventario:', error);
      toast.error('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleAjustar = (item: Inventario) => {
    setSelectedInventario(item);
    setAjusteData({ cantidad: 0, motivo: '' });
    setShowAjusteModal(true);
  };

  const handleSubmitAjuste = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventario) return;

    try {
      setLoading(true);
      // Necesitaremos extraer el idProducto y idBodega del inventario
      await inventarioService.ajustar({
        idProducto: selectedInventario.idInventario, // Esto debería ser el idProducto real
        idBodega: selectedInventario.idInventario, // Esto debería ser el idBodega real
        cantidad: ajusteData.cantidad,
        motivo: ajusteData.motivo,
      });
      toast.success('Ajuste realizado exitosamente');
      setShowAjusteModal(false);
      loadInventario();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Error al realizar ajuste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Control de Inventario</h1>
        {/*  
        <div className="flex space-x-3">
          <button
            onClick={() => setShowStockBajo(!showStockBajo)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              showStockBajo
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            {showStockBajo ? 'Mostrar Todo' : 'Stock Bajo'}
          </button>
        </div>
        */}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Bodega
            </label>
            <select
              value={selectedBodega}
              onChange={(e) =>
                setSelectedBodega(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={showStockBajo}
            >
              <option value="all">Todas las Bodegas</option>
              {bodegas.map((bodega) => (
                <option key={bodega.idBodega} value={bodega.idBodega}>
                  {bodega.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código de Barras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bodega
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : inventario.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No hay registros de inventario
                  </td>
                </tr>
              ) : (
                inventario.map((item) => (
                  <tr
                    key={item.idInventario}
                    className={`hover:bg-gray-50 ${item.stockBajo ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.nombreProducto}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {item.codigoBarras}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.nombreBodega}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-lg font-bold ${
                          item.stockBajo ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {item.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stockMinimo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.stockBajo ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.fechaActualizacion).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleAjustar(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <AdjustmentsHorizontalIcon className="h-5 w-5 inline mr-1" />
                        Ajustar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Ajuste */}
      {showAjusteModal && selectedInventario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Ajustar Inventario</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Producto</p>
              <p className="font-semibold">{selectedInventario.nombreProducto}</p>
              <p className="text-sm text-gray-600 mt-2">Bodega</p>
              <p className="font-semibold">{selectedInventario.nombreBodega}</p>
              <p className="text-sm text-gray-600 mt-2">Stock Actual</p>
              <p className="text-2xl font-bold text-blue-600">
                {selectedInventario.cantidad}
              </p>
            </div>
            <form onSubmit={handleSubmitAjuste} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad a Ajustar
                </label>
                <input
                  type="number"
                  value={ajusteData.cantidad}
                  onChange={(e) =>
                    setAjusteData({ ...ajusteData, cantidad: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Usar negativo para restar"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Nuevo stock:{' '}
                  {selectedInventario.cantidad + ajusteData.cantidad}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Motivo</label>
                <textarea
                  value={ajusteData.motivo}
                  onChange={(e) =>
                    setAjusteData({ ...ajusteData, motivo: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  rows={3}
                  placeholder="Explique la razón del ajuste"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Ajustando...' : 'Confirmar Ajuste'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAjusteModal(false)}
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


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingCartIcon, 
  CubeIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { inventarioService, ventasService } from '../services';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    productosStockBajo: 0,
    ventasHoy: 0,
    totalVentasHoy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Stock bajo
      const stockBajo = await inventarioService.obtenerStockBajo();
      
      // Ventas de hoy
      const hoy = new Date();
      const inicioHoy = new Date(hoy.setHours(0, 0, 0, 0)).toISOString();
      const finHoy = new Date(hoy.setHours(23, 59, 59, 999)).toISOString();
      const ventasHoy = await ventasService.obtenerPorPeriodo(inicioHoy, finHoy);
      
      const totalVentas = ventasHoy.reduce((sum, venta) => sum + venta.totalVenta, 0);

      setStats({
        productosStockBajo: stockBajo.length,
        ventasHoy: ventasHoy.length,
        totalVentasHoy: totalVentas,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Productos',
      icon: CubeIcon,
      color: 'bg-blue-500',
      link: '/productos',
      description: 'Gestionar catálogo',
    },
    {
      title: 'Inventario',
      icon: ChartBarIcon,
      color: 'bg-green-500',
      link: '/inventario',
      description: 'Control de stock',
    },
    {
      title: 'Punto de Venta',
      icon: ShoppingCartIcon,
      color: 'bg-purple-500',
      link: '/punto-venta',
      description: 'Registrar ventas',
    },
    {
      title: 'Clientes',
      icon: UsersIcon,
      color: 'bg-yellow-500',
      link: '/clientes',
      description: 'Base de clientes',
    },
    {
      title: 'Bodegas',
      icon: BuildingStorefrontIcon,
      color: 'bg-indigo-500',
      link: '/bodegas',
      description: 'Ubicaciones',
    },
    {
      title: 'Transferencias',
      icon: ArrowTrendingUpIcon,
      color: 'bg-pink-500',
      link: '/transferencias',
      description: 'Entre bodegas',
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('es-CO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
  )
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('es-CO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : stats.ventasHoy}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingCartIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ventas Hoy</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : `$${stats.totalVentasHoy.toLocaleString('es-CO')}`}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BanknotesIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {loading ? '...' : stats.productosStockBajo}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          {stats.productosStockBajo > 0 && (
            <Link 
              to="/inventario?filter=stock-bajo" 
              className="text-sm text-red-600 hover:text-red-700 mt-2 inline-block"
            >
              Ver productos →
            </Link>
          )}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`${card.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="text-center py-8 text-gray-500">
          <ChartBarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>Las actividades recientes aparecerán aquí</p>
        </div>
      </div>
    </div>
  );
}


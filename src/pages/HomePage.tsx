import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Users, TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Usuarios Activos',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Transacciones Hoy',
      value: '89',
      change: '+5%',
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      title: 'Crecimiento',
      value: '23%',
      change: '+8%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Eventos',
      value: '12',
      change: '+3',
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'success',
      message: 'Transacción completada exitosamente',
      time: 'Hace 5 minutos',
    },
    {
      id: 2,
      type: 'warning',
      message: 'Sistema programado para mantenimiento',
      time: 'Hace 1 hora',
    },
    {
      id: 3,
      type: 'success',
      message: 'Nuevo usuario registrado',
      time: 'Hace 2 horas',
    },
    {
      id: 4,
      type: 'success',
      message: 'Actualización de datos completada',
      time: 'Hace 3 horas',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido{user?.nombres ? `, ${user.nombres}` : ''}!
        </h1>
        <p className="text-blue-100">
          Este es tu panel de control. Aquí puedes ver un resumen de la actividad del sistema.
        </p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {activity.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel lateral - Información del usuario */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tu Perfil
          </h2>
            <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.nombres?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.nombres ? `${user.nombres} ${user.apellidos}` : 'Usuario'}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.email || 'email@example.com'}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Rol</p>
                  <p className="font-medium text-gray-900">
                    {user?.nombreRol || 'Usuario'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user?.estado === 'ACTIVO' ? 'Activo' : user?.estado || 'Activo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de acciones rápidas */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
            <Activity className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Ver Reportes</h3>
            <p className="text-sm text-gray-600 mt-1">
              Accede a los reportes del sistema
            </p>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
            <Users className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Gestionar Usuarios</h3>
            <p className="text-sm text-gray-600 mt-1">
              Administra los usuarios del sistema
            </p>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
            <Calendar className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Ver Calendario</h3>
            <p className="text-sm text-gray-600 mt-1">
              Consulta eventos programados
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};


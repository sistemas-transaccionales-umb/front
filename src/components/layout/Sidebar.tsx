import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  TagIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  items?: NavigationItem[];
  roles?: number[]; // Roles permitidos: 1=Admin, 2=Vendedor, 3=Almacenista
}

const allNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: [1, 2, 3] },
  { 
    name: 'Administración', 
    items: [
      { name: 'Usuarios', href: '/usuarios', icon: UsersIcon, roles: [1] },
      { name: 'Clientes', href: '/clientes', icon: UserGroupIcon, roles: [1, 2] },
      { name: 'Bodegas', href: '/bodegas', icon: BuildingStorefrontIcon, roles: [1, 3] },
      { name: 'Categorías', href: '/categorias', icon: TagIcon, roles: [1, 3] },
    ]
  },
  { 
    name: 'Inventario', 
    items: [
      { name: 'Productos', href: '/productos', icon: CubeIcon, roles: [1, 2, 3] },
      { name: 'Control de Stock', href: '/inventario', icon: ChartBarIcon, roles: [1, 3] },
      { name: 'Transferencias', href: '/transferencias', icon: ArrowsRightLeftIcon, roles: [1, 3] },
    ]
  },
  { 
    name: 'Ventas', 
    items: [
      { name: 'Punto de Venta', href: '/punto-venta', icon: ShoppingCartIcon, roles: [1, 2] },
      { name: 'Historial de Ventas', href: '/ventas', icon: DocumentTextIcon, roles: [1, 2] },
    ]
  },
];

interface SidebarProps {
  onClose: () => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, isMobile }) => {
  const { user } = useAuth();

  // Filtrar navegación según el rol del usuario
  const navigation = useMemo(() => {
    if (!user) return [];

    return allNavigation
      .map((section) => {
        if (section.items) {
          // Filtrar items de la sección
          const filteredItems = section.items.filter((item) =>
            item.roles?.includes(user.idRol)
          );
          // Solo mostrar la sección si tiene items visibles
          return filteredItems.length > 0
            ? { ...section, items: filteredItems }
            : null;
        }
        // Item individual
        return section.roles?.includes(user.idRol) ? section : null;
      })
      .filter((section): section is NavigationItem => section !== null);
  }, [user]);
  return (
    <div className={`${isMobile ? 'w-64' : 'w-64'} bg-white shadow-sm border-r border-gray-200 min-h-screen`}>
      {/* Mobile header with close button */}
      {isMobile && (
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      <nav className={`${isMobile ? 'mt-0' : 'mt-5'} px-2`}>
        <div className="space-y-1">
          {navigation.map((section) => (
            <div key={section.name}>
              {section.href && section.icon ? (
                // Single item (Dashboard)
                <NavLink
                  to={section.href}
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <section.icon
                    className="mr-3 h-5 w-5 flex-shrink-0"
                    aria-hidden={true}
                  />
                  {section.name}
                </NavLink>
              ) : section.items ? (
                // Section with multiple items
                <div className="mt-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {section.items?.map((item) => {
                      if (!item.href || !item.icon) return null;
                      return (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={isMobile ? onClose : undefined}
                          className={({ isActive }) =>
                            `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                              isActive
                                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                        >
                          <item.icon
                            className="mr-3 h-5 w-5 flex-shrink-0"
                            aria-hidden={true}
                          />
                          {item.name}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile footer info */}
      {isMobile && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Sistema de Gestión v1.0
          </p>
        </div>
      )}
    </div>
  );
}; 
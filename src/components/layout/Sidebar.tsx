import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Stethoscope, 
  FileText, 
  X
} from 'lucide-react';

const navigation = [
  { name: 'Pacientes', href: '/pacientes', icon: Users },
  { name: 'Nuevo Diagnóstico', href: '/diagnostico', icon: Stethoscope },
  { name: 'Historial', href: '/historial', icon: FileText },
];

interface SidebarProps {
  onClose: () => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, isMobile }) => {
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
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      <nav className={`${isMobile ? 'mt-0' : 'mt-5'} px-2`}>
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile footer info */}
      {isMobile && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Sistema Para Pymes v1.0
          </p>
        </div>
      )}
    </div>
  );
}; 
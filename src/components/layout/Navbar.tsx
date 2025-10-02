import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-3"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-blue-600">
                Sistema Para Pymes
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-700 truncate max-w-32 sm:max-w-none">
                  {user?.nombres} {user?.apellidos}
                </span>
                {user?.nombreRol && (
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    - {user.nombreRol}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-gray-700 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
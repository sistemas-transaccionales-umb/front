import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Permission } from '../../types/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Permiso(s) requerido(s) para acceder a la ruta */
  requiredPermission?: Permission | Permission[] | string | string[];
  /** Si se especifica, requiere AL MENOS UNO de estos permisos */
  anyPermission?: Permission[] | string[];
  /** Si se especifica, requiere TODOS estos permisos */
  allPermissions?: Permission[] | string[];
  /** Ruta a la que redirigir si no tiene permisos (por defecto: /dashboard) */
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  anyPermission,
  allPermissions,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { can, canAny, canAll } = usePermissions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar permisos si se especificaron
  if (requiredPermission !== undefined || anyPermission !== undefined || allPermissions !== undefined) {
    let hasRequiredPermission = false;

    if (requiredPermission !== undefined) {
      hasRequiredPermission = can(requiredPermission);
    } else if (anyPermission !== undefined) {
      hasRequiredPermission = canAny(anyPermission);
    } else if (allPermissions !== undefined) {
      hasRequiredPermission = canAll(allPermissions);
    }

    if (!hasRequiredPermission) {
      return (
        <Navigate 
          to={redirectTo} 
          replace 
          state={{ 
            message: 'No tienes permisos para acceder a esta página',
            type: 'error' 
          }} 
        />
      );
    }
  }

  return <>{children}</>;
}; 
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Permission } from '../../types/permissions';

interface ProtectedActionProps {
  /** Permiso(s) requerido(s) para mostrar el elemento */
  permission?: Permission | Permission[] | string | string[];
  /** Si se especifica, requiere AL MENOS UNO de estos permisos */
  anyPermission?: Permission[] | string[];
  /** Si se especifica, requiere TODOS estos permisos */
  allPermissions?: Permission[] | string[];
  /** Contenido a mostrar si el usuario tiene los permisos */
  children: React.ReactNode;
  /** Contenido alternativo a mostrar si el usuario NO tiene los permisos */
  fallback?: React.ReactNode;
  /** Si es true, renderiza un elemento vacío en lugar de null cuando no tiene permisos */
  keepSpace?: boolean;
}

/**
 * Componente que condiciona la visibilidad de elementos UI basándose en permisos
 * 
 * @example
 * // Mostrar botón solo si tiene permiso de crear usuarios
 * <ProtectedAction permission={Permission.USUARIOS_CREAR}>
 *   <button>Crear Usuario</button>
 * </ProtectedAction>
 * 
 * @example
 * // Mostrar elemento si tiene al menos uno de los permisos
 * <ProtectedAction anyPermission={[Permission.USUARIOS_LEER, Permission.USUARIOS_CREAR]}>
 *   <UserList />
 * </ProtectedAction>
 * 
 * @example
 * // Mostrar elemento si tiene todos los permisos
 * <ProtectedAction allPermissions={[Permission.USUARIOS_LEER, Permission.USUARIOS_ACTUALIZAR]}>
 *   <EditUserForm />
 * </ProtectedAction>
 * 
 * @example
 * // Con contenido alternativo
 * <ProtectedAction 
 *   permission={Permission.USUARIOS_CREAR}
 *   fallback={<p>No tienes permiso para crear usuarios</p>}
 * >
 *   <button>Crear Usuario</button>
 * </ProtectedAction>
 */
export const ProtectedAction: React.FC<ProtectedActionProps> = ({
  permission,
  anyPermission,
  allPermissions,
  children,
  fallback = null,
  keepSpace = false,
}) => {
  const { can, canAny, canAll } = usePermissions();

  let hasRequiredPermission = false;

  // Verificar según el tipo de validación especificado
  if (permission !== undefined) {
    hasRequiredPermission = can(permission);
  } else if (anyPermission !== undefined) {
    hasRequiredPermission = canAny(anyPermission);
  } else if (allPermissions !== undefined) {
    hasRequiredPermission = canAll(allPermissions);
  } else {
    // Si no se especifica ningún permiso, por defecto muestra el contenido
    console.warn('ProtectedAction: No se especificó ningún permiso. El contenido se mostrará por defecto.');
    hasRequiredPermission = true;
  }

  if (hasRequiredPermission) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (keepSpace) {
    return <div style={{ display: 'none' }}></div>;
  }

  return null;
};


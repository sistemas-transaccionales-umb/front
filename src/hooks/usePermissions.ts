import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../types/permissions';

/**
 * Hook personalizado para verificación de permisos
 * Proporciona funciones para verificar si el usuario actual tiene determinados permisos
 */
export const usePermissions = () => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  /**
   * Verifica si el usuario tiene un permiso específico o al menos uno de un array de permisos
   * @param permission - Un permiso o array de permisos
   * @returns true si el usuario tiene el permiso (o al menos uno si es un array)
   */
  const can = (permission: Permission | Permission[] | string | string[]): boolean => {
    return hasPermission(permission as string | string[]);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   * @param permissions - Array de permisos
   * @returns true si el usuario tiene al menos uno de los permisos
   */
  const canAny = (permissions: Permission[] | string[]): boolean => {
    return hasAnyPermission(permissions as string[]);
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   * @param permissions - Array de permisos
   * @returns true si el usuario tiene todos los permisos
   */
  const canAll = (permissions: Permission[] | string[]): boolean => {
    return hasAllPermissions(permissions as string[]);
  };

  /**
   * Verifica si el usuario NO tiene un permiso específico
   * @param permission - Un permiso o array de permisos
   * @returns true si el usuario NO tiene el permiso
   */
  const cannot = (permission: Permission | Permission[] | string | string[]): boolean => {
    return !hasPermission(permission as string | string[]);
  };

  /**
   * Obtiene la lista de permisos del usuario actual
   * @returns Array de strings con los permisos del usuario
   */
  const getUserPermissions = (): string[] => {
    return user?.permisos || [];
  };

  return {
    can,
    canAny,
    canAll,
    cannot,
    getUserPermissions,
  };
};


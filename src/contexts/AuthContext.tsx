import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { AuthContextType, User, LoginRequest, RegisterRequest, RegisterResponse } from '../types/auth';
import { authService } from '../services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if(response.token){
        // Extraer solo los datos del usuario incluyendo permisos
        const userData: User = {
          idUsuario: response.idUsuario,
          nombres: response.nombres,
          apellidos: response.apellidos,
          email: response.email,
          tipoDocumento: response.tipoDocumento,
          numeroDocumento: response.numeroDocumento,
          telefono: response.telefono,
          idRol: response.idRol,
          nombreRol: response.nombreRol,
          estado: response.estado,
          permisos: response.permisos || [],
        };
        
        setUser(userData);
        setToken(response.token);
        authService.storeAuth(response.token, userData);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      console.log(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  // Funciones de verificación de permisos
  const hasPermission = (permission: string | string[]): boolean => {
    if (!user || !user.permisos) return false;
    
    if (Array.isArray(permission)) {
      // Si se pasa un array, verifica que tenga al menos uno de los permisos
      return permission.some(p => user.permisos.includes(p));
    }
    
    return user.permisos.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permisos) return false;
    return permissions.some(p => user.permisos.includes(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permisos) return false;
    return permissions.every(p => user.permisos.includes(p));
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }), [user, token, isLoading, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
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
        // Extraer solo los datos del usuario sin campos de autenticación
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

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated,
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
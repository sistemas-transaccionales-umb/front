export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  farmacia?: string;
  licencia?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  idRol: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface AuthResponse {
  farmaceutico: User;
  access_token: string;
}

export interface RegisterResponse {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  idRol: number;
  nombreRol: string;
  estado: string;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
} 
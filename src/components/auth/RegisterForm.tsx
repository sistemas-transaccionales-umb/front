import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import type { RegisterRequest } from '../../types/auth';
import { Eye, EyeOff, Mail, Lock, User, Phone, FileText, CreditCard, UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  idRol: yup.number().required('El rol es obligatorio'),
  tipoDocumento: yup.string()
    .required('El tipo de documento es obligatorio')
    .max(3, 'El tipo de documento no puede exceder 3 caracteres'),
  numeroDocumento: yup.string()
    .required('El número de documento es obligatorio')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  nombres: yup.string()
    .required('Los nombres son obligatorios')
    .max(100, 'Los nombres no pueden exceder 100 caracteres'),
  apellidos: yup.string()
    .required('Los apellidos son obligatorios')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres'),
  email: yup.string()
    .email('El email debe ser válido')
    .required('El email es obligatorio')
    .max(255, 'El email no puede exceder 255 caracteres'),
  password: yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  telefono: yup.string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional(),
}) as yup.ObjectSchema<RegisterRequest>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterRequest, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await registerUser(data);
      
      // Mostrar notificación de éxito
      toast.success(response.message || 'Usuario registrado exitosamente');
      
      // Esperar un momento para que el usuario vea la notificación
      setTimeout(() => {
        onSwitchToLogin();
      }, 1000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al registrarse');
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registro</h2>
        <p className="text-gray-600 mt-2">Crea tu cuenta</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="idRol" className="block text-sm font-medium text-gray-700 mb-1">
            Rol *
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              {...register('idRol', { valueAsNumber: true })}
              id="idRol"
              className="input-field pl-10"
            >
              <option value="">Seleccione un rol</option>
              <option value="1">Administrador</option>
              <option value="2">Usuario</option>
              <option value="3">Cliente</option>
            </select>
          </div>
          {errors.idRol && (
            <p className="text-red-600 text-sm mt-1">{errors.idRol.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                {...register('tipoDocumento')}
                id="tipoDocumento"
                className="input-field pl-10"
              >
                <option value="">Seleccione</option>
                <option value="CC">CC - Cédula de Ciudadanía</option>
                <option value="CE">CE - Cédula de Extranjería</option>
                <option value="PAS">PAS - Pasaporte</option>
                <option value="TI">TI - Tarjeta de Identidad</option>
              </select>
            </div>
            {errors.tipoDocumento && (
              <p className="text-red-600 text-sm mt-1">{errors.tipoDocumento.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('numeroDocumento')}
                type="text"
                id="numeroDocumento"
                className="input-field pl-10"
                placeholder="1234567890"
                maxLength={20}
              />
            </div>
            {errors.numeroDocumento && (
              <p className="text-red-600 text-sm mt-1">{errors.numeroDocumento.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
              Nombres *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('nombres')}
                type="text"
                id="nombres"
                className="input-field pl-10"
                placeholder="Juan Carlos"
                maxLength={100}
              />
            </div>
            {errors.nombres && (
              <p className="text-red-600 text-sm mt-1">{errors.nombres.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('apellidos')}
                type="text"
                id="apellidos"
                className="input-field pl-10"
                placeholder="Pérez García"
                maxLength={100}
              />
            </div>
            {errors.apellidos && (
              <p className="text-red-600 text-sm mt-1">{errors.apellidos.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input-field pl-10"
              placeholder="tu@email.com"
              maxLength={255}
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="input-field pl-10 pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('telefono')}
              type="tel"
              id="telefono"
              className="input-field pl-10"
              placeholder="300 123 4567"
              maxLength={20}
            />
          </div>
          {errors.telefono && (
            <p className="text-red-600 text-sm mt-1">{errors.telefono.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}; 
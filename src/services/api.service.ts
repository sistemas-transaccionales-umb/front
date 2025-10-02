import axios from 'axios';
import type { SintomasInput, DiagnosticoResponse, Sintoma } from '../types/diagnostic.types';
import { API_BASE_URL } from './api';


class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Envía los síntomas al backend para obtener el diagnóstico
   */
  async analizarSintomas(sintomas: SintomasInput): Promise<DiagnosticoResponse> {
    try {
      const response = await this.api.post('/diagnostico/analizar', { sintomas });
      return response.data;
    } catch (error) {
      console.error('Error al analizar síntomas:', error);
      throw new Error('Error al comunicarse con el servidor');
    }
  }

  /**
   * Obtiene la lista de todos los síntomas disponibles
   */
  async obtenerSintomas(): Promise<Sintoma[]> {
    try {
      const response = await this.api.get('/diagnostico/sintomas');
      return response.data.sintomas;
    } catch (error) {
      console.error('Error al obtener síntomas:', error);
      throw new Error('Error al cargar los síntomas');
    }
  }

  /**
   * Obtiene la lista de todas las enfermedades disponibles
   */
  async obtenerEnfermedades(): Promise<any[]> {
    try {
      const response = await this.api.get('/diagnostico/enfermedades');
      return response.data.enfermedades;
    } catch (error) {
      console.error('Error al obtener enfermedades:', error);
      throw new Error('Error al cargar las enfermedades');
    }
  }
}

export const apiService = new ApiService(); 
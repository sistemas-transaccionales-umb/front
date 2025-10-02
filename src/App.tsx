import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import UsuariosPage from './pages/UsuariosPage';
import ClientesPage from './pages/ClientesPage';
import BodegasPage from './pages/BodegasPage';
import CategoriasPage from './pages/CategoriasPage';
import ProductosPage from './pages/ProductosPage';
import InventarioPage from './pages/InventarioPage';
import TransferenciasPage from './pages/TransferenciasPage';
import PuntoVentaPage from './pages/PuntoVentaPage';
import VentasPage from './pages/VentasPage';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/usuarios" element={<UsuariosPage />} />
                        <Route path="/clientes" element={<ClientesPage />} />
                        <Route path="/bodegas" element={<BodegasPage />} />
                        <Route path="/categorias" element={<CategoriasPage />} />
                        <Route path="/productos" element={<ProductosPage />} />
                        <Route path="/inventario" element={<InventarioPage />} />
                        <Route path="/transferencias" element={<TransferenciasPage />} />
                        <Route path="/punto-venta" element={<PuntoVentaPage />} />
                        <Route path="/ventas" element={<VentasPage />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

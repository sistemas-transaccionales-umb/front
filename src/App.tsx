import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
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
import { Permission } from './types/permissions';
import 'react-toastify/dist/ReactToastify.css';
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
                        <Route 
                          path="/usuarios" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.USUARIOS_LEER}>
                              <UsuariosPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/clientes" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.CLIENTES_LEER}>
                              <ClientesPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/bodegas" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.BODEGAS_LEER}>
                              <BodegasPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/categorias" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.CATEGORIAS_LEER}>
                              <CategoriasPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/productos" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.PRODUCTOS_LEER}>
                              <ProductosPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/inventario" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.INVENTARIO_LEER}>
                              <InventarioPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/transferencias" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.TRANSFERENCIAS_LEER}>
                              <TransferenciasPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/punto-venta" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.VENTAS_CREAR}>
                              <PuntoVentaPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/ventas" 
                          element={
                            <ProtectedRoute requiredPermission={Permission.VENTAS_LEER}>
                              <VentasPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

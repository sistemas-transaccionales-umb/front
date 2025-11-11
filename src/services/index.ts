// Exportar todos los servicios
export { authService } from './auth.service';
export { bodegasService } from './bodegas.service';
export { categoriasService } from './categorias.service';
export { clientesService } from './clientes.service';
export { comprasService } from './compras.service';
export { inventarioService } from './inventario.service';
export { productosService } from './productos.service';
export { proveedoresService } from './proveedores.service';
export { rolesService } from './roles.service';
export { transferenciasService } from './transferencias.service';
export { usuariosService } from './usuarios.service';
export { ventasService } from './ventas.service';

// Exportar tipos
export type { ChangePasswordRequest, ChangePasswordResponse } from './auth.service';
export type { 
  Bodega, 
  CreateBodegaRequest, 
  UpdateBodegaRequest 
} from './bodegas.service';
export type { 
  Categoria, 
  CreateCategoriaRequest, 
  UpdateCategoriaRequest 
} from './categorias.service';
export type { 
  Cliente, 
  CreateClienteRequest, 
  UpdateClienteRequest 
} from './clientes.service';
export type {
  Compra,
  DetalleCompra,
  CreateCompraRequest,
  DetalleCompraRequest,
  ProductoSimple,
  BodegaSimple,
  UsuarioSimple
} from './compras.service';
export type { 
  Inventario, 
  CreateInventarioRequest, 
  AjustarInventarioRequest 
} from './inventario.service';
export type {
  Proveedor,
  CreateProveedorRequest,
  UpdateProveedorRequest
} from './proveedores.service';
export type { 
  Producto, 
  CreateProductoRequest, 
  UpdateProductoRequest 
} from './productos.service';
export type { 
  Transferencia, 
  DetalleTransferencia, 
  CreateTransferenciaRequest 
} from './transferencias.service';
export type { 
  Usuario,
  Rol,
  Permiso,
  CreateUsuarioRequest, 
  UpdateUsuarioRequest 
} from './usuarios.service';
export type { 
  Venta, 
  DetalleVenta, 
  CreateVentaRequest 
} from './ventas.service';


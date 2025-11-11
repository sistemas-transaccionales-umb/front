// Enumeración de todos los permisos del sistema
export enum Permission {
  // Permisos de Usuarios
  USUARIOS_CREAR = 'USUARIOS_CREAR',
  USUARIOS_LEER = 'USUARIOS_LEER',
  USUARIOS_ACTUALIZAR = 'USUARIOS_ACTUALIZAR',
  USUARIOS_ELIMINAR = 'USUARIOS_ELIMINAR',
  
  // Permisos de Roles
  ROLES_CREAR = 'ROLES_CREAR',
  ROLES_LEER = 'ROLES_LEER',
  ROLES_ACTUALIZAR = 'ROLES_ACTUALIZAR',
  ROLES_ELIMINAR = 'ROLES_ELIMINAR',
  ROLES_ASIGNAR_PERMISOS = 'ROLES_ASIGNAR_PERMISOS',
  
  // Permisos de Productos
  PRODUCTOS_CREAR = 'PRODUCTOS_CREAR',
  PRODUCTOS_LEER = 'PRODUCTOS_LEER',
  PRODUCTOS_ACTUALIZAR = 'PRODUCTOS_ACTUALIZAR',
  PRODUCTOS_ELIMINAR = 'PRODUCTOS_ELIMINAR',
  
  // Permisos de Categorías
  CATEGORIAS_CREAR = 'CATEGORIAS_CREAR',
  CATEGORIAS_LEER = 'CATEGORIAS_LEER',
  CATEGORIAS_ACTUALIZAR = 'CATEGORIAS_ACTUALIZAR',
  CATEGORIAS_ELIMINAR = 'CATEGORIAS_ELIMINAR',
  
  // Permisos de Inventario
  INVENTARIO_CREAR = 'INVENTARIO_CREAR',
  INVENTARIO_LEER = 'INVENTARIO_LEER',
  INVENTARIO_ACTUALIZAR = 'INVENTARIO_ACTUALIZAR',
  INVENTARIO_ELIMINAR = 'INVENTARIO_ELIMINAR',
  INVENTARIO_AJUSTAR = 'INVENTARIO_AJUSTAR',
  
  // Permisos de Bodegas
  BODEGAS_CREAR = 'BODEGAS_CREAR',
  BODEGAS_LEER = 'BODEGAS_LEER',
  BODEGAS_ACTUALIZAR = 'BODEGAS_ACTUALIZAR',
  BODEGAS_ELIMINAR = 'BODEGAS_ELIMINAR',
  
  // Permisos de Transferencias
  TRANSFERENCIAS_CREAR = 'TRANSFERENCIAS_CREAR',
  TRANSFERENCIAS_LEER = 'TRANSFERENCIAS_LEER',
  TRANSFERENCIAS_ACTUALIZAR = 'TRANSFERENCIAS_ACTUALIZAR',
  TRANSFERENCIAS_ELIMINAR = 'TRANSFERENCIAS_ELIMINAR',
  TRANSFERENCIAS_APROBAR = 'TRANSFERENCIAS_APROBAR',
  
  // Permisos de Ventas
  VENTAS_CREAR = 'VENTAS_CREAR',
  VENTAS_LEER = 'VENTAS_LEER',
  VENTAS_ACTUALIZAR = 'VENTAS_ACTUALIZAR',
  VENTAS_ELIMINAR = 'VENTAS_ELIMINAR',
  VENTAS_ANULAR = 'VENTAS_ANULAR',
  
  // Permisos de Clientes
  CLIENTES_CREAR = 'CLIENTES_CREAR',
  CLIENTES_LEER = 'CLIENTES_LEER',
  CLIENTES_ACTUALIZAR = 'CLIENTES_ACTUALIZAR',
  CLIENTES_ELIMINAR = 'CLIENTES_ELIMINAR',
  
  // Permisos de Proveedores
  PROVEEDORES_CREAR = 'PROVEEDORES_CREAR',
  PROVEEDORES_LEER = 'PROVEEDORES_LEER',
  PROVEEDORES_ACTUALIZAR = 'PROVEEDORES_ACTUALIZAR',
  PROVEEDORES_ELIMINAR = 'PROVEEDORES_ELIMINAR',
  
  // Permisos de Compras
  COMPRAS_CREAR = 'COMPRAS_CREAR',
  COMPRAS_LEER = 'COMPRAS_LEER',
  COMPRAS_ACTUALIZAR = 'COMPRAS_ACTUALIZAR',
  COMPRAS_ELIMINAR = 'COMPRAS_ELIMINAR',
  COMPRAS_RECIBIR = 'COMPRAS_RECIBIR',
  COMPRAS_CANCELAR = 'COMPRAS_CANCELAR',
  
  // Permisos de Reportes
  REPORTES_VENTAS = 'REPORTES_VENTAS',
  REPORTES_INVENTARIO = 'REPORTES_INVENTARIO',
  REPORTES_FINANCIEROS = 'REPORTES_FINANCIEROS',
  REPORTES_AUDITORIA = 'REPORTES_AUDITORIA',
  
  // Permisos Administrativos
  SISTEMA_CONFIGURAR = 'SISTEMA_CONFIGURAR',
  SISTEMA_BACKUP = 'SISTEMA_BACKUP',
  SISTEMA_RESTORE = 'SISTEMA_RESTORE',
  SISTEMA_LOGS = 'SISTEMA_LOGS',
}

// Descripción de permisos
export const PermissionDescriptions: Record<Permission, string> = {
  [Permission.USUARIOS_CREAR]: 'Permite crear nuevos usuarios en el sistema',
  [Permission.USUARIOS_LEER]: 'Permite visualizar información de usuarios',
  [Permission.USUARIOS_ACTUALIZAR]: 'Permite modificar información de usuarios existentes',
  [Permission.USUARIOS_ELIMINAR]: 'Permite eliminar usuarios del sistema',
  
  [Permission.ROLES_CREAR]: 'Permite crear nuevos roles',
  [Permission.ROLES_LEER]: 'Permite visualizar roles del sistema',
  [Permission.ROLES_ACTUALIZAR]: 'Permite modificar roles existentes',
  [Permission.ROLES_ELIMINAR]: 'Permite eliminar roles',
  [Permission.ROLES_ASIGNAR_PERMISOS]: 'Permite asignar o remover permisos a roles',
  
  [Permission.PRODUCTOS_CREAR]: 'Permite crear nuevos productos',
  [Permission.PRODUCTOS_LEER]: 'Permite visualizar productos',
  [Permission.PRODUCTOS_ACTUALIZAR]: 'Permite modificar productos existentes',
  [Permission.PRODUCTOS_ELIMINAR]: 'Permite eliminar productos',
  
  [Permission.CATEGORIAS_CREAR]: 'Permite crear nuevas categorías',
  [Permission.CATEGORIAS_LEER]: 'Permite visualizar categorías',
  [Permission.CATEGORIAS_ACTUALIZAR]: 'Permite modificar categorías existentes',
  [Permission.CATEGORIAS_ELIMINAR]: 'Permite eliminar categorías',
  
  [Permission.INVENTARIO_CREAR]: 'Permite crear registros de inventario',
  [Permission.INVENTARIO_LEER]: 'Permite visualizar inventario',
  [Permission.INVENTARIO_ACTUALIZAR]: 'Permite modificar inventario',
  [Permission.INVENTARIO_ELIMINAR]: 'Permite eliminar registros de inventario',
  [Permission.INVENTARIO_AJUSTAR]: 'Permite realizar ajustes de inventario',
  
  [Permission.BODEGAS_CREAR]: 'Permite crear nuevas bodegas',
  [Permission.BODEGAS_LEER]: 'Permite visualizar bodegas',
  [Permission.BODEGAS_ACTUALIZAR]: 'Permite modificar bodegas existentes',
  [Permission.BODEGAS_ELIMINAR]: 'Permite eliminar bodegas',
  
  [Permission.TRANSFERENCIAS_CREAR]: 'Permite crear transferencias entre bodegas',
  [Permission.TRANSFERENCIAS_LEER]: 'Permite visualizar transferencias',
  [Permission.TRANSFERENCIAS_ACTUALIZAR]: 'Permite modificar transferencias',
  [Permission.TRANSFERENCIAS_ELIMINAR]: 'Permite eliminar transferencias',
  [Permission.TRANSFERENCIAS_APROBAR]: 'Permite aprobar transferencias pendientes',
  
  [Permission.VENTAS_CREAR]: 'Permite crear nuevas ventas',
  [Permission.VENTAS_LEER]: 'Permite visualizar ventas',
  [Permission.VENTAS_ACTUALIZAR]: 'Permite modificar ventas',
  [Permission.VENTAS_ELIMINAR]: 'Permite eliminar ventas',
  [Permission.VENTAS_ANULAR]: 'Permite anular ventas',
  
  [Permission.CLIENTES_CREAR]: 'Permite crear nuevos clientes',
  [Permission.CLIENTES_LEER]: 'Permite visualizar clientes',
  [Permission.CLIENTES_ACTUALIZAR]: 'Permite modificar clientes existentes',
  [Permission.CLIENTES_ELIMINAR]: 'Permite eliminar clientes',
  
  [Permission.PROVEEDORES_CREAR]: 'Permite crear nuevos proveedores',
  [Permission.PROVEEDORES_LEER]: 'Permite visualizar proveedores',
  [Permission.PROVEEDORES_ACTUALIZAR]: 'Permite modificar proveedores existentes',
  [Permission.PROVEEDORES_ELIMINAR]: 'Permite eliminar proveedores',
  
  [Permission.COMPRAS_CREAR]: 'Permite crear nuevas órdenes de compra',
  [Permission.COMPRAS_LEER]: 'Permite visualizar órdenes de compra',
  [Permission.COMPRAS_ACTUALIZAR]: 'Permite modificar órdenes de compra',
  [Permission.COMPRAS_ELIMINAR]: 'Permite eliminar órdenes de compra',
  [Permission.COMPRAS_RECIBIR]: 'Permite marcar compras como recibidas e ingresar stock',
  [Permission.COMPRAS_CANCELAR]: 'Permite cancelar órdenes de compra',
  
  [Permission.REPORTES_VENTAS]: 'Permite generar reportes de ventas',
  [Permission.REPORTES_INVENTARIO]: 'Permite generar reportes de inventario',
  [Permission.REPORTES_FINANCIEROS]: 'Permite generar reportes financieros',
  [Permission.REPORTES_AUDITORIA]: 'Permite generar reportes de auditoría',
  
  [Permission.SISTEMA_CONFIGURAR]: 'Permite configurar parámetros del sistema',
  [Permission.SISTEMA_BACKUP]: 'Permite realizar respaldos del sistema',
  [Permission.SISTEMA_RESTORE]: 'Permite restaurar respaldos',
  [Permission.SISTEMA_LOGS]: 'Permite visualizar logs del sistema',
};

// Tipo para verificación de permisos
export type PermissionCheck = Permission | Permission[];

// Agrupación de permisos por módulo
export const PermissionGroups = {
  USUARIOS: [
    Permission.USUARIOS_CREAR,
    Permission.USUARIOS_LEER,
    Permission.USUARIOS_ACTUALIZAR,
    Permission.USUARIOS_ELIMINAR,
  ],
  ROLES: [
    Permission.ROLES_CREAR,
    Permission.ROLES_LEER,
    Permission.ROLES_ACTUALIZAR,
    Permission.ROLES_ELIMINAR,
    Permission.ROLES_ASIGNAR_PERMISOS,
  ],
  PRODUCTOS: [
    Permission.PRODUCTOS_CREAR,
    Permission.PRODUCTOS_LEER,
    Permission.PRODUCTOS_ACTUALIZAR,
    Permission.PRODUCTOS_ELIMINAR,
  ],
  CATEGORIAS: [
    Permission.CATEGORIAS_CREAR,
    Permission.CATEGORIAS_LEER,
    Permission.CATEGORIAS_ACTUALIZAR,
    Permission.CATEGORIAS_ELIMINAR,
  ],
  INVENTARIO: [
    Permission.INVENTARIO_CREAR,
    Permission.INVENTARIO_LEER,
    Permission.INVENTARIO_ACTUALIZAR,
    Permission.INVENTARIO_ELIMINAR,
    Permission.INVENTARIO_AJUSTAR,
  ],
  BODEGAS: [
    Permission.BODEGAS_CREAR,
    Permission.BODEGAS_LEER,
    Permission.BODEGAS_ACTUALIZAR,
    Permission.BODEGAS_ELIMINAR,
  ],
  TRANSFERENCIAS: [
    Permission.TRANSFERENCIAS_CREAR,
    Permission.TRANSFERENCIAS_LEER,
    Permission.TRANSFERENCIAS_ACTUALIZAR,
    Permission.TRANSFERENCIAS_ELIMINAR,
    Permission.TRANSFERENCIAS_APROBAR,
  ],
  VENTAS: [
    Permission.VENTAS_CREAR,
    Permission.VENTAS_LEER,
    Permission.VENTAS_ACTUALIZAR,
    Permission.VENTAS_ELIMINAR,
    Permission.VENTAS_ANULAR,
  ],
  CLIENTES: [
    Permission.CLIENTES_CREAR,
    Permission.CLIENTES_LEER,
    Permission.CLIENTES_ACTUALIZAR,
    Permission.CLIENTES_ELIMINAR,
  ],
  PROVEEDORES: [
    Permission.PROVEEDORES_CREAR,
    Permission.PROVEEDORES_LEER,
    Permission.PROVEEDORES_ACTUALIZAR,
    Permission.PROVEEDORES_ELIMINAR,
  ],
  COMPRAS: [
    Permission.COMPRAS_CREAR,
    Permission.COMPRAS_LEER,
    Permission.COMPRAS_ACTUALIZAR,
    Permission.COMPRAS_ELIMINAR,
    Permission.COMPRAS_RECIBIR,
    Permission.COMPRAS_CANCELAR,
  ],
  REPORTES: [
    Permission.REPORTES_VENTAS,
    Permission.REPORTES_INVENTARIO,
    Permission.REPORTES_FINANCIEROS,
    Permission.REPORTES_AUDITORIA,
  ],
  SISTEMA: [
    Permission.SISTEMA_CONFIGURAR,
    Permission.SISTEMA_BACKUP,
    Permission.SISTEMA_RESTORE,
    Permission.SISTEMA_LOGS,
  ],
};


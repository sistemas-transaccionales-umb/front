import { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { categoriasService } from '../services';
import type { Categoria, CreateCategoriaRequest } from '../services/categorias.service';
import { ProtectedAction } from '../components/auth/ProtectedAction';
import { Permission } from '../types/permissions';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState<CreateCategoriaRequest>({
    nombreCategoria: '',
    descripcion: '',
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriasService.obtenerTodas();
      setCategorias(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCategoria) {
        await categoriasService.actualizar(editingCategoria.idCategoria, formData);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await categoriasService.crear(formData);
        toast.success('Categoría creada exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadCategorias();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombreCategoria: '',
      descripcion: '',
    });
    setEditingCategoria(null);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      nombreCategoria: categoria.nombreCategoria,
      descripcion: categoria.descripcion,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta categoría?')) return;
    try {
      await categoriasService.eliminar(id);
      toast.success('Categoría eliminada exitosamente');
      loadCategorias();
    } catch (error) {
      toast.error('Error al eliminar categoría');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
        <ProtectedAction permission={Permission.CATEGORIAS_CREAR}>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Categoría
          </button>
        </ProtectedAction>
      </div>

      {/* Grid de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Cargando...</div>
        ) : categorias.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay categorías registradas
          </div>
        ) : (
          categorias.map((categoria) => (
            <div
              key={categoria.idCategoria}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {categoria.nombreCategoria}
                </h3>
                <div className="flex space-x-2">
                  <ProtectedAction permission={Permission.CATEGORIAS_ACTUALIZAR}>
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar categoría"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </ProtectedAction>
                  <ProtectedAction permission={Permission.CATEGORIAS_ELIMINAR}>
                    <button
                      onClick={() => handleDelete(categoria.idCategoria)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar categoría"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </ProtectedAction>
                </div>
              </div>
              <p className="text-sm text-gray-600">{categoria.descripcion}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  value={formData.nombreCategoria}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreCategoria: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Ej: Electrónica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  rows={3}
                  placeholder="Describe la categoría"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


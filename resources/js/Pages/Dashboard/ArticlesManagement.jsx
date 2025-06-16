import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Calendar,
  Tag,
  ThumbsUp
} from 'lucide-react';

export default function ArticlesManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Datos simulados
      const mockArticles = [
        {
          id: 1,
          title: 'Beneficios de la Miel para la Salud',
          category: 'Salud',
          status: 'published',
          author: 'Dr. María González',
          views: 1234,
          likes: 89,
          created_at: '2024-05-15',
          excerpt: 'Descubre los increíbles beneficios que la miel puede aportar a tu salud diaria...'
        },
        {
          id: 2,
          title: 'Cómo Cuidar una Colmena en Invierno',
          category: 'Apicultura',
          status: 'published',
          author: 'Carlos Ruiz',
          views: 987,
          likes: 67,
          created_at: '2024-05-10',
          excerpt: 'Guía completa para mantener tus colmenas saludables durante los meses fríos...'
        },
        {
          id: 3,
          title: 'Recetas Caseras con Propóleo',
          category: 'Recetas',
          status: 'draft',
          author: 'Ana Pérez',
          views: 0,
          likes: 0,
          created_at: '2024-06-01',
          excerpt: 'Aprende a preparar remedios naturales utilizando propóleo de abeja...'
        }
      ];
      
      setArticles(mockArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Publicado' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Borrador' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Archivado' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Artículos</h2>
              <p className="text-gray-600 mt-1">
                Administra los artículos y contenido educativo
              </p>
            </div>
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
              <Plus size={16} className="mr-2" />
              Crear Artículo
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">Todas las categorías</option>
                <option value="Salud">Salud</option>
                <option value="Apicultura">Apicultura</option>
                <option value="Recetas">Recetas</option>
                <option value="Educación">Educación</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">Todos los estados</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
                <option value="archived">Archivados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              <p className="text-sm text-gray-600">Total Artículos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {articles.filter(a => a.status === 'published').length}
              </p>
              <p className="text-sm text-gray-600">Publicados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {articles.filter(a => a.status === 'draft').length}
              </p>
              <p className="text-sm text-gray-600">Borradores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {articles.reduce((sum, a) => sum + a.views, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Visualizaciones</p>
            </div>
          </div>
        </div>

        {/* Lista de artículos */}
        <div className="divide-y divide-gray-200">
          {filteredArticles.map((article) => (
            <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {article.title}
                    </h3>
                    {getStatusBadge(article.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Tag size={16} className="mr-1" />
                      <span>{article.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      <span>{article.views} visualizaciones</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp size={16} className="mr-1" />
                      <span>{article.likes} likes</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Por <span className="font-medium">{article.author}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={14} className="mr-1" />
                        Ver
                      </button>
                      <button className="inline-flex items-center px-3 py-1 text-sm text-amber-600 hover:bg-amber-50 rounded-lg">
                        <Edit size={14} className="mr-1" />
                        Editar
                      </button>
                      <button className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} className="mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron artículos
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Comienza creando tu primer artículo'
              }
            </p>
          </div>
        )}

        {/* Paginación */}
        {filteredArticles.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredArticles.length}</span> de{' '}
                <span className="font-medium">{articles.length}</span> resultados
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-white hover:bg-gray-50">
                  Anterior
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-amber-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-white hover:bg-gray-50">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

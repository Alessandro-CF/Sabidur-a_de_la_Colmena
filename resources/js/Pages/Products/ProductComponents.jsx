import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';

// Componente de tarjeta de producto mejorado
export const ProductCard = ({ product, isFavorite, onToggleFavorite, onViewDetails, categoryColor }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all transform hover:scale-110 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
        </button>
        
        <div className="absolute top-3 left-3">
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: categoryColor }}
          >
            Premium
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: '#39393A' }}>
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {product.description}
        </p>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Características principales:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {product.characteristics.slice(0, 2).map((char, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: categoryColor }}></span>
                {char}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold" style={{ color: '#558C8C' }}>
              {product.price}
            </span>
            <div className="ml-2 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="text-yellow-400 fill-current" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.8)</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium flex items-center justify-center"
          >
            <Eye size={16} className="mr-2" />
            Ver Detalles
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90 flex items-center justify-center"
            style={{ backgroundColor: categoryColor }}
            onClick={() => window.open('https://tu-tienda-online.com', '_blank')}
          >
            <ShoppingCart size={16} className="mr-2" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de filtros
export const ProductFilters = ({ activeFilter, onFilterChange, categories }) => {
  const filters = ['todos', 'favoritos', 'populares', 'nuevos'];
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
            activeFilter === filter
              ? 'bg-amber-400 text-gray-900'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

// Componente de búsqueda
export const ProductSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

// Componente de estadísticas
export const ProductStats = ({ totalProducts, categories }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-amber-600">{totalProducts}</div>
        <div className="text-sm text-gray-600">Productos</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-green-600">{categories.length}</div>
        <div className="text-sm text-gray-600">Categorías</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-blue-600">100%</div>
        <div className="text-sm text-gray-600">Naturales</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-purple-600">4.8</div>
        <div className="text-sm text-gray-600">Valoración</div>
      </div>
    </div>
  );
};

// Componente de loading
export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { X, Heart, ExternalLink, ShoppingCart, Share2, Star, Plus, Minus, Truck, Shield, Award } from 'lucide-react';

export const ProductModal = ({ product, onClose, isFavorite, onToggleFavorite }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Simular múltiples imágenes del producto
  const productImages = [
    product.image,
    product.image,
    product.image
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const adjustQuantity = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header del modal */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold" style={{ color: '#39393A' }}>
              Detalles del Producto
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                title="Compartir"
              >
                <Share2 size={18} className="text-gray-600" />
              </button>
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-full transition ${
                  isFavorite 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'
                }`}
                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                title="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={productImages[selectedImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === index 
                        ? 'border-amber-400' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: '#39393A' }}>
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(124 reseñas)</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">En stock</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Precio y cantidad */}
              <div className="border-t border-b py-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold" style={{ color: '#558C8C' }}>
                    {product.price}
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">$24.99</div>
                    <div className="text-sm text-red-600 font-medium">20% descuento</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => adjustQuantity(-1)}
                        className="p-2 hover:bg-gray-100 transition"
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                      <button
                        onClick={() => adjustQuantity(1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  className="w-full px-6 py-3 rounded-lg text-white font-medium transition hover:opacity-90 flex items-center justify-center text-lg"
                  style={{ backgroundColor: '#FA9500' }}
                  onClick={() => window.open('https://tu-tienda-online.com', '_blank')}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Comprar Ahora
                </button>
                <button
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center"
                  onClick={() => window.open('https://tu-tienda-online.com', '_blank')}
                >
                  <ExternalLink size={18} className="mr-2" />
                  Ver en Tienda
                </button>
              </div>

              {/* Garantías y beneficios */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Truck size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">Envío gratuito</div>
                    <div className="text-sm text-green-600">En pedidos superiores a $50</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Shield size={20} className="text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">Garantía de calidad</div>
                    <div className="text-sm text-blue-600">30 días de garantía</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Award size={20} className="text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-800">Producto certificado</div>
                    <div className="text-sm text-purple-600">100% natural y orgánico</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="border-t bg-gray-50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#39393A' }}>
                  Características
                </h3>
                <ul className="space-y-2">
                  {product.characteristics.map((char, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FA9500' }}></span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#39393A' }}>
                  Beneficios y Propiedades
                </h3>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#EFF7FF' }}>
                  <p className="text-gray-700 leading-relaxed">
                    {product.benefits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

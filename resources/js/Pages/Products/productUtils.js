// Utilidades específicas para la sección de productos

// Función para formatear precios
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(parseFloat(price.replace('$', '')));
};

// Función para generar colores hexagonales
export const generateHexColor = (index) => {
  const colors = ['#F8F32B', '#FA9500', '#558C8C', '#C06E52'];
  return colors[index % colors.length];
};

// Función para truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Función para generar slug de producto
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Función para calcular descuento
export const calculateDiscount = (originalPrice, salePrice) => {
  const original = parseFloat(originalPrice.replace('$', ''));
  const sale = parseFloat(salePrice.replace('$', ''));
  return Math.round(((original - sale) / original) * 100);
};

// Función para validar stock
export const checkStock = (productId) => {
  // Simulación de verificación de stock
  // En una aplicación real, esto haría una llamada a la API
  return Math.random() > 0.1; // 90% de probabilidad de estar en stock
};

// Función para obtener productos relacionados
export const getRelatedProducts = (currentProduct, allProducts, limit = 3) => {
  return allProducts
    .filter(product => 
      product.id !== currentProduct.id && 
      product.category === currentProduct.category
    )
    .slice(0, limit);
};

// Función para buscar productos
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.characteristics.some(char => 
      char.toLowerCase().includes(term)
    )
  );
};

// Función para ordenar productos
export const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sortedProducts.sort((a, b) => 
        parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
      );
    case 'price-desc':
      return sortedProducts.sort((a, b) => 
        parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
      );
    case 'popular':
      // Simular popularidad (en una app real vendría del backend)
      return sortedProducts.sort(() => Math.random() - 0.5);
    default:
      return sortedProducts;
  }
};

// Función para manejar favoritos en localStorage
export const favoriteUtils = {
  get: () => {
    try {
      const favorites = localStorage.getItem('product-favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },
  
  set: (favorites) => {
    try {
      localStorage.setItem('product-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },
  
  add: (productId) => {
    const favorites = favoriteUtils.get();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      favoriteUtils.set(favorites);
    }
    return favorites;
  },
  
  remove: (productId) => {
    const favorites = favoriteUtils.get().filter(id => id !== productId);
    favoriteUtils.set(favorites);
    return favorites;
  },
  
  toggle: (productId) => {
    const favorites = favoriteUtils.get();
    if (favorites.includes(productId)) {
      return favoriteUtils.remove(productId);
    } else {
      return favoriteUtils.add(productId);
    }
  }
};

// Función para compartir producto
export const shareProduct = async (product) => {
  const shareData = {
    title: product.name,
    text: product.description,
    url: `${window.location.origin}/productos/${generateSlug(product.name)}`
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (error) {
      console.log('Error sharing:', error);
      return { success: false, error };
    }
  } else {
    // Fallback para navegadores que no soportan Web Share API
    try {
      await navigator.clipboard.writeText(shareData.url);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return { success: false, error };
    }
  }
};

// Función para tracking de eventos (analytics)
export const trackEvent = (eventName, eventData) => {
  // Integración con servicios de analytics (Google Analytics, Mixpanel, etc.)
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
  
  // También podrías integrar con otros servicios
  console.log('Track Event:', eventName, eventData);
};

// Función para lazy loading de imágenes
export const createImageObserver = (callback) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });
  }
  return null;
};

// Función para generar datos de productos de prueba
export const generateMockProducts = (count = 10) => {
  const categories = ['mieles', 'derivados', 'cosmetica', 'accesorios'];
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    products.push({
      id: i,
      name: `Producto ${i}`,
      description: `Descripción del producto ${i}`,
      price: `$${(Math.random() * 50 + 10).toFixed(2)}`,
      image: `/api/placeholder/300/250?text=Producto${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      characteristics: [
        `Característica ${i}-1`,
        `Característica ${i}-2`,
        `Característica ${i}-3`
      ],
      benefits: `Beneficios del producto ${i}`,
      inStock: Math.random() > 0.1,
      rating: (Math.random() * 2 + 3).toFixed(1)
    });
  }
  
  return products;
};

// Debounce para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Función para validar formularios de producto
export const validateProductForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }
  
  if (!formData.description || formData.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres';
  }
  
  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Exportar todas las utilidades
export default {
  formatPrice,
  generateHexColor,
  truncateText,
  generateSlug,
  calculateDiscount,
  checkStock,
  getRelatedProducts,
  searchProducts,
  sortProducts,
  favoriteUtils,
  shareProduct,
  trackEvent,
  createImageObserver,
  generateMockProducts,
  debounce,
  validateProductForm
};

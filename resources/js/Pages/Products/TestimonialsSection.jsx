import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "María González",
    location: "Madrid, España",
    rating: 5,
    comment: "La miel de eucalipto es increíble. Mi familia la usa para problemas respiratorios y realmente funciona. Además, el sabor es exquisito.",
    product: "Miel de Eucalipto",
    avatar: "/api/placeholder/60/60",
    verified: true
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    location: "Medellín, Colombia",
    rating: 5,
    comment: "El propóleo ha fortalecido mi sistema inmunológico notablemente. Es un producto de excelente calidad y llegó en perfectas condiciones.",
    product: "Propóleo Puro",
    avatar: "/api/placeholder/60/60",
    verified: true
  },
  {
    id: 3,
    name: "Ana Martínez",
    location: "Buenos Aires, Argentina",
    rating: 5,
    comment: "Los productos cosméticos con miel han transformado mi piel. Son completamente naturales y los resultados son visibles desde la primera semana.",
    product: "Crema Facial con Miel",
    avatar: "/api/placeholder/60/60",
    verified: true
  },
  {
    id: 4,
    name: "Luis Fernández",
    location: "Lima, Perú",
    rating: 5,
    comment: "Como apicultor aficionado, puedo decir que estos productos son de la más alta calidad. La miel mantiene todas sus propiedades naturales.",
    product: "Kit de Degustación",
    avatar: "/api/placeholder/60/60",
    verified: true
  },
  {
    id: 5,
    name: "Sofia Herrera",
    location: "Santiago, Chile",
    rating: 5,
    comment: "El polen de abeja me ha dado una energía increíble. Lo tomo todas las mañanas y siento la diferencia. Altamente recomendado.",
    product: "Polen de Abeja",
    avatar: "/api/placeholder/60/60",
    verified: true
  },
  {
    id: 6,
    name: "Diego Morales",
    location: "Bogotá, Colombia",
    rating: 5,
    comment: "La jalea real es perfecta para mi rutina de suplementos. La calidad es excepcional y el empaque muy profesional.",
    product: "Jalea Real",
    avatar: "/api/placeholder/60/60",
    verified: true
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16" style={{ backgroundColor: '#EFF7FF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#39393A' }}>
            Lo que Dicen Nuestros Clientes
          </h2>
          <div className="h-1 w-24 mx-auto mb-4" style={{ backgroundColor: '#FA9500' }}></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Miles de personas confían en la calidad de nuestros productos naturales. 
            Descubre por qué somos la opción preferida para el cuidado natural.
          </p>
        </div>

        {/* Estadísticas de satisfacción */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: '#558C8C' }}>
              98%
            </div>
            <div className="text-gray-600">Satisfacción del cliente</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: '#C06E52' }}>
              15K+
            </div>
            <div className="text-gray-600">Clientes felices</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: '#FA9500' }}>
              4.9
            </div>
            <div className="text-gray-600">Valoración promedio</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: '#F8F32B' }}>
              50K+
            </div>
            <div className="text-gray-600">Productos vendidos</div>
          </div>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Llamada a la acción */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            ¿Listo para unirte a nuestra comunidad de clientes satisfechos?
          </p>
          <button 
            className="px-8 py-3 rounded-lg font-medium text-lg transition transform hover:scale-105" 
            style={{ backgroundColor: '#FA9500', color: '#EFF7FF' }}
            onClick={() => window.open('https://tu-tienda-online.com', '_blank')}
          >
            Explorar Productos
          </button>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
      {/* Icono de comillas */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F8F32B' }}>
        <Quote size={16} style={{ color: '#39393A' }} />
      </div>

      {/* Contenido del testimonial */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={16} className="text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 italic leading-relaxed mb-4">
          "{testimonial.comment}"
        </p>
        <div className="text-sm font-medium mb-2" style={{ color: '#558C8C' }}>
          Producto: {testimonial.product}
        </div>
      </div>

      {/* Información del cliente */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <div className="font-medium text-gray-900 text-sm">
              {testimonial.name}
              {testimonial.verified && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  ✓ Verificado
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{testimonial.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;

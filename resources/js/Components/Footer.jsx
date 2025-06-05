import React from "react";
import { Link } from "@inertiajs/react";

// Puedes reemplazar esto por tu logo real si tienes uno
function HexagonLogo({ color = "#F8F32B" }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="16,3 29,10.5 29,25.5 16,33 3,25.5 3,10.5" fill={color} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="py-12" style={{ backgroundColor: '#39393A', color: '#EFF7FF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center mb-4 group focus:outline-none">
              <HexagonLogo color="#F8F32B" />
              <span className="ml-3 font-bold text-xl group-hover:underline transition">Sabiduría de la Colmena</span>
            </Link>
            <p className="text-gray-300">
              Una comunidad dedicada a compartir conocimientos y experiencias sobre apicultura.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-amber-400 transition">Inicio</Link></li>
              <li><Link href="/comunidad" className="hover:text-amber-400 transition">Comunidad</Link></li>
              <li><Link href="/productos" className="hover:text-amber-400 transition">Productos</Link></li>
              <li><Link href="/capacitaciones" className="hover:text-amber-400 transition">Capacitaciones</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
            <p className="mb-2">contacto@sabiduriacolmena.com</p>
            <p>+1 123 456 7890</p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2025 Sabiduría de la Colmena. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    Menu,
    X,
    ChevronDown,
    User,
    ExternalLink,
    Info,
    ShoppingCart,
    Filter,
    Heart,
    Eye,
} from "lucide-react";
import authService from "../../services/authService";
import productService from "../../services/productService";
import { ProductModal } from "./ProductModal";
import { TestimonialsSection } from "./TestimonialsSection";
import {
    ProductCard,
    ProductFilters,
    ProductSearch,
    ProductStats,
} from "./ProductComponents";

// Componente principal
export default function Products() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [activeCategory, setActiveCategory] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("todos");

    // Estados para datos del backend
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar estado de autenticación al cargar el componente
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = authService.getToken();
                if (token) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                authService.removeToken();
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkAuthStatus();
    }, []);

    // Cargar datos del backend
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cargar productos por categoría con rotación
                const response = await productService.getProductsByCategory();

                if (response.success) {
                    setCategoryProducts(response.data);

                    // Extraer categorías únicas
                    const uniqueCategories = response.data.map((item) => ({
                        id: item.category.id_categoria,
                        name: item.category.nombre,
                        description: item.category.descripcion,
                        productsCount: item.products.length,
                    }));

                    setCategories(uniqueCategories);

                    // Establecer la primera categoría como activa
                    if (uniqueCategories.length > 0) {
                        setActiveCategory(uniqueCategories[0].id);
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
                setError(
                    "Error al cargar los datos. Por favor, intenta nuevamente."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // Recargar datos cada hora para la rotación
        const interval = setInterval(loadData, 60 * 60 * 1000); // 1 hora

        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setIsLoggedIn(false);
            setUser(null);
            setIsProfileOpen(false);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            authService.removeToken();
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    const toggleFavorite = (productId) => {
        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
    };

    // Filtrar productos basado en búsqueda y filtros
    const getFilteredProducts = () => {
        const categoryData = categoryProducts.find(
            (item) => item.category.id_categoria === activeCategory
        );
        let products = categoryData ? categoryData.products : [];

        // Filtrar por término de búsqueda
        if (searchTerm) {
            products = products.filter(
                (product) =>
                    product.nombre
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.descripcion
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por tipo
        switch (activeFilter) {
            case "favoritos":
                products = products.filter((product) =>
                    favorites.includes(product.id_producto)
                );
                break;
            case "populares":
                // Simular productos populares (ordenar por stock descendente)
                products = [...products]
                    .sort((a, b) => b.stock - a.stock)
                    .slice(0, 4);
                break;
            case "nuevos":
                // Productos más recientes
                products = [...products]
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                    )
                    .slice(0, 4);
                break;
            case "precio_bajo":
                products = [...products].sort(
                    (a, b) => parseFloat(a.precio) - parseFloat(b.precio)
                );
                break;
            case "precio_alto":
                products = [...products].sort(
                    (a, b) => parseFloat(b.precio) - parseFloat(a.precio)
                );
                break;
            default:
                break;
        }

        return products;
    };

    const filteredProducts = getFilteredProducts();
    const totalProducts = categoryProducts.reduce(
        (total, item) => total + item.products.length,
        0
    );

    // Manejar carga y errores
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Error al cargar
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-amber-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-amber-500 transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav
                className="bg-amber-400 text-gray-900 shadow-md sticky top-0 z-50"
                style={{ backgroundColor: "#F8F32B" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo y nombre del sitio */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <HexagonLogo />
                                <span className="ml-3 font-bold text-gray-900 text-xl">
                                    Sabiduría de la Colmena
                                </span>
                            </div>
                        </div>

                        {/* Menú de navegación para desktop */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-4">
                                <NavLink href="/">Inicio</NavLink>
                                <NavLink href="/articulos">Artículos</NavLink>
                                <NavLink href="/productos" active={true}>
                                    Productos
                                </NavLink>
                                <NavLink href="/capacitaciones">
                                    Capacitaciones
                                </NavLink>

                                {/* Perfil */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setIsProfileOpen(!isProfileOpen)
                                        }
                                        className="flex items-center px-3 py-2 rounded-md text-gray-900 hover:bg-amber-500 transition"
                                    >
                                        {isLoggedIn
                                            ? user?.name.split(" ")[0] ||
                                              "Usuario"
                                            : "Perfil"}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                            {isLoggedIn ? (
                                                <>
                                                    <ProfileLink href="/perfil">
                                                        Mi Perfil
                                                    </ProfileLink>
                                                    <ProfileLink href="/configuracion">
                                                        Configuración
                                                    </ProfileLink>
                                                    {user?.role === "admin" && (
                                                        <ProfileLink href="/dashboard">
                                                            Dashboard
                                                            Administrativo
                                                        </ProfileLink>
                                                    )}
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Cerrar Sesión
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <ProfileLink href="/login">
                                                        Iniciar Sesión
                                                    </ProfileLink>
                                                    <ProfileLink href="/register">
                                                        Registrarse
                                                    </ProfileLink>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón de menú móvil */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-amber-500"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <MobileNavLink href="/">Inicio</MobileNavLink>
                            <MobileNavLink href="/articulos">
                                Artículos
                            </MobileNavLink>
                            <MobileNavLink href="/productos" active={true}>
                                Productos
                            </MobileNavLink>
                            <MobileNavLink href="/capacitaciones">
                                Capacitaciones
                            </MobileNavLink>

                            {isLoggedIn ? (
                                <>
                                    <MobileNavLink href="/perfil">
                                        Mi Perfil
                                    </MobileNavLink>
                                    <MobileNavLink href="/configuracion">
                                        Configuración
                                    </MobileNavLink>
                                    {user?.role === "admin" && (
                                        <MobileNavLink href="/dashboard">
                                            Dashboard Administrativo
                                        </MobileNavLink>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500 hover:text-gray-900"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <MobileNavLink href="/login">
                                        Iniciar Sesión
                                    </MobileNavLink>
                                    <MobileNavLink href="/register">
                                        Registrarse
                                    </MobileNavLink>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Contenido principal */}
            <main>
                {/* Hero Section */}
                <section
                    className="relative py-16 md:py-24 overflow-hidden"
                    style={{
                        backgroundColor: "#EFF7FF",
                        backgroundImage:
                            'url("https://www.transparenttextures.com/patterns/hexellence.png")',
                        backgroundRepeat: "repeat",
                        backgroundSize: "auto",
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center relative z-10">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                Descubre los
                                <br />
                                <span style={{ color: "#C06E52" }}>
                                    Tesoros de la Colmena
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-3xl mx-auto">
                                Productos naturales de nuestras abejas,
                                cuidadosamente elaborados para ofrecerte lo
                                mejor de la naturaleza. Cada producto es un
                                testimonio de la dedicación y sabiduría de estas
                                increíbles trabajadoras.
                            </p>
                            <button
                                className="px-8 py-4 rounded-lg font-medium text-lg transition transform hover:scale-105"
                                style={{
                                    backgroundColor: "blue",
                                    color: "#EFF7FF",
                                }}
                                onClick={() =>
                                    document
                                        .getElementById("products-section")
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                Explorar Productos
                            </button>
                        </div>
                    </div>
                </section>

                {/* Sección de introducción educativa */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2
                                    className="text-3xl font-bold mb-6"
                                    style={{ color: "#39393A" }}
                                >
                                    Los Regalos de las Abejas
                                </h2>
                                <div
                                    className="h-1 w-24 mb-6"
                                    style={{ backgroundColor: "#FA9500" }}
                                ></div>
                                <p className="text-lg text-gray-700 mb-6">
                                    Las abejas son maestras de la naturaleza,
                                    capaces de transformar el néctar de las
                                    flores en productos únicos con propiedades
                                    extraordinarias. Cada uno de estos tesoros
                                    naturales lleva consigo siglos de evolución
                                    y perfección.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                            style={{
                                                backgroundColor: "#F8F32B",
                                            }}
                                        >
                                            <span
                                                className="text-sm font-bold"
                                                style={{ color: "#39393A" }}
                                            >
                                                🍯
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Miel Pura
                                            </h4>
                                            <p className="text-gray-600">
                                                Endulzante natural con
                                                propiedades antibacterianas y
                                                antioxidantes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                            style={{
                                                backgroundColor: "#558C8C",
                                            }}
                                        >
                                            <span className="text-sm font-bold text-white">
                                                ✨
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Derivados Especiales
                                            </h4>
                                            <p className="text-gray-600">
                                                Propóleo, polen y jalea real con
                                                beneficios únicos para la salud
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                            style={{
                                                backgroundColor: "#C06E52",
                                            }}
                                        >
                                            <span className="text-sm font-bold text-white">
                                                🌿
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Cuidado Natural
                                            </h4>
                                            <p className="text-gray-600">
                                                Productos cosméticos elaborados
                                                con ingredientes 100% naturales
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                                    <BeeLogo width={200} height={200} />
                                </div>
                                <div
                                    className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: "#F8F32B" }}
                                >
                                    <HexagonIcon size={32} color="#39393A" />
                                </div>
                                <div
                                    className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: "#558C8C" }}
                                >
                                    <HexagonIcon size={24} color="#EFF7FF" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navegación de categorías */}
                <section
                    className="py-8"
                    style={{ backgroundColor: "#FFFBE6" }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2
                                className="text-3xl font-bold mb-4"
                                style={{ color: "#39393A" }}
                            >
                                Explora Nuestras Categorías
                            </h2>
                            <div
                                className="h-1 w-24 mx-auto"
                                style={{ backgroundColor: "#FA9500" }}
                            ></div>
                        </div>

                        {/* Navegación hexagonal */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {categories.map((category, index) => {
                                // Colores predefinidos que se asignan secuencialmente
                                const colors = [
                                    "#F8F32B",
                                    "#558C8C",
                                    "#C06E52",
                                    "#FA9500",
                                    "#8B5CF6",
                                    "#EF4444",
                                ];
                                const icons = [
                                    "🍯",
                                    "🌟",
                                    "🧴",
                                    "🥄",
                                    "💎",
                                    "🌿",
                                ];

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            setActiveCategory(category.id)
                                        }
                                        className={`relative group transition-all duration-300 transform hover:scale-105 ${
                                            activeCategory === category.id
                                                ? "scale-105"
                                                : ""
                                        }`}
                                    >
                                        <div className="relative">
                                            <HexagonButton
                                                color={
                                                    activeCategory ===
                                                    category.id
                                                        ? colors[
                                                              index %
                                                                  colors.length
                                                          ]
                                                        : "#E5E7EB"
                                                }
                                                size={100}
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl mb-1">
                                                    {
                                                        icons[
                                                            index % icons.length
                                                        ]
                                                    }
                                                </span>
                                                <span
                                                    className={`text-xs font-medium text-center px-2 ${
                                                        activeCategory ===
                                                        category.id
                                                            ? "text-gray-900"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {category.name}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    ({category.productsCount})
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Listado de productos */}
                <section id="products-section" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Estadísticas */}
                        <ProductStats
                            totalProducts={totalProducts}
                            categories={categories}
                        />

                        <div className="mb-8">
                            <h3
                                className="text-2xl font-bold mb-2"
                                style={{ color: "#39393A" }}
                            >
                                {categories.find(
                                    (cat) => cat.id === activeCategory
                                )?.name || "Productos"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Descubre nuestra selección cuidadosamente curada
                                de{" "}
                                {(
                                    categories.find(
                                        (cat) => cat.id === activeCategory
                                    )?.name || "productos"
                                ).toLowerCase()}
                            </p>

                            {/* Búsqueda y filtros */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div className="flex-1 max-w-md">
                                    <ProductSearch
                                        searchTerm={searchTerm}
                                        onSearchChange={setSearchTerm}
                                    />
                                </div>
                                <ProductFilters
                                    activeFilter={activeFilter}
                                    onFilterChange={setActiveFilter}
                                    categories={categories}
                                />
                            </div>
                        </div>

                        {/* Resultados */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3
                                    className="text-xl font-semibold mb-2"
                                    style={{ color: "#39393A" }}
                                >
                                    No se encontraron productos
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Intenta ajustar tus filtros o términos de
                                    búsqueda
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setActiveFilter("todos");
                                    }}
                                    className="px-6 py-2 rounded-lg font-medium transition"
                                    style={{
                                        backgroundColor: "#FA9500",
                                        color: "#EFF7FF",
                                    }}
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map((product, index) => {
                                    const colors = [
                                        "#F8F32B",
                                        "#558C8C",
                                        "#C06E52",
                                        "#FA9500",
                                        "#8B5CF6",
                                        "#EF4444",
                                    ];
                                    // Encontrar la categoría actual para obtener su nombre
                                    const currentCategory = categories.find(
                                        (cat) => cat.id === activeCategory
                                    );

                                    return (
                                        <ProductCard
                                            key={product.id_producto}
                                            product={{
                                                id: product.id_producto,
                                                name: product.nombre,
                                                description:
                                                    product.descripcion,
                                                image:
                                                    product.imagen_url_completa ||
                                                    "/api/placeholder/300/250",
                                                price: `$${parseFloat(
                                                    product.precio
                                                ).toFixed(2)}`,
                                                stock: product.stock,
                                                category:
                                                    currentCategory?.name ||
                                                    "Sin categoría",
                                                characteristics: [
                                                    `Stock: ${product.stock} unidades`,
                                                    `Categoría: ${
                                                        currentCategory?.name ||
                                                        "Sin categoría"
                                                    }`,
                                                    `Precio: $${parseFloat(
                                                        product.precio
                                                    ).toFixed(2)}`,
                                                ],
                                                benefits: product.descripcion,
                                            }}
                                            isFavorite={favorites.includes(
                                                product.id_producto
                                            )}
                                            onToggleFavorite={() =>
                                                toggleFavorite(
                                                    product.id_producto
                                                )
                                            }
                                            onViewDetails={() =>
                                                openProductModal({
                                                    id: product.id_producto,
                                                    name: product.nombre,
                                                    description:
                                                        product.descripcion,
                                                    image:
                                                        product.imagen_url_completa ||
                                                        "/api/placeholder/300/250",
                                                    price: `$${parseFloat(
                                                        product.precio
                                                    ).toFixed(2)}`,
                                                    stock: product.stock,
                                                    category:
                                                        currentCategory?.name ||
                                                        "Sin categoría",
                                                    characteristics: [
                                                        `Stock: ${product.stock} unidades`,
                                                        `Categoría: ${
                                                            currentCategory?.name ||
                                                            "Sin categoría"
                                                        }`,
                                                        `Precio: $${parseFloat(
                                                            product.precio
                                                        ).toFixed(2)}`,
                                                        `Creado: ${new Date(
                                                            product.created_at
                                                        ).toLocaleDateString()}`,
                                                    ],
                                                    benefits:
                                                        product.descripcion,
                                                })
                                            }
                                            categoryColor={
                                                colors[index % colors.length]
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Sección de testimonios */}
                <TestimonialsSection />
            </main>

            {/* Modal de detalles del producto */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={closeProductModal}
                    isFavorite={favorites.includes(selectedProduct.id)}
                    onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
                />
            )}

            {/* Footer */}
            <footer
                className="py-12"
                style={{ backgroundColor: "#39393A", color: "#EFF7FF" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <div className="flex items-center mb-4">
                                <HexagonLogo color="#F8F32B" />
                                <span className="ml-3 font-bold text-xl">
                                    Sabiduría de la Colmena
                                </span>
                            </div>
                            <p className="text-gray-300">
                                Una comunidad dedicada a compartir conocimientos
                                y experiencias sobre apicultura.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Enlaces Rápidos
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/"
                                        className="hover:text-amber-400 transition"
                                    >
                                        Inicio
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/articulos"
                                        className="hover:text-amber-400 transition"
                                    >
                                        Artículos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/productos"
                                        className="hover:text-amber-400 transition"
                                    >
                                        Productos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/capacitaciones"
                                        className="hover:text-amber-400 transition"
                                    >
                                        Capacitaciones
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Contáctanos
                            </h3>
                            <p className="mb-2">
                                contacto@sabiduriacolmena.com
                            </p>
                            <p>+1 123 456 7890</p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                        <p>
                            © 2025 Sabiduría de la Colmena. Todos los derechos
                            reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Componentes auxiliares
const NavLink = ({ href, active, children }) => {
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                active
                    ? "bg-amber-500 text-gray-900"
                    : "text-gray-900 hover:bg-amber-500"
            }`}
        >
            {children}
        </Link>
    );
};

const MobileNavLink = ({ href, active, children }) => {
    return (
        <Link
            href={href}
            className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                active
                    ? "bg-amber-500 text-gray-900"
                    : "text-gray-900 hover:bg-amber-500"
            }`}
        >
            {children}
        </Link>
    );
};

const ProfileLink = ({ href, children }) => {
    return (
        <Link
            href={href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
            {children}
        </Link>
    );
};

// Componentes de hexágono y elementos gráficos
const HexagonLogo = ({ color = "#39393A", size = 36 }) => {
    return (
        <div className="relative">
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                />
                <circle cx="12" cy="12" r="3" fill={color} />
            </svg>
        </div>
    );
};

const HexagonIcon = ({ color = "#39393A", size = 24 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                stroke={color}
                strokeWidth="2"
                fill="none"
            />
        </svg>
    );
};

const HexagonButton = ({ color = "#E5E7EB", size = 80 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="drop-shadow-sm"
        >
            <path
                d="M50 5L86.6 25V75L50 95L13.4 75V25L50 5Z"
                fill={color}
                stroke="#D1D5DB"
                strokeWidth="1"
            />
        </svg>
    );
};

const BeeLogo = ({ width = 100, height = 100 }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="50" cy="50" r="35" fill="#F8F32B" />
            <path
                d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 25C56.07 25 61.78 26.95 66.41 30.22L33.78 62.85C30.51 58.22 28.56 52.51 28.56 46.44C28.56 34.62 38.18 25 50 25ZM50 75C43.93 75 38.22 73.05 33.59 69.78L66.22 37.15C69.49 41.78 71.44 47.49 71.44 53.56C71.44 65.38 61.82 75 50 75Z"
                fill="#39393A"
            />
            <circle cx="40" cy="40" r="5" fill="#39393A" />
            <circle cx="60" cy="60" r="5" fill="#39393A" />
        </svg>
    );
};

const HoneycombPattern = () => {
    const hexSize = 40;
    const hexagons = [];
    const rows = 8;
    const cols = 8;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const offsetX = col * hexSize * 1.5;
            const offsetY = row * hexSize * 1.732;
            const evenRowOffset = row % 2 === 0 ? 0 : hexSize * 0.75;

            hexagons.push(
                <g
                    key={`hex-${row}-${col}`}
                    transform={`translate(${
                        offsetX + evenRowOffset
                    }, ${offsetY})`}
                >
                    <path
                        d={`M ${hexSize},0 L ${hexSize * 0.5},${
                            hexSize * 0.866
                        } L ${-hexSize * 0.5},${
                            hexSize * 0.866
                        } L ${-hexSize},0 L ${-hexSize * 0.5},${
                            -hexSize * 0.866
                        } L ${hexSize * 0.5},${-hexSize * 0.866} Z`}
                        fill="transparent"
                        stroke="#F8F32B"
                        strokeOpacity={0.4}
                        strokeWidth="2"
                    />
                </g>
            );
        }
    }

    return (
        <div className="w-full h-96 relative overflow-hidden">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 600 400"
                preserveAspectRatio="xMidYMid meet"
                style={{ opacity: 0.7 }}
            >
                {hexagons}
            </svg>
        </div>
    );
};

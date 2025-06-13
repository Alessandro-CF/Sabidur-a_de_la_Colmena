// Componentes reutilizables para el sistema de perfil
import { ArrowLeft, User } from 'lucide-react';
import { Link } from '@inertiajs/react';

// Logo Hexagonal reutilizable
export const HexagonLogo = ({ size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="flex-shrink-0">
      <path
        d="M40 8 L65 23 L65 53 L40 68 L15 53 L15 23 Z"
        fill="#F8F32B"
        stroke="#39393A"
        strokeWidth="3"
      />
      <circle cx="40" cy="40" r="5" fill="#39393A" />
      <circle cx="30" cy="35" r="3" fill="#39393A" />
      <circle cx="50" cy="35" r="3" fill="#39393A" />
      <circle cx="35" cy="50" r="2" fill="#39393A" />
      <circle cx="45" cy="50" r="2" fill="#39393A" />
    </svg>
  );
};

// Header común para páginas de perfil
export const ProfileHeader = ({ title, backUrl, backText, actionButton }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link
              href={backUrl}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backText}
            </Link>
            <div className="flex items-center">
              <HexagonLogo />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">{title}</h1>
            </div>
          </div>
          
          {actionButton && (
            <div className="flex items-center">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Mensaje de feedback reutilizable
export const FeedbackMessage = ({ message, type }) => {
  if (!message) return null;
  
  const baseClasses = "mb-6 p-4 rounded-md border";
  const typeClasses = type === 'success' 
    ? "bg-green-50 text-green-800 border-green-200" 
    : "bg-red-50 text-red-800 border-red-200";
    
  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

// Loading spinner reutilizable
export const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <HexagonLogo size={60} />
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Avatar de usuario reutilizable
export const UserAvatar = ({ user, size = "large" }) => {
  const sizeClasses = {
    small: "h-10 w-10",
    medium: "h-16 w-16", 
    large: "h-20 w-20"
  };
  
  const iconSizes = {
    small: "h-5 w-5",
    medium: "h-8 w-8",
    large: "h-10 w-10"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg`}>
      <User className={`${iconSizes[size]} text-gray-500`} />
    </div>
  );
};

// Badge de rol reutilizable
export const RoleBadge = ({ role }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'moderator': return 'Moderador';
      default: return 'Usuario';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
      {getRoleText(role)}
    </span>
  );
};

// Botón primario estilizado
export const PrimaryButton = ({ children, onClick, disabled, loading, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 ${className}`}
      style={{ backgroundColor: '#F8F32B', color: '#39393A' }}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Procesando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Botón secundario estilizado
export const SecondaryButton = ({ children, onClick, disabled, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

// Campo de entrada con estilo consistente
export const InputField = ({ label, icon: Icon, error, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 inline mr-2" />}
        {label}
      </label>
      <div className="mt-1">
        <input
          {...props}
          className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${error ? 'border-red-300' : ''}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

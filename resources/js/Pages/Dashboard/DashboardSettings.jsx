import { useState, useEffect } from 'react';
import { 
  Save, 
  Settings as SettingsIcon, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Bell,
  Palette
} from 'lucide-react';

export default function DashboardSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Sabiduría de la Colmena',
    siteDescription: 'Plataforma de apicultura y productos naturales',
    contactEmail: 'contacto@sabiduriacolmena.com',
    allowRegistrations: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    enableNotifications: true,
    theme: 'light'
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Icon size={20} className="text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, type = "text", value, onChange, placeholder, disabled = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );

  const ToggleField = ({ label, description, checked, onChange }) => (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? 'bg-amber-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Configuración del Sistema</h2>
              <p className="text-gray-600 mt-1">
                Administra la configuración general de la plataforma
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : saved
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Guardando...' : saved ? 'Guardado' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración General */}
        <SettingSection title="Configuración General" icon={Globe}>
          <InputField
            label="Nombre del Sitio"
            value={settings.siteName}
            onChange={(value) => handleChange('siteName', value)}
            placeholder="Sabiduría de la Colmena"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Sitio
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Describe tu plataforma..."
            />
          </div>
          <InputField
            label="Email de Contacto"
            type="email"
            value={settings.contactEmail}
            onChange={(value) => handleChange('contactEmail', value)}
            placeholder="contacto@ejemplo.com"
          />
        </SettingSection>

        {/* Configuración de Usuarios */}
        <SettingSection title="Configuración de Usuarios" icon={Shield}>
          <ToggleField
            label="Permitir Registros"
            description="Permite que nuevos usuarios se registren en la plataforma"
            checked={settings.allowRegistrations}
            onChange={(value) => handleChange('allowRegistrations', value)}
          />
          <ToggleField
            label="Verificación de Email"
            description="Requiere que los usuarios verifiquen su email al registrarse"
            checked={settings.requireEmailVerification}
            onChange={(value) => handleChange('requireEmailVerification', value)}
          />
          <ToggleField
            label="Modo Mantenimiento"
            description="Desactiva temporalmente el acceso público al sitio"
            checked={settings.maintenanceMode}
            onChange={(value) => handleChange('maintenanceMode', value)}
          />
        </SettingSection>

        {/* Configuración de Notificaciones */}
        <SettingSection title="Notificaciones" icon={Bell}>
          <ToggleField
            label="Notificaciones del Sistema"
            description="Envía notificaciones sobre eventos importantes del sistema"
            checked={settings.enableNotifications}
            onChange={(value) => handleChange('enableNotifications', value)}
          />
          <InputField
            label="Email para Notificaciones"
            type="email"
            value={settings.contactEmail}
            onChange={(value) => handleChange('contactEmail', value)}
            placeholder="admin@ejemplo.com"
          />
        </SettingSection>

        {/* Configuración de Apariencia */}
        <SettingSection title="Apariencia" icon={Palette}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Principal
            </label>
            <div className="flex space-x-2">
              {['#F8F32B', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === '#F8F32B' ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => console.log('Color selected:', color)}
                />
              ))}
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Configuración Avanzada */}
      <SettingSection title="Configuración Avanzada" icon={Database}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Base de Datos</h4>
            <p className="text-xs text-gray-500 mb-3">Estado de la conexión y optimización</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Conectado</span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Cache</h4>
            <p className="text-xs text-gray-500 mb-3">Sistema de almacenamiento en cache</p>
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Limpiar Cache
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Copias de Seguridad</h4>
            <p className="text-xs text-gray-500 mb-3">Última copia: Hoy 03:00 AM</p>
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Crear Backup
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Logs del Sistema</h4>
            <p className="text-xs text-gray-500 mb-3">Archivos de registro y errores</p>
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Ver Logs
            </button>
          </div>
        </div>
      </SettingSection>

      {/* Información del Sistema */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Versión de Laravel:</span>
            <p className="font-medium">11.0</p>
          </div>
          <div>
            <span className="text-gray-500">Versión de PHP:</span>
            <p className="font-medium">8.3</p>
          </div>
          <div>
            <span className="text-gray-500">Última actualización:</span>
            <p className="font-medium">16 Jun 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

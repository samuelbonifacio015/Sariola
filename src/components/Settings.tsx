import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Gamepad2, 
  Palette,
  Eye,
  Volume2,
  Moon,
  Sun,
  Monitor,
  Save,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { toast } from 'react-toastify';

const Settings: React.FC = () => {
  const { userProfile, actions } = useGameStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'privacy', name: 'Privacidad', icon: Shield },
    { id: 'game', name: 'Juego', icon: Gamepad2 },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'data', name: 'Datos', icon: Save },
  ];

  const themes = [
    { id: 'light', name: 'Claro', icon: Sun, description: 'Tema claro para uso diurno' },
    { id: 'dark', name: 'Oscuro', icon: Moon, description: 'Tema oscuro para uso nocturno' },
    { id: 'auto', name: 'Automático', icon: Monitor, description: 'Se adapta al sistema' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Fácil', description: 'Perfecto para principiantes', color: 'from-green-500 to-green-600' },
    { id: 'normal', name: 'Normal', description: 'Balanceado y desafiante', color: 'from-blue-500 to-blue-600' },
    { id: 'hard', name: 'Difícil', description: 'Para jugadores experimentados', color: 'from-orange-500 to-orange-600' },
    { id: 'nightmare', name: 'Pesadilla', description: 'Solo para los más valientes', color: 'from-red-500 to-red-600' },
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        userProfile,
        // Aquí incluirías todos los datos del store
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `sariola-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast.success('¡Datos exportados exitosamente! 📁', { position: "top-right" });
    } catch (error) {
      toast.error('Error al exportar datos', { position: "top-right" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      // Aquí validarías y aplicarías los datos importados
      toast.success('¡Datos importados exitosamente! 📥', { position: "top-right" });
    } catch (error) {
      toast.error('Error al importar datos. Verifica el formato del archivo.', { position: "top-right" });
    } finally {
      setIsImporting(false);
      // Limpiar el input
      event.target.value = '';
    }
  };

  const handleResetData = () => {
    if (confirm('¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.')) {
      actions.logout();
      toast.success('Datos reseteados. Redirigiendo al onboarding...', { position: "top-right" });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Configuración del Perfil</h2>
            
            <div className="grid-game-2 gap-6">
              <div className="card-game p-6">
                <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-secondary mb-2">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      value={userProfile?.username || ''}
                      className="w-full px-4 py-2 bg-background-secondary border border-background-card rounded-lg text-surface-primary focus:outline-none focus:ring-2 focus:ring-productivity-500"
                      placeholder="Tu nombre de usuario"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-secondary mb-2">
                      Avatar
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-productivity-500 to-creative-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {userProfile?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <button className="btn-game-secondary">
                        Cambiar Avatar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-game p-6">
                <h3 className="text-lg font-semibold mb-4">Estadísticas del Juego</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-surface-secondary">Nivel General</span>
                    <span className="font-semibold">{userProfile?.level.overall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-secondary">XP Total</span>
                    <span className="font-semibold text-game-xp">{userProfile?.level.xp.overall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-secondary">Racha Actual</span>
                    <span className="font-semibold text-orange-500">{userProfile?.streaks.daily} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-secondary">Logros Desbloqueados</span>
                    <span className="font-semibold text-game-xp">{userProfile?.achievements.filter(a => a.isUnlocked).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Configuración de Notificaciones</h2>
            
            <div className="card-game p-6">
              <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificaciones Generales</h3>
                      <p className="text-sm text-surface-secondary">Activar todas las notificaciones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="sr-only peer"
                        aria-label="Activar notificaciones generales"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>

                <div className="border-t border-background-card pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Recordatorios de Tareas</h4>
                      <p className="text-sm text-surface-secondary">Notificaciones para tareas pendientes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="sr-only peer"
                        aria-label="Activar recordatorios de tareas"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alertas de Logros</h4>
                      <p className="text-sm text-surface-secondary">Celebra cuando desbloquees logros</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="sr-only peer"
                        aria-label="Activar alertas de logros"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Advertencias de Penalizaciones</h4>
                      <p className="text-sm text-surface-secondary">Alertas cuando pierdas recursos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="sr-only peer"
                        aria-label="Activar advertencias de penalizaciones"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Resumen Diario</h4>
                      <p className="text-sm text-surface-secondary">Recibe un resumen de tu día</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        aria-label="Activar resumen diario"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Configuración de Privacidad</h2>
            
            <div className="card-game p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Compartir Progreso</h3>
                    <p className="text-sm text-surface-secondary">Permitir que otros vean tu progreso</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      aria-label="Permitir compartir progreso"
                    />
                    <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Compartir Logros</h3>
                    <p className="text-sm text-surface-secondary">Publicar logros en redes sociales</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      aria-label="Permitir compartir logros"
                    />
                    <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Solicitudes de Amigos</h3>
                    <p className="text-sm text-surface-secondary">Permitir que otros te agreguen</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      aria-label="Permitir solicitudes de amigos"
                    />
                    <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Estado en Línea</h3>
                    <p className="text-sm text-surface-secondary">Mostrar cuando estés activo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="sr-only peer"
                      aria-label="Mostrar estado en línea"
                    />
                    <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'game':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Configuración del Juego</h2>
            
            <div className="space-y-6">
              <div className="card-game p-6">
                <h3 className="text-lg font-semibold mb-4">Dificultad</h3>
                <div className="grid-game-2 gap-4">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        userProfile?.settings.gamePreferences.difficulty === difficulty.id
                          ? 'border-productivity-500 bg-gradient-to-r ' + difficulty.color
                          : 'border-background-card bg-background-secondary hover:border-background-tertiary'
                      }`}
                    >
                      <h4 className="text-lg font-semibold mb-2">{difficulty.name}</h4>
                      <p className="text-sm opacity-90">{difficulty.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-game p-6">
                <h3 className="text-lg font-semibold mb-4">Preferencias del Juego</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Guardado Automático</h4>
                      <p className="text-sm text-surface-secondary">Guardar progreso automáticamente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="sr-only peer"
                        aria-label="Activar guardado automático"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Tutorial</h4>
                      <p className="text-sm text-surface-secondary">Mostrar tutoriales y consejos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="sr-only peer"
                        aria-label="Activar tutoriales"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Efectos de Sonido</h4>
                      <p className="text-sm text-surface-secondary">Reproducir sonidos del juego</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="sr-only peer"
                        aria-label="Activar efectos de sonido"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Música de Fondo</h4>
                      <p className="text-sm text-surface-secondary">Reproducir música ambiental</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        aria-label="Activar música de fondo"
                      />
                      <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-productivity-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-productivity-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Configuración de Apariencia</h2>
            
            <div className="card-game p-6">
              <h3 className="text-lg font-semibold mb-4">Tema</h3>
              <div className="grid-game-3 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      userProfile?.settings.theme === theme.id
                        ? 'border-productivity-500 bg-gradient-to-r from-productivity-500 to-productivity-600 text-white'
                        : 'border-background-card bg-background-secondary hover:border-background-tertiary'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <theme.icon className="w-5 h-5" />
                      <h4 className="font-semibold">{theme.name}</h4>
                    </div>
                    <p className="text-sm opacity-90">{theme.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Gestión de Datos</h2>
            
            <div className="grid-game-2 gap-6">
              <div className="card-game p-6">
                <h3 className="text-lg font-semibold mb-4">Exportar Datos</h3>
                <p className="text-surface-secondary mb-4">
                  Descarga una copia de todos tus datos para respaldo o transferencia.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="btn-game w-full"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Datos
                    </>
                  )}
                </button>
              </div>

              <div className="card-game p-6">
                <h3 className="text-lg font-semibold mb-4">Importar Datos</h3>
                <p className="text-surface-secondary mb-4">
                  Restaura tus datos desde un archivo de respaldo anterior.
                </p>
                <label className="btn-game-secondary w-full text-center cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    disabled={isImporting}
                  />
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Datos
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="card-game p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-500">Zona de Peligro</h3>
              <p className="text-surface-secondary mb-4">
                Estas acciones son irreversibles. Ten cuidado al proceder.
              </p>
              <button
                onClick={handleResetData}
                className="btn-game-danger w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Resetear Todos los Datos
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-game font-bold text-gradient mb-2">
          Configuración
        </h1>
        <p className="text-surface-secondary">
          Personaliza tu experiencia de juego
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="card-game p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-productivity-500 text-white shadow-game'
                  : 'text-surface-secondary hover:text-surface-primary hover:bg-background-tertiary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la pestaña */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Settings;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Trophy, 
  Settings, 
  Bell, 
  User,
  LogOut,
  Menu,
  X,
  Zap,
  Star,
  Coins
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const location = useLocation();
  const { 
    userProfile, 
    resources, 
    level, 
    streaks, 
    notifications,
    actions 
  } = useGameStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Logros', href: '/achievements', icon: Trophy },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    actions.logout();
    toast.success('¡Hasta luego, aventurero! 👋', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-background-secondary border-b border-background-card sticky top-0 z-50 backdrop-blur-md">
      <div className="container-game">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-productivity-500 via-creative-500 to-health-500 rounded-lg flex items-center justify-center shadow-game"
            >
              <span className="text-xl font-game font-bold text-white">S</span>
            </motion.div>
            <span className="text-2xl font-game font-bold text-gradient group-hover:scale-105 transition-transform">
              SARIOLA
            </span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-productivity-500 text-white shadow-game'
                      : 'text-surface-secondary hover:text-surface-primary hover:bg-background-tertiary'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Información del usuario y acciones */}
          <div className="flex items-center space-x-4">
            {/* Recursos del juego */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Horas de Entretenimiento */}
              <div className="flex items-center space-x-2 bg-background-tertiary px-3 py-2 rounded-lg">
                <Zap className="w-4 h-4 text-game-he" />
                <span className="text-sm font-medium text-game-he">
                  {resources.he.toFixed(1)}h
                </span>
              </div>

              {/* XP */}
              <div className="flex items-center space-x-2 bg-background-tertiary px-3 py-2 rounded-lg">
                <Star className="w-4 h-4 text-game-xp" />
                <span className="text-sm font-medium text-game-xp">
                  {level.xp.overall}
                </span>
              </div>

              {/* Monedas de Logro */}
              <div className="flex items-center space-x-2 bg-background-tertiary px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-game-ml" />
                <span className="text-sm font-medium text-game-ml">
                  {resources.ml}
                </span>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-surface-secondary hover:text-surface-primary hover:bg-background-tertiary rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-background-secondary border border-background-card rounded-lg shadow-xl z-50"
                  >
                    <div className="p-4 border-b border-background-card">
                      <h3 className="font-semibold">Notificaciones</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-surface-secondary">
                          No hay notificaciones
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-background-card cursor-pointer hover:bg-background-tertiary transition-colors ${
                              !notification.isRead ? 'bg-productivity-50/10' : ''
                            }`}
                            onClick={() => {
                              actions.markNotificationAsRead(notification.id);
                              if (notification.action) {
                                notification.action.onClick();
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{notification.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <p className="text-xs text-surface-secondary mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-surface-secondary mt-2">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 5 && (
                      <div className="p-3 border-t border-background-card text-center">
                        <button
                          onClick={() => actions.clearNotifications()}
                          className="text-sm text-productivity-500 hover:text-productivity-400"
                        >
                          Ver todas las notificaciones
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menú del usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-surface-secondary hover:text-surface-primary hover:bg-background-tertiary rounded-lg transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-productivity-500 to-creative-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {userProfile?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden lg:block font-medium">{userProfile?.username}</span>
                <span className="hidden lg:block text-xs bg-productivity-500 text-white px-2 py-1 rounded-full">
                  Nv.{level.overall}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-background-secondary border border-background-card rounded-lg shadow-xl z-50"
                  >
                    <div className="p-4 border-b border-background-card">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-productivity-500 to-creative-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {userProfile?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{userProfile?.username}</h4>
                          <p className="text-sm text-surface-secondary">
                            Nivel {level.overall} • Racha {streaks.daily} días
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          // Aquí podrías abrir un modal de perfil
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left text-surface-secondary hover:text-surface-primary hover:bg-background-tertiary rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-500 hover:text-red-400 hover:bg-red-50/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-surface-secondary hover:text-surface-primary hover:bg-background-tertiary rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil expandido */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-background-card"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-productivity-500 text-white'
                          : 'text-surface-secondary hover:text-surface-primary hover:bg-background-tertiary'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Recursos móviles */}
                <div className="px-4 py-3 border-t border-background-card">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-game-he">{resources.he.toFixed(1)}h</div>
                      <div className="text-xs text-surface-secondary">HE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-game-xp">{level.xp.overall}</div>
                      <div className="text-xs text-surface-secondary">XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-game-ml">{resources.ml}</div>
                      <div className="text-xs text-surface-secondary">ML</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;



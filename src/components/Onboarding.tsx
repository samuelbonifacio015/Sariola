import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as motion3d } from 'framer-motion-3d';
import { 
  User, 
  Target, 
  Trophy, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Star
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { UserProfile, UserSettings } from '@/types';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    avatar: 'default',
    difficulty: 'normal' as const,
    notifications: true,
    theme: 'dark' as const
  });
  
  const { actions } = useGameStore();

  const steps = [
    {
      title: '¡Bienvenido a Sariola!',
      subtitle: 'Tu aventura de productividad está a punto de comenzar',
      icon: Star,
      color: 'from-productivity-500 to-creative-500'
    },
    {
      title: 'Personaliza tu perfil',
      subtitle: 'Configura tu identidad de jugador',
      icon: User,
      color: 'from-health-500 to-social-500'
    },
    {
      title: 'Elige tu dificultad',
      subtitle: 'Selecciona el nivel de desafío que prefieres',
      icon: Target,
      color: 'from-creative-500 to-productivity-500'
    },
    {
      title: '¡Listo para jugar!',
      subtitle: 'Tu viaje épico comienza ahora',
      icon: Trophy,
      color: 'from-social-500 to-health-500'
    }
  ];

  const avatars = [
    { id: 'default', name: 'Explorador', icon: '🚀' },
    { id: 'warrior', name: 'Guerrero', icon: '⚔️' },
    { id: 'mage', name: 'Mago', icon: '🔮' },
    { id: 'archer', name: 'Arquero', icon: '🏹' },
    { id: 'healer', name: 'Sanador', icon: '💚' },
    { id: 'rogue', name: 'Pícaro', icon: '🗡️' }
  ];

  const difficulties = [
    { id: 'easy', name: 'Fácil', description: 'Perfecto para principiantes', color: 'from-green-500 to-green-600' },
    { id: 'normal', name: 'Normal', description: 'Balanceado y desafiante', color: 'from-blue-500 to-blue-600' },
    { id: 'hard', name: 'Difícil', description: 'Para jugadores experimentados', color: 'from-orange-500 to-orange-600' },
    { id: 'nightmare', name: 'Pesadilla', description: 'Solo para los más valientes', color: 'from-red-500 to-red-600' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Crear perfil de usuario
    const userProfile: UserProfile = {
      id: crypto.randomUUID(),
      username: formData.username,
      avatar: {
        id: formData.avatar,
        name: avatars.find(a => a.id === formData.avatar)?.name || 'Explorador',
        imageUrl: `/avatars/${formData.avatar}.png`,
        isUnlocked: true,
        unlockCondition: 'Usuario inicial'
      },
      level: {
        overall: 1,
        productivity: 1,
        health: 1,
        creative: 1,
        social: 1,
        xp: {
          overall: 0,
          productivity: 0,
          health: 0,
          creative: 0,
          social: 0
        },
        nextLevelXp: {
          overall: 100,
          productivity: 100,
          health: 100,
          creative: 100,
          social: 100
        }
      },
      resources: {
        he: 6,
        heUsedToday: 0,
        heMaxDaily: 6,
        xp: 0,
        ml: 0
      },
      streaks: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        categories: {
          productivity: 0,
          health: 0,
          creative: 0,
          social: 0
        },
        lastCompletedDate: new Date()
      },
      penalties: [],
      achievements: [],
      settings: {
        theme: formData.theme,
        language: 'es',
        notifications: {
          enabled: formData.notifications,
          sound: true,
          vibration: true,
          taskReminders: true,
          achievementAlerts: true,
          penaltyWarnings: true,
          dailyRecap: true
        },
        privacy: {
          shareProgress: false,
          shareAchievements: false,
          allowFriendRequests: false,
          showOnlineStatus: true
        },
        gamePreferences: {
          difficulty: formData.difficulty,
          autoSave: true,
          tutorialEnabled: true,
          soundEffects: true,
          backgroundMusic: true
        }
      },
      analytics: {
        daily: {
          date: new Date(),
          tasksCompleted: 0,
          totalXp: 0,
          heEarned: 0,
          heUsed: 0,
          mood: 7,
          energy: 7,
          productivity: 7
        },
        weekly: {
          weekStart: new Date(),
          weekEnd: new Date(),
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0,
          totalXp: 0,
          totalHe: 0,
          categoryBreakdown: {
            productivity: 0,
            health: 0,
            creative: 0,
            social: 0
          },
          streakDays: 0
        },
        monthly: {
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0,
          totalXp: 0,
          totalHe: 0,
          achievementsUnlocked: 0,
          levelUps: 0,
          categoryBreakdown: {
            productivity: 0,
            health: 0,
            creative: 0,
            social: 0
          }
        },
        yearly: {
          year: new Date().getFullYear(),
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0,
          totalXp: 0,
          totalHe: 0,
          achievementsUnlocked: 0,
          levelUps: 0,
          categoryBreakdown: {
            productivity: 0,
            health: 0,
            creative: 0,
            social: 0
          },
          personalGrowth: 0
        }
      },
      createdAt: new Date(),
      lastActive: new Date()
    };

    actions.login(userProfile);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-productivity-500 via-creative-500 to-health-500 rounded-full flex items-center justify-center shadow-game-glow">
              <span className="text-6xl font-game font-bold text-white">S</span>
            </div>
            
            <div>
              <h2 className="text-3xl font-game font-bold text-gradient mb-4">
                ¡Bienvenido a Sariola!
              </h2>
              <p className="text-lg text-surface-secondary max-w-md mx-auto">
                Transforma tu productividad diaria en una aventura épica llena de logros, 
                recompensas y desafíos emocionantes.
              </p>
            </div>

            <div className="grid-game-3 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-productivity-100 rounded-full flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-productivity-600" />
                </div>
                <h3 className="font-semibold text-productivity-600">Objetivos Claros</h3>
                <p className="text-sm text-surface-secondary">Define y alcanza tus metas</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-health-100 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="w-8 h-8 text-health-600" />
                </div>
                <h3 className="font-semibold text-health-600">Logros Desbloqueables</h3>
                <p className="text-sm text-surface-secondary">Gana recompensas por tu esfuerzo</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-creative-100 rounded-full flex items-center justify-center mb-3">
                  <Zap className="w-8 h-8 text-creative-600" />
                </div>
                <h3 className="font-semibold text-creative-600">Motivación Constante</h3>
                <p className="text-sm text-surface-secondary">Mantén tu impulso diario</p>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Nombre de Usuario</h3>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ingresa tu nombre de jugador"
                className="w-full max-w-md px-4 py-3 bg-background-secondary border border-background-card rounded-lg text-surface-primary placeholder-surface-secondary focus:outline-none focus:ring-2 focus:ring-productivity-500"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Selecciona tu Avatar</h3>
              <div className="grid-game-3 max-w-2xl mx-auto">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setFormData({ ...formData, avatar: avatar.id })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.avatar === avatar.id
                        ? 'border-productivity-500 bg-productivity-50'
                        : 'border-background-card bg-background-secondary hover:border-background-tertiary'
                    }`}
                  >
                    <div className="text-4xl mb-2">{avatar.icon}</div>
                    <div className="text-sm font-medium">{avatar.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Nivel de Dificultad</h3>
              <p className="text-surface-secondary">Elige el desafío que mejor se adapte a ti</p>
            </div>

            <div className="grid-game-2 max-w-3xl mx-auto">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setFormData({ ...formData, difficulty: difficulty.id })}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.difficulty === difficulty.id
                      ? 'border-productivity-500 bg-gradient-to-r ' + difficulty.color
                      : 'border-background-card bg-background-secondary hover:border-background-tertiary'
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">{difficulty.name}</h4>
                  <p className="text-sm opacity-90">{difficulty.description}</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <label className="flex items-center justify-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  className="w-4 h-4 text-productivity-600 bg-background-secondary border-background-card rounded focus:ring-productivity-500"
                />
                <span>Recibir notificaciones</span>
              </label>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-productivity-500 to-creative-500 rounded-full flex items-center justify-center shadow-game-glow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-game font-bold text-gradient mb-4">
                ¡Configuración Completada!
              </h3>
              <p className="text-lg text-surface-secondary max-w-md mx-auto">
                Tu perfil está listo. Prepárate para embarcarte en una aventura épica 
                de productividad y logros.
              </p>
            </div>

            <div className="bg-background-secondary rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold mb-3">Resumen de tu configuración:</h4>
              <div className="space-y-2 text-sm text-surface-secondary">
                <div className="flex justify-between">
                  <span>Usuario:</span>
                  <span className="text-surface-primary">{formData.username}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avatar:</span>
                  <span className="text-surface-primary">{avatars.find(a => a.id === formData.avatar)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dificultad:</span>
                  <span className="text-surface-primary">{difficulties.find(d => d.id === formData.difficulty)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Notificaciones:</span>
                  <span className="text-surface-primary">{formData.notifications ? 'Activadas' : 'Desactivadas'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header del onboarding */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-game font-bold text-gradient mb-2"
          >
            SARIOLA
          </motion.h1>
          <p className="text-surface-secondary">Tu viaje comienza aquí</p>
        </div>

        {/* Contenido principal */}
        <div className="card-game p-8">
          {/* Indicador de progreso */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r ' + step.color + ' text-white'
                      : 'bg-background-tertiary text-surface-secondary'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      index < currentStep
                        ? 'bg-gradient-to-r ' + step.color
                        : 'bg-background-tertiary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Título del paso actual */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">{steps[currentStep].title}</h2>
            <p className="text-surface-secondary">{steps[currentStep].subtitle}</p>
          </div>

          {/* Contenido del paso */}
          <div className="min-h-96 flex items-center justify-center">
            {renderStepContent()}
          </div>

          {/* Navegación */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                currentStep === 0
                  ? 'bg-background-tertiary text-surface-secondary cursor-not-allowed'
                  : 'btn-game-secondary hover:bg-background-tertiary'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={!formData.username}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  !formData.username
                    ? 'bg-background-tertiary text-surface-secondary cursor-not-allowed'
                    : 'btn-game hover:from-productivity-600 hover:to-productivity-700'
                }`}
              >
                <span>¡Comenzar Aventura!</span>
                <Zap className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !formData.username}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  currentStep === 1 && !formData.username
                    ? 'bg-background-tertiary text-surface-secondary cursor-not-allowed'
                    : 'btn-game'
                }`}
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;



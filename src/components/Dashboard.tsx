import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Star, 
  Coins,
  Trophy,
  Flame,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { Task, TaskCategory } from '@/types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const { 
    tasks, 
    resources, 
    level, 
    streaks, 
    achievements,
    actions 
  } = useGameStore();

  const [isAddingTask, setIsAddingTask] = useState(false);

  // Estadísticas calculadas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const tasksByCategory = {
    productivity: tasks.filter(task => task.category === 'productivity').length,
    health: tasks.filter(task => task.category === 'health').length,
    creative: tasks.filter(task => task.category === 'creative').length,
    social: tasks.filter(task => task.category === 'social').length,
  };

  const completedByCategory = {
    productivity: tasks.filter(task => task.category === 'productivity' && task.status === 'done').length,
    health: tasks.filter(task => task.category === 'health' && task.status === 'done').length,
    creative: tasks.filter(task => task.category === 'creative' && task.status === 'done').length,
    social: tasks.filter(task => task.category === 'social' && task.status === 'done').length,
  };

  const categoryProgress = Object.keys(tasksByCategory).map(category => ({
    category: category as TaskCategory,
    total: tasksByCategory[category as TaskCategory],
    completed: completedByCategory[category as TaskCategory],
    percentage: tasksByCategory[category as TaskCategory] > 0 
      ? Math.round((completedByCategory[category as TaskCategory] / tasksByCategory[category as TaskCategory]) * 100)
      : 0
  }));

  const recentTasks = tasks
    .filter(task => task.status !== 'archived')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const handleAddTask = () => {
    setIsAddingTask(true);
    // Aquí podrías abrir un modal para crear tareas
    toast.info('Funcionalidad de creación de tareas próximamente! 🚀', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const getCategoryColor = (category: TaskCategory) => {
    const colors = {
      productivity: 'from-productivity-500 to-productivity-600',
      health: 'from-health-500 to-health-600',
      creative: 'from-creative-500 to-creative-600',
      social: 'from-social-500 to-social-600'
    };
    return colors[category];
  };

  const getCategoryIcon = (category: TaskCategory) => {
    const icons = {
      productivity: '⚡',
      health: '💚',
      creative: '🎨',
      social: '👥'
    };
    return icons[category];
  };

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-game font-bold text-gradient">
            Dashboard
          </h1>
          <p className="text-surface-secondary mt-2">
            Bienvenido de vuelta, aventurero. ¿Listo para conquistar el día?
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddTask}
          className="btn-game mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Tarea
        </motion.button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid-game-4">
        {/* Horas de Entretenimiento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-game p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-secondary text-sm">Horas de Entretenimiento</p>
              <p className="text-2xl font-bold text-game-he">
                {resources.he.toFixed(1)}h
              </p>
              <p className="text-xs text-surface-secondary">
                Máximo: {resources.heMaxDaily}h
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-game-he to-green-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-surface-secondary mb-1">
              <span>Usado hoy</span>
              <span>{resources.heUsedToday.toFixed(1)}h</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill-health"
                style={{ width: `${(resources.heUsedToday / resources.heMaxDaily) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* XP Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-game p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-secondary text-sm">Puntos de Experiencia</p>
              <p className="text-2xl font-bold text-game-xp">
                {level.xp.overall}
              </p>
              <p className="text-xs text-surface-secondary">
                Nivel {level.overall}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-game-xp to-yellow-600 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Progreso al siguiente nivel */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-surface-secondary mb-1">
              <span>Próximo nivel</span>
              <span>{level.xp.overall}/{level.nextLevelXp.overall}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(level.xp.overall / level.nextLevelXp.overall) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Monedas de Logro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-game p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-secondary text-sm">Monedas de Logro</p>
              <p className="text-2xl font-bold text-game-ml">
                {resources.ml}
              </p>
              <p className="text-xs text-surface-secondary">
                Acumuladas
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-game-ml to-orange-600 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-surface-secondary">
              Desbloquea recompensas especiales
            </p>
          </div>
        </motion.div>

        {/* Racha de días */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-game p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-secondary text-sm">Racha de Días</p>
              <p className="text-2xl font-bold text-orange-500">
                {streaks.daily}
              </p>
              <p className="text-xs text-surface-secondary">
                días consecutivos
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-surface-secondary">
              ¡Mantén la racha!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Progreso por categorías */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-game p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-productivity-500" />
          Progreso por Categorías
        </h2>
        
        <div className="grid-game-2 lg:grid-cols-4 gap-4">
          {categoryProgress.map((cat) => (
            <div key={cat.category} className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-background-secondary to-background-tertiary rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">{getCategoryIcon(cat.category)}</span>
              </div>
              <h3 className="font-medium capitalize mb-2">{cat.category}</h3>
              <div className="progress-bar mb-2">
                <div 
                  className={`progress-fill ${
                    cat.category === 'health' ? 'progress-fill-health' :
                    cat.category === 'creative' ? 'progress-fill-creative' :
                    cat.category === 'social' ? 'progress-fill-social' : ''
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <p className="text-sm text-surface-secondary">
                {cat.completed}/{cat.total} ({cat.percentage}%)
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resumen de tareas */}
      <div className="grid-game-2 gap-6">
        {/* Tareas recientes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card-game p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-productivity-500" />
            Tareas Recientes
          </h2>
          
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 text-surface-secondary">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay tareas aún</p>
              <p className="text-sm">¡Crea tu primera tarea para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getCategoryIcon(task.category)}</span>
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-surface-secondary capitalize">
                        {task.category} • {task.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`status-indicator ${
                      task.status === 'todo' ? 'status-todo' :
                      task.status === 'in-progress' ? 'status-in-progress' :
                      task.status === 'done' ? 'status-done' : 'status-archived'
                    }`}>
                      {task.status === 'todo' ? 'Pendiente' :
                       task.status === 'in-progress' ? 'En Progreso' :
                       task.status === 'done' ? 'Completada' : 'Archivada'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Logros recientes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="card-game p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-game-xp" />
            Logros Recientes
          </h2>
          
          {achievements.filter(a => a.isUnlocked).length === 0 ? (
            <div className="text-center py-8 text-surface-secondary">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay logros aún</p>
              <p className="text-sm">¡Completa tareas para desbloquear logros!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements
                .filter(a => a.isUnlocked)
                .slice(0, 5)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-background-tertiary rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-game-xp to-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-surface-secondary">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Estadísticas generales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-game p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-productivity-500" />
          Estadísticas Generales
        </h2>
        
        <div className="grid-game-4">
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-productivity-500">{totalTasks}</div>
            <div className="text-sm text-surface-secondary">Total de Tareas</div>
          </div>
          
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-health-500">{completedTasks}</div>
            <div className="text-sm text-surface-secondary">Completadas</div>
          </div>
          
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-creative-500">{completionRate}%</div>
            <div className="text-sm text-surface-secondary">Tasa de Completado</div>
          </div>
          
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-social-500">{streaks.daily}</div>
            <div className="text-sm text-surface-secondary">Días Activo</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;



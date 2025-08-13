import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, MoreVertical, Edit, Trash2, Play, Pause, CheckCircle } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { Task, TaskStatus, TaskCategory } from '@/types';
import { toast } from 'react-toastify';

const TaskBoard: React.FC = () => {
  const { 
    tasks, 
    filteredTasks, 
    activeCategory, 
    searchQuery,
    actions 
  } = useGameStore();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'Pendiente', color: 'from-yellow-500 to-orange-500' },
    { id: 'in-progress', title: 'En Progreso', color: 'from-blue-500 to-indigo-500' },
    { id: 'done', title: 'Completada', color: 'from-green-500 to-emerald-500' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
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

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const handleTaskAction = (task: Task, action: 'start' | 'pause' | 'complete' | 'delete') => {
    switch (action) {
      case 'start':
        actions.startTask(task.id);
        toast.success('¡Tarea iniciada! 🚀', { position: "top-right" });
        break;
      case 'pause':
        actions.pauseTask(task.id);
        toast.info('Tarea pausada', { position: "top-right" });
        break;
      case 'complete':
        actions.completeTask(task.id);
        toast.success('¡Tarea completada! 🎉', { position: "top-right" });
        break;
      case 'delete':
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
          actions.deleteTask(task.id);
          toast.success('Tarea eliminada', { position: "top-right" });
        }
        break;
    }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -2 }}
      className="card-game p-4 mb-3 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCategoryIcon(task.category)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority === 'low' ? 'Baja' :
             task.priority === 'medium' ? 'Media' :
             task.priority === 'high' ? 'Alta' : 'Crítica'}
          </span>
        </div>
        
        <div className="relative">
          <button 
            className="p-1 hover:bg-background-tertiary rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Más opciones"
            aria-label="Más opciones"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-xs text-surface-secondary mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-surface-secondary mb-3">
        <span>⏱️ {task.estimatedTime} min</span>
        <span>⭐ {task.difficulty}/5</span>
      </div>

      {/* Recompensas */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs text-game-he">⚡ {task.rewards.he}min HE</span>
        <span className="text-xs text-game-xp">⭐ {task.rewards.xp} XP</span>
        {task.rewards.ml && (
          <span className="text-xs text-game-ml">🪙 {task.rewards.ml} ML</span>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-background-tertiary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 bg-background-tertiary text-xs rounded-full">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {task.status === 'todo' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTaskAction(task, 'start');
              }}
              className="p-1 hover:bg-productivity-100 rounded transition-colors"
              title="Iniciar tarea"
            >
              <Play className="w-4 h-4 text-productivity-600" />
            </button>
          )}
          
          {task.status === 'in-progress' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(task, 'pause');
                }}
                className="p-1 hover:bg-yellow-100 rounded transition-colors"
                title="Pausar tarea"
              >
                <Pause className="w-4 h-4 text-yellow-600" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(task, 'complete');
                }}
                className="p-1 hover:bg-green-100 rounded transition-colors"
                title="Completar tarea"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(task);
            }}
            className="p-1 hover:bg-background-tertiary rounded transition-colors"
            title="Editar tarea"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTaskAction(task, 'delete');
            }}
            className="p-1 hover:bg-red-100 rounded transition-colors"
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-game font-bold text-gradient">
            Tablero de Tareas
          </h1>
          <p className="text-surface-secondary mt-2">
            Organiza y gestiona tus misiones diarias
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingTask(true)}
          className="btn-game mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Tarea
        </motion.button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card-game p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Filtros por categoría */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-surface-secondary" />
            <span className="text-sm font-medium text-surface-secondary">Filtrar:</span>
            
            <button
              onClick={() => actions.setActiveCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-productivity-500 text-white'
                  : 'bg-background-tertiary text-surface-secondary hover:bg-background-card'
              }`}
            >
              Todas
            </button>
            
            {(['productivity', 'health', 'creative', 'social'] as TaskCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => actions.setActiveCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-productivity-500 text-white'
                    : 'bg-background-tertiary text-surface-secondary hover:bg-background-card'
                }`}
              >
                {category === 'productivity' ? 'Productividad' :
                 category === 'health' ? 'Salud' :
                 category === 'creative' ? 'Creatividad' : 'Social'}
              </button>
            ))}
          </div>

          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-secondary" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background-tertiary border border-background-card rounded-lg text-surface-primary placeholder-surface-secondary focus:outline-none focus:ring-2 focus:ring-productivity-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Header de columna */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 bg-gradient-to-r ${column.color} rounded-full`} />
                <h3 className="font-semibold">{column.title}</h3>
                <span className="px-2 py-1 bg-background-tertiary text-xs rounded-full">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
            </div>

            {/* Tareas de la columna */}
            <div className="min-h-[400px]">
              {getTasksByStatus(column.id).length === 0 ? (
                <div className="text-center py-8 text-surface-secondary">
                  <p className="text-sm">No hay tareas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTasksByStatus(column.id).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas del tablero */}
      <div className="card-game p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del Tablero</h2>
        <div className="grid-game-4">
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-yellow-500">
              {getTasksByStatus('todo').length}
            </div>
            <div className="text-sm text-surface-secondary">Pendientes</div>
          </div>
          
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-blue-500">
              {getTasksByStatus('in-progress').length}
            </div>
            <div className="text-sm text-surface-secondary">En Progreso</div>
          </div>
          
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-green-500">
              {getTasksByStatus('done').length}
            </div>
            <div className="text-sm text-surface-secondary">Completadas</div>
          </div>
          
          <div className="text-center p-4 bg-background-tertiary rounded-lg">
            <div className="text-2xl font-bold text-productivity-500">
              {tasks.length}
            </div>
            <div className="text-sm text-surface-secondary">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;

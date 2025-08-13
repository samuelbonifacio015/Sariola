import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, MoreVertical, Edit, Trash2, Play, Pause, CheckCircle } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { Task, TaskStatus, TaskCategory } from '@/types';
import { toast } from 'react-toastify';

const TaskBoard: React.FC = () => {
  const { 
    tasks, 
    activeCategory, 
    searchQuery,
    isTaskModalOpen,
    actions 
  } = useGameStore();

  // El modal ahora usa el estado global del store: isTaskModalOpen

  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    category: 'productivity' as TaskCategory,
    priority: 'medium' as Task['priority'],
    difficulty: 3 as Task['difficulty'],
    estimatedTime: 30,
    tags: '',
    isRecurring: false,
    dueDate: '' as string
  });

  const resetNewTaskForm = () => {
    setNewTaskData({
      title: '',
      description: '',
      category: 'productivity',
      priority: 'medium',
      difficulty: 3,
      estimatedTime: 30,
      tags: '',
      isRecurring: false,
      dueDate: ''
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    const parsedTags = newTaskData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    actions.addTask({
      title: newTaskData.title.trim(),
      description: newTaskData.description.trim() || undefined,
      category: newTaskData.category,
      priority: newTaskData.priority,
      difficulty: newTaskData.difficulty,
      estimatedTime: Number(newTaskData.estimatedTime) || 0,
      status: 'todo',
      tags: parsedTags,
      isRecurring: newTaskData.isRecurring,
      dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate) : undefined
    });

    toast.success('Tarea creada ✅', { position: 'top-right' });
    resetNewTaskForm();
    actions.closeTaskModal();
  };

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'Pendiente', color: 'from-yellow-500 to-orange-500' },
    { id: 'in-progress', title: 'En Progreso', color: 'from-blue-500 to-indigo-500' },
    { id: 'done', title: 'Completada', color: 'from-green-500 to-emerald-500' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    // Filtrar por categoría activa si no es 'all'
    let filteredTasks = tasks;
    if (activeCategory !== 'all') {
      filteredTasks = tasks.filter(task => task.category === activeCategory);
    }
    
    // Filtrar por búsqueda si existe
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filtrar por estado
    return filteredTasks.filter(task => task.status === status);
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
      whileHover={{ y: -2, scale: 1.02 }}
      className="card-game p-4 mb-3 cursor-pointer group border-l-4 hover:shadow-lg transition-all duration-200"
      style={{
        borderLeftColor: task.category === 'productivity' ? '#3B82F6' :
                        task.category === 'health' ? '#10B981' :
                        task.category === 'creative' ? '#8B5CF6' : '#F59E0B'
      }}
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
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <span>⏱️</span>
            <span className="font-medium">{task.estimatedTime} min</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>⭐</span>
            <span className="font-medium">{task.difficulty}/5</span>
          </span>
        </div>
        {task.dueDate && (
          <span className="text-orange-500 font-medium">
            📅 {new Date(task.dueDate).toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: '2-digit' 
            })}
          </span>
        )}
      </div>

      {/* Recompensas */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100/20 rounded-full">
          <span className="text-blue-400">⚡</span>
          <span className="text-xs text-blue-400 font-medium">{task.rewards.he}min HE</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100/20 rounded-full">
          <span className="text-yellow-400">⭐</span>
          <span className="text-xs text-yellow-400 font-medium">{task.rewards.xp} XP</span>
        </div>
        {task.rewards.ml && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100/20 rounded-full">
            <span className="text-orange-400">🪙</span>
            <span className="text-xs text-orange-400 font-medium">{task.rewards.ml} ML</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-purple-100/20 to-pink-100/20 text-purple-300 text-xs rounded-full border border-purple-200/30"
            >
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 bg-background-tertiary text-xs rounded-full text-surface-secondary">
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
              className="p-2 hover:bg-blue-100/20 rounded-lg transition-all duration-200 hover:scale-110"
              title="Iniciar tarea"
            >
              <Play className="w-4 h-4 text-blue-500" />
            </button>
          )}
          
          {task.status === 'in-progress' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(task, 'pause');
                }}
                className="p-2 hover:bg-yellow-100/20 rounded-lg transition-all duration-200 hover:scale-110"
                title="Pausar tarea"
              >
                <Pause className="w-4 h-4 text-yellow-500" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(task, 'complete');
                }}
                className="p-2 hover:bg-green-100/20 rounded-lg transition-all duration-200 hover:scale-110"
                title="Completar tarea"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implementar edición de tareas
              toast.info('Funcionalidad de edición próximamente! 🚀');
            }}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-all duration-200 hover:scale-110"
            title="Editar tarea"
          >
            <Edit className="w-4 h-4 text-surface-secondary" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTaskAction(task, 'delete');
            }}
            className="p-2 hover:bg-red-100/20 rounded-lg transition-all duration-200 hover:scale-110"
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
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
          onClick={() => actions.openTaskModal()}
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
            <div className="min-h-[400px] bg-background-secondary/30 rounded-lg p-2">
              {getTasksByStatus(column.id).length === 0 ? (
                <div className="text-center py-8 text-surface-secondary">
                  <div className="w-16 h-16 mx-auto mb-3 bg-background-tertiary rounded-full flex items-center justify-center">
                    <span className="text-2xl opacity-50">
                      {column.id === 'todo' ? '📝' : 
                       column.id === 'in-progress' ? '⏳' : '✅'}
                    </span>
                  </div>
                  <p className="text-sm font-medium">No hay tareas</p>
                  <p className="text-xs opacity-70">
                    {column.id === 'todo' ? 'Crea una nueva tarea para comenzar' :
                     column.id === 'in-progress' ? 'Inicia una tarea pendiente' :
                     'Completa tareas para ver tu progreso'}
                  </p>
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

      {/* Modal Crear Tarea */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card-game w-full max-w-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 border-b border-background-card pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-productivity-500 to-creative-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Nueva Tarea</h2>
              </div>
              <button 
                onClick={() => { actions.closeTaskModal(); }} 
                className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Título</label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded"
                  placeholder="Escribe el título de la tarea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <textarea
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded"
                  rows={3}
                  placeholder="Descripción opcional"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newTask-category" className="block text-sm mb-1">Categoría</label>
                  <select
                    id="newTask-category"
                    value={newTaskData.category}
                    onChange={(e) => setNewTaskData({ ...newTaskData, category: e.target.value as TaskCategory })}
                    className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded capitalize"
                  >
                    <option value="productivity">Productividad</option>
                    <option value="health">Salud</option>
                    <option value="creative">Creatividad</option>
                    <option value="social">Social</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="newTask-priority" className="block text-sm mb-1">Prioridad</label>
                  <select
                    id="newTask-priority"
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="newTask-difficulty" className="block text-sm mb-1">Dificultad (1-5)</label>
                  <input
                    id="newTask-difficulty"
                    type="number"
                    min={1}
                    max={5}
                    value={newTaskData.difficulty}
                    onChange={(e) => setNewTaskData({ ...newTaskData, difficulty: Math.max(1, Math.min(5, Number(e.target.value))) as Task['difficulty'] })}
                    className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded"
                  />
                </div>
                <div>
                  <label htmlFor="newTask-estimatedTime" className="block text-sm mb-1">Tiempo estimado (min)</label>
                  <input
                    id="newTask-estimatedTime"
                    type="number"
                    min={5}
                    step={5}
                    value={newTaskData.estimatedTime}
                    onChange={(e) => setNewTaskData({ ...newTaskData, estimatedTime: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded"
                  />
                </div>
                <div>
                  <label htmlFor="newTask-dueDate" className="block text-sm mb-1">Fecha límite</label>
                  <input
                    id="newTask-dueDate"
                    type="date"
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={newTaskData.tags}
                    onChange={(e) => setNewTaskData({ ...newTaskData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-background-tertiary border border-background-card rounded"
                    placeholder="ej: foco, importante"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    id="isRecurring"
                    type="checkbox"
                    checked={newTaskData.isRecurring}
                    onChange={(e) => setNewTaskData({ ...newTaskData, isRecurring: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isRecurring" className="text-sm">Tarea recurrente</label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-background-card">
                <button 
                  type="button" 
                  onClick={() => { actions.closeTaskModal(); }} 
                  className="btn-game-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-game"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;

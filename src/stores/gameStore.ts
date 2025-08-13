import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Task, 
  UserProfile, 
  TaskCategory, 
  TaskStatus, 
  TaskRewards,
  Achievement,
  PenaltyRecord,
  UserLevel,
  UserResources,
  UserStreaks,
  GameNotification
} from '@/types';

interface GameState {
  // Estado del usuario
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  
  // Tareas
  tasks: Task[];
  filteredTasks: Task[];
  currentTask: Task | null;
  
  // Recursos del juego
  resources: UserResources;
  level: UserLevel;
  streaks: UserStreaks;
  
  // Logros y penalizaciones
  achievements: Achievement[];
  penalties: PenaltyRecord[];
  
  // Notificaciones
  notifications: GameNotification[];
  
  // UI y estado de la aplicación
  isLoading: boolean;
  error: string | null;
  activeCategory: TaskCategory | 'all';
  searchQuery: string;
  showCompleted: boolean;
  
  // Modales y overlays
  isTaskModalOpen: boolean;
  isAchievementModalOpen: boolean;
  isSettingsModalOpen: boolean;
  
  // Acciones del usuario
  actions: {
    // Autenticación
    login: (profile: UserProfile) => void;
    logout: () => void;
    
    // Gestión de tareas
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    completeTask: (id: string) => void;
    startTask: (id: string) => void;
    pauseTask: (id: string) => void;
    
    // Filtros y búsqueda
    setActiveCategory: (category: TaskCategory | 'all') => void;
    setSearchQuery: (query: string) => void;
    toggleShowCompleted: () => void;
    
    // Recursos del juego
    addXP: (amount: number, category: TaskCategory) => void;
    addHE: (amount: number) => void;
    useHE: (amount: number) => void;
    addML: (amount: number) => void;
    
    // Logros
    unlockAchievement: (achievementId: string) => void;
    addPenalty: (penalty: Omit<PenaltyRecord, 'id' | 'timestamp'>) => void;
    
    // Notificaciones
    addNotification: (notification: Omit<GameNotification, 'id' | 'timestamp'>) => void;
    markNotificationAsRead: (id: string) => void;
    clearNotifications: () => void;
    
    // UI
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    openTaskModal: () => void;
    closeTaskModal: () => void;
    openAchievementModal: () => void;
    closeAchievementModal: () => void;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    
    // Utilidades
    calculateRewards: (task: Task) => TaskRewards;
    checkLevelUp: (category: TaskCategory) => boolean;
    updateStreaks: () => void;
    resetDailyResources: () => void;
  };
}

// Función para calcular recompensas basadas en la tarea
const calculateTaskRewards = (task: Task): TaskRewards => {
  const baseHE = Math.max(15, Math.floor(task.estimatedTime / 30) * 15);
  const baseXP = Math.max(25, Math.floor(task.estimatedTime / 30) * 25);
  
  let he = baseHE;
  let xp = baseXP;
  let ml = 0;
  
  // Multiplicadores por prioridad
  switch (task.priority) {
    case 'critical':
      he *= 2;
      xp *= 2;
      ml = 1;
      break;
    case 'high':
      he *= 1.5;
      xp *= 1.5;
      break;
    case 'medium':
      // Valores base
      break;
    case 'low':
      he *= 0.8;
      xp *= 0.8;
      break;
  }
  
  // Multiplicadores por dificultad
  he *= (1 + (task.difficulty - 1) * 0.2);
  xp *= (1 + (task.difficulty - 1) * 0.3);
  
  // Bonus por racha
  if (task.completionStreak > 0) {
    const streakBonus = Math.min(task.completionStreak * 0.1, 0.5);
    he *= (1 + streakBonus);
    xp *= (1 + streakBonus);
  }
  
  return {
    he: Math.round(he),
    xp: Math.round(xp),
    ml: ml > 0 ? ml : undefined
  };
};

// Función para verificar si el usuario subió de nivel
const checkLevelUp = (currentXP: number, nextLevelXP: number): boolean => {
  return currentXP >= nextLevelXP;
};

// Función para calcular XP necesario para el siguiente nivel
const calculateNextLevelXP = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      userProfile: null,
      isAuthenticated: false,
      
      tasks: [],
      filteredTasks: [],
      currentTask: null,
      
      resources: {
        he: 6, // 6 horas por defecto
        heUsedToday: 0,
        heMaxDaily: 6,
        xp: 0,
        ml: 0
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
      
      achievements: [],
      penalties: [],
      notifications: [],
      
      isLoading: false,
      error: null,
      activeCategory: 'all',
      searchQuery: '',
      showCompleted: true,
      
      isTaskModalOpen: false,
      isAchievementModalOpen: false,
      isSettingsModalOpen: false,
      
      actions: {
        // Autenticación
        login: (profile: UserProfile) => {
          set({ userProfile: profile, isAuthenticated: true });
        },
        
        logout: () => {
          set({ 
            userProfile: null, 
            isAuthenticated: false,
            tasks: [],
            achievements: [],
            penalties: [],
            notifications: []
          });
        },
        
        // Gestión de tareas
        addTask: (taskData) => {
          const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            completionStreak: 0
          };
          
          const rewards = get().actions.calculateRewards(newTask);
          newTask.rewards = rewards;
          
          set(state => ({
            tasks: [...state.tasks, newTask],
            filteredTasks: [...state.filteredTasks, newTask]
          }));
        },
        
        updateTask: (id: string, updates: Partial<Task>) => {
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === id 
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
            ),
            filteredTasks: state.filteredTasks.map(task => 
              task.id === id 
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
            )
          }));
        },
        
        deleteTask: (id: string) => {
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== id),
            filteredTasks: state.filteredTasks.filter(task => task.id !== id)
          }));
        },
        
        completeTask: (id: string) => {
          const state = get();
          const task = state.tasks.find(t => t.id === id);
          
          if (!task) return;
          
          const rewards = task.rewards;
          const category = task.category;
          
          // Actualizar tarea
          state.actions.updateTask(id, {
            status: 'done',
            completedAt: new Date(),
            completionStreak: task.completionStreak + 1
          });
          
          // Añadir recompensas
          state.actions.addXP(rewards.xp, category);
          state.actions.addHE(rewards.he);
          if (rewards.ml) {
            state.actions.addML(rewards.ml);
          }
          
          // Verificar nivel
          if (state.actions.checkLevelUp(category)) {
            // Nivel subido
            state.actions.addNotification({
              type: 'success',
              title: '¡Nivel Subido!',
              message: `Has alcanzado el nivel ${state.level[category] + 1} en ${category}`,
              icon: '🎉'
            });
          }
          
          // Actualizar rachas
          state.actions.updateStreaks();
        },
        
        startTask: (id: string) => {
          get().actions.updateTask(id, { status: 'in-progress' });
        },
        
        pauseTask: (id: string) => {
          get().actions.updateTask(id, { status: 'todo' });
        },
        
        // Filtros y búsqueda
        setActiveCategory: (category: TaskCategory | 'all') => {
          set({ activeCategory: category });
          get().actions.applyFilters();
        },
        
        setSearchQuery: (query: string) => {
          set({ searchQuery: query });
          get().actions.applyFilters();
        },
        
        toggleShowCompleted: () => {
          set(state => ({ showCompleted: !state.showCompleted }));
          get().actions.applyFilters();
        },
        
        // Recursos del juego
        addXP: (amount: number, category: TaskCategory) => {
          set(state => {
            const newXP = state.level.xp[category] + amount;
            const currentLevel = state.level[category];
            const nextLevelXP = state.level.nextLevelXp[category];
            
            let newLevel = currentLevel;
            let newNextLevelXP = nextLevelXP;
            
            // Verificar si subió de nivel
            if (newXP >= nextLevelXP) {
              newLevel = currentLevel + 1;
              newNextLevelXP = calculateNextLevelXP(newLevel);
            }
            
            return {
              level: {
                ...state.level,
                [category]: newLevel,
                xp: {
                  ...state.level.xp,
                  [category]: newXP
                },
                nextLevelXp: {
                  ...state.level.nextLevelXp,
                  [category]: newNextLevelXP
                }
              }
            };
          });
        },
        
        addHE: (amount: number) => {
          set(state => ({
            resources: {
              ...state.resources,
              he: Math.min(state.resources.he + amount, state.resources.heMaxDaily)
            }
          }));
        },
        
        useHE: (amount: number) => {
          set(state => ({
            resources: {
              ...state.resources,
              he: Math.max(0, state.resources.he - amount),
              heUsedToday: state.resources.heUsedToday + amount
            }
          }));
        },
        
        addML: (amount: number) => {
          set(state => ({
            resources: {
              ...state.resources,
              ml: state.resources.ml + amount
            }
          }));
        },
        
        // Logros
        unlockAchievement: (achievementId: string) => {
          set(state => ({
            achievements: state.achievements.map(achievement =>
              achievement.id === achievementId
                ? { ...achievement, isUnlocked: true, unlockedAt: new Date() }
                : achievement
            )
          }));
        },
        
        addPenalty: (penaltyData) => {
          const newPenalty: PenaltyRecord = {
            ...penaltyData,
            id: crypto.randomUUID(),
            timestamp: new Date()
          };
          
          set(state => ({
            penalties: [...state.penalties, newPenalty]
          }));
        },
        
        // Notificaciones
        addNotification: (notificationData) => {
          const newNotification: GameNotification = {
            ...notificationData,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            isRead: false
          };
          
          set(state => ({
            notifications: [newNotification, ...state.notifications]
          }));
        },
        
        markNotificationAsRead: (id: string) => {
          set(state => ({
            notifications: state.notifications.map(notification =>
              notification.id === id
                ? { ...notification, isRead: true }
                : notification
            )
          }));
        },
        
        clearNotifications: () => {
          set({ notifications: [] });
        },
        
        // UI
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        
        setError: (error: string | null) => {
          set({ error });
        },
        
        openTaskModal: () => set({ isTaskModalOpen: true }),
        closeTaskModal: () => set({ isTaskModalOpen: false }),
        openAchievementModal: () => set({ isAchievementModalOpen: true }),
        closeAchievementModal: () => set({ isAchievementModalOpen: false }),
        openSettingsModal: () => set({ isSettingsModalOpen: true }),
        closeSettingsModal: () => set({ isSettingsModalOpen: false }),
        
        // Utilidades
        calculateRewards: calculateTaskRewards,
        
        checkLevelUp: (category: TaskCategory) => {
          const state = get();
          const currentXP = state.level.xp[category];
          const nextLevelXP = state.level.nextLevelXp[category];
          return checkLevelUp(currentXP, nextLevelXP);
        },
        
        updateStreaks: () => {
          const today = new Date();
          const state = get();
          
          set(state => ({
            streaks: {
              ...state.streaks,
              daily: state.streaks.daily + 1,
              lastCompletedDate: today
            }
          }));
        },
        
        resetDailyResources: () => {
          set(state => ({
            resources: {
              ...state.resources,
              he: state.resources.heMaxDaily,
              heUsedToday: 0
            }
          }));
        }
      }
    }),
    {
      name: 'sariola-game-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        tasks: state.tasks,
        resources: state.resources,
        level: state.level,
        streaks: state.streaks,
        achievements: state.achievements,
        penalties: state.penalties,
        settings: state.userProfile?.settings
      })
    }
  )
);


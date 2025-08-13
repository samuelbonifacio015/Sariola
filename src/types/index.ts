// Tipos principales del sistema de juego

export type TaskCategory = 'productivity' | 'health' | 'creative' | 'social';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskDifficulty = 1 | 2 | 3 | 4 | 5;
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  estimatedTime: number; // minutos
  status: TaskStatus;
  rewards: TaskRewards;
  tags: string[];
  isRecurring: boolean;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  completionStreak: number;
  parentTaskId?: string; // Para subtareas
  subtasks?: Task[];
}

export interface TaskRewards {
  he: number; // Horas de Entretenimiento
  xp: number; // Puntos de Experiencia
  ml?: number; // Monedas de Logro
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: AvatarConfig;
  level: UserLevel;
  resources: UserResources;
  streaks: UserStreaks;
  penalties: PenaltyRecord[];
  achievements: Achievement[];
  settings: UserSettings;
  analytics: UserAnalytics;
  createdAt: Date;
  lastActive: Date;
}

export interface AvatarConfig {
  id: string;
  name: string;
  imageUrl: string;
  isUnlocked: boolean;
  unlockCondition: string;
}

export interface UserLevel {
  overall: number;
  productivity: number;
  health: number;
  creative: number;
  social: number;
  xp: {
    overall: number;
    productivity: number;
    health: number;
    creative: number;
    social: number;
  };
  nextLevelXp: {
    overall: number;
    productivity: number;
    health: number;
    creative: number;
    social: number;
  };
}

export interface UserResources {
  he: number; // Horas de Entretenimiento disponibles
  heUsedToday: number; // Horas usadas hoy
  heMaxDaily: number; // Máximo diario (6 horas)
  xp: number; // Puntos de Experiencia totales
  ml: number; // Monedas de Logro
}

export interface UserStreaks {
  daily: number;
  weekly: number;
  monthly: number;
  categories: Record<TaskCategory, number>;
  lastCompletedDate: Date;
}

export interface PenaltyRecord {
  id: string;
  type: PenaltyType;
  reason: string;
  amount: number; // Cantidad de HE perdidas o XP perdidos
  timestamp: Date;
  isResolved: boolean;
  resolvedAt?: Date;
}

export type PenaltyType = 
  | 'late_wake_up'
  | 'no_exercise'
  | 'procrastination'
  | 'task_abandonment'
  | 'streak_break';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: TaskCategory | 'general';
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rewards: TaskRewards;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  gamePreferences: GamePreferences;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  taskReminders: boolean;
  achievementAlerts: boolean;
  penaltyWarnings: boolean;
  dailyRecap: boolean;
}

export interface PrivacySettings {
  shareProgress: boolean;
  shareAchievements: boolean;
  allowFriendRequests: boolean;
  showOnlineStatus: boolean;
}

export interface GamePreferences {
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  autoSave: boolean;
  tutorialEnabled: boolean;
  soundEffects: boolean;
  backgroundMusic: boolean;
}

export interface UserAnalytics {
  daily: DailyAnalytics;
  weekly: WeeklyAnalytics;
  monthly: MonthlyAnalytics;
  yearly: YearlyAnalytics;
}

export interface DailyAnalytics {
  date: Date;
  tasksCompleted: number;
  totalXp: number;
  heEarned: number;
  heUsed: number;
  mood: number; // 1-10
  energy: number; // 1-10
  productivity: number; // 1-10
}

export interface WeeklyAnalytics {
  weekStart: Date;
  weekEnd: Date;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalXp: number;
  totalHe: number;
  categoryBreakdown: Record<TaskCategory, number>;
  streakDays: number;
}

export interface MonthlyAnalytics {
  month: number;
  year: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalXp: number;
  totalHe: number;
  achievementsUnlocked: number;
  levelUps: number;
  categoryBreakdown: Record<TaskCategory, number>;
}

export interface YearlyAnalytics {
  year: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalXp: number;
  totalHe: number;
  achievementsUnlocked: number;
  levelUps: number;
  categoryBreakdown: Record<TaskCategory, number>;
  personalGrowth: number; // 1-100
}

// Tipos para el sistema de entretenimiento
export interface EntertainmentApp {
  id: string;
  name: string;
  url?: string;
  executable?: string;
  category: EntertainmentCategory;
  isBlocked: boolean;
  timeUsedToday: number;
  maxTimeAllowed: number;
}

export type EntertainmentCategory = 
  | 'gaming'
  | 'social_media'
  | 'streaming'
  | 'creative'
  | 'educational';

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isActive: boolean;
  allowedCategories: EntertainmentCategory[];
}

export interface OverrideReason {
  id: string;
  reason: string;
  duration: number; // minutos
  timestamp: Date;
  approved: boolean;
}

// Tipos para el sistema de notificaciones
export interface GameNotification {
  id: string;
  type: 'achievement' | 'penalty' | 'reminder' | 'success' | 'warning';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  isRead: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Tipos para el sistema de amigos y social
export interface Friend {
  id: string;
  username: string;
  avatar: string;
  level: number;
  isOnline: boolean;
  lastSeen: Date;
  mutualTasks: number;
  challengeHistory: ChallengeRecord[];
}

export interface ChallengeRecord {
  id: string;
  type: 'productivity' | 'health' | 'creative' | 'social';
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  isCompleted: boolean;
  rewards: TaskRewards;
  participants: string[]; // IDs de usuarios
}

// Tipos para el sistema de IA y insights
export interface AIInsight {
  id: string;
  type: 'pattern' | 'optimization' | 'correlation' | 'challenge';
  title: string;
  description: string;
  confidence: number; // 0-1
  category: TaskCategory;
  actionable: boolean;
  actionItems?: string[];
  timestamp: Date;
}

// Tipos para el sistema de respaldo y sincronización
export interface BackupData {
  version: string;
  timestamp: Date;
  userProfile: UserProfile;
  tasks: Task[];
  achievements: Achievement[];
  analytics: UserAnalytics;
  settings: UserSettings;
}

// Tipos para el sistema de temas y personalización
export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  isCustom: boolean;
  isActive: boolean;
}

// Tipos para el sistema de accesibilidad
export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}


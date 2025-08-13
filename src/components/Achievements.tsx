import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Flame, Award, Lock, Unlock, Filter } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { Achievement, TaskCategory } from '@/types';

const Achievements: React.FC = () => {
  const { achievements, level, actions } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all' | 'general'>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Trophy, color: 'from-productivity-500 to-creative-500' },
    { id: 'productivity', name: 'Productividad', icon: Zap, color: 'from-productivity-500 to-productivity-600' },
    { id: 'health', name: 'Salud', icon: Flame, color: 'from-health-500 to-health-600' },
    { id: 'creative', name: 'Creatividad', icon: Star, color: 'from-creative-500 to-creative-600' },
    { id: 'social', name: 'Social', icon: Target, color: 'from-social-500 to-social-600' },
    { id: 'general', name: 'Generales', icon: Award, color: 'from-gray-500 to-gray-600' },
  ];

  const rarities = [
    { id: 'all', name: 'Todas', color: 'from-gray-400 to-gray-600' },
    { id: 'common', name: 'Comunes', color: 'from-gray-400 to-gray-600' },
    { id: 'rare', name: 'Raras', color: 'from-blue-400 to-blue-600' },
    { id: 'epic', name: 'Épicas', color: 'from-purple-400 to-purple-600' },
    { id: 'legendary', name: 'Legendarias', color: 'from-orange-400 to-orange-600' },
  ];

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-orange-400 to-orange-600'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityIcon = (rarity: string) => {
    const icons = {
      common: '🥉',
      rare: '🥈',
      epic: '🥇',
      legendary: '👑'
    };
    return icons[rarity as keyof typeof icons] || icons.common;
  };

  const getCategoryIcon = (category: TaskCategory | 'general') => {
    const icons = {
      productivity: '⚡',
      health: '💚',
      creative: '🎨',
      social: '👥',
      general: '🏆'
    };
    return icons[category] || icons.general;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);
  const totalProgress = achievements.length > 0 ? Math.round((unlockedAchievements.length / achievements.length) * 100) : 0;

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4 }}
      className={`card-game p-6 relative overflow-hidden ${
        achievement.isUnlocked ? 'border-2 border-transparent' : 'opacity-75'
      }`}
    >
      {/* Fondo de rareza */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-10`} />
      
      <div className="relative z-10">
        {/* Header del logro */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
              achievement.isUnlocked 
                ? 'bg-gradient-to-br from-game-xp to-yellow-600 shadow-game' 
                : 'bg-background-tertiary'
            }`}>
              {achievement.isUnlocked ? achievement.icon : <Lock className="w-8 h-8 text-surface-secondary" />}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{achievement.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                  {rarities.find(r => r.id === achievement.rarity)?.name}
                </span>
                <span className="text-xs text-surface-secondary">
                  {achievement.category === 'general' ? 'General' : 
                   achievement.category === 'productivity' ? 'Productividad' :
                   achievement.category === 'health' ? 'Salud' :
                   achievement.category === 'creative' ? 'Creatividad' : 'Social'}
                </span>
              </div>
            </div>
          </div>
          
          {achievement.isUnlocked && (
            <div className="text-right">
              <div className="text-xs text-surface-secondary">
                Desbloqueado
              </div>
              <div className="text-sm font-medium">
                {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Hoy'}
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <p className="text-surface-secondary mb-4">{achievement.description}</p>

        {/* Progreso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progreso</span>
            <span>{achievement.progress}/{achievement.maxProgress}</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${
                achievement.category === 'health' ? 'progress-fill-health' :
                achievement.category === 'creative' ? 'progress-fill-creative' :
                achievement.category === 'social' ? 'progress-fill-social' : ''
              }`}
              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
            />
          </div>
        </div>

        {/* Recompensas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-game-he">⚡ {achievement.rewards.he}min HE</span>
            <span className="text-sm text-game-xp">⭐ {achievement.rewards.xp} XP</span>
            {achievement.rewards.ml && (
              <span className="text-sm text-game-ml">🪙 {achievement.rewards.ml} ML</span>
            )}
          </div>
          
          {achievement.isUnlocked ? (
            <div className="flex items-center space-x-2 text-green-500">
              <Unlock className="w-4 h-4" />
              <span className="text-sm font-medium">Desbloqueado</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-surface-secondary">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Bloqueado</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-game font-bold text-gradient mb-2">
          Logros y Medallas
        </h1>
        <p className="text-surface-secondary">
          Desbloquea logros épicos y construye tu legado
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid-game-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-game p-6 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-game-xp to-yellow-600 rounded-full flex items-center justify-center mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-game-xp">{unlockedAchievements.length}</div>
          <div className="text-sm text-surface-secondary">Logros Desbloqueados</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-game p-6 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-background-tertiary to-background-card rounded-full flex items-center justify-center mb-3">
            <Lock className="w-8 h-8 text-surface-secondary" />
          </div>
          <div className="text-2xl font-bold text-surface-secondary">{lockedAchievements.length}</div>
          <div className="text-sm text-surface-secondary">Logros Pendientes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-game p-6 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-productivity-500 to-creative-500 rounded-full flex items-center justify-center mb-3">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-productivity-500">{totalProgress}%</div>
          <div className="text-sm text-surface-secondary">Progreso Total</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-game p-6 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-3">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-orange-500">
            {achievements.filter(a => a.rarity === 'legendary' && a.isUnlocked).length}
          </div>
          <div className="text-sm text-surface-secondary">Legendarios</div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="card-game p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-productivity-500" />
          Filtros
        </h2>
        
        <div className="space-y-4">
          {/* Filtro por categoría */}
          <div>
            <h3 className="text-sm font-medium text-surface-secondary mb-2">Categoría</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as TaskCategory | 'all' | 'general')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-game'
                      : 'bg-background-tertiary text-surface-secondary hover:bg-background-card'
                  }`}
                >
                  <category.icon className="w-4 h-4 inline mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por rareza */}
          <div>
            <h3 className="text-sm font-medium text-surface-secondary mb-2">Rareza</h3>
            <div className="flex flex-wrap gap-2">
              {rarities.map((rarity) => (
                <button
                  key={rarity.id}
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedRarity === rarity.id
                      ? 'bg-gradient-to-r ' + rarity.color + ' text-white shadow-game'
                      : 'bg-background-tertiary text-surface-secondary hover:bg-background-card'
                  }`}
                >
                  <span className="mr-2">{getRarityIcon(rarity.id)}</span>
                  {rarity.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de logros */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Logros {selectedCategory !== 'all' && `- ${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          <span className="text-sm text-surface-secondary">
            {filteredAchievements.length} de {achievements.length} logros
          </span>
        </div>

        {filteredAchievements.length === 0 ? (
          <div className="card-game p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-surface-secondary opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron logros</h3>
            <p className="text-surface-secondary">
              Intenta cambiar los filtros o completa más tareas para desbloquear logros
            </p>
          </div>
        ) : (
          <div className="grid-game-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>

      {/* Progreso general */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-game p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Progreso General</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Logros Desbloqueados</span>
              <span>{unlockedAchievements.length}/{achievements.length}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
          
          <div className="grid-game-4">
            {(['common', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
              const rarityAchievements = achievements.filter(a => a.rarity === rarity);
              const unlocked = rarityAchievements.filter(a => a.isUnlocked).length;
              const total = rarityAchievements.length;
              const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
              
              return (
                <div key={rarity} className="text-center">
                  <div className="text-lg mb-1">{getRarityIcon(rarity)}</div>
                  <div className="text-sm font-medium capitalize">{rarity}</div>
                  <div className="text-xs text-surface-secondary">
                    {unlocked}/{total} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;



import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap, Target, Trophy, Star } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const loadingItems = [
    { icon: Zap, text: 'Cargando energía...', delay: 0 },
    { icon: Target, text: 'Preparando objetivos...', delay: 0.2 },
    { icon: Trophy, text: 'Configurando logros...', delay: 0.4 },
    { icon: Star, text: 'Activando gamificación...', delay: 0.6 },
  ];

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-productivity-500 via-creative-500 to-health-500 rounded-full flex items-center justify-center shadow-game-glow">
            <span className="text-4xl font-game font-bold text-white">S</span>
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl font-game font-bold text-gradient mb-2"
        >
          SARIOLA
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-surface-secondary mb-12"
        >
          Transformando tu productividad en una aventura épica
        </motion.p>

        {/* Items de carga animados */}
        <div className="space-y-4">
          {loadingItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: item.delay }}
              className="flex items-center justify-center space-x-3"
            >
              <item.icon className="w-5 h-5 text-productivity-400" />
              <span className="text-surface-secondary">{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Spinner de carga */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12"
        >
          <Loader2 className="w-8 h-8 text-productivity-500 animate-spin mx-auto" />
        </motion.div>

        {/* Barra de progreso */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 0.5 }}
          className="mt-8 h-2 bg-gradient-to-r from-productivity-500 to-creative-500 rounded-full max-w-md mx-auto"
        />

        {/* Texto de estado */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-4 text-sm text-surface-secondary"
        >
          Preparando tu experiencia gamificada...
        </motion.p>
      </div>

      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;


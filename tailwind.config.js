/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales de categorías
        productivity: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Principal
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        health: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Principal
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        creative: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea', // Principal
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        social: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Principal
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // Colores del sistema de juego
        game: {
          xp: '#fbbf24', // Amarillo para XP
          he: '#10b981', // Verde para Horas de Entretenimiento
          ml: '#f59e0b', // Naranja para Monedas de Logro
          critical: '#ef4444', // Rojo para tareas críticas
          success: '#22c55e', // Verde para éxito
          warning: '#f59e0b', // Amarillo para advertencias
          error: '#ef4444', // Rojo para errores
        },
        // Colores de fondo y UI
        background: {
          primary: '#0f172a', // Slate 900
          secondary: '#1e293b', // Slate 800
          tertiary: '#334155', // Slate 700
          card: '#475569', // Slate 600
        },
        surface: {
          primary: '#ffffff',
          secondary: '#f8fafc', // Slate 50
          tertiary: '#f1f5f9', // Slate 100
        }
      },
      fontFamily: {
        'game': ['Orbitron', 'monospace'],
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3b82f6' },
          '100%': { boxShadow: '0 0 20px #3b82f6, 0 0 30px #3b82f6' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'game': '0 0 20px rgba(59, 130, 246, 0.5)',
        'game-glow': '0 0 30px rgba(59, 130, 246, 0.8)',
        'game-dark': '0 0 20px rgba(15, 23, 42, 0.8)',
        'game-glow-dark': '0 0 30px rgba(59, 130, 246, 0.6)',
        'success': '0 0 20px rgba(34, 197, 94, 0.5)',
        'warning': '0 0 20px rgba(245, 158, 11, 0.5)',
        'error': '0 0 20px rgba(239, 68, 68, 0.5)',
      }
    },
  },
  plugins: [],
}


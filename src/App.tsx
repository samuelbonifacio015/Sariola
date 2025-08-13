import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGameStore } from '@/stores/gameStore';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import TaskBoard from '@/components/TaskBoard';
import Achievements from '@/components/Achievements';
import Settings from '@/components/Settings';
import Onboarding from '@/components/Onboarding';
import LoadingScreen from '@/components/LoadingScreen';

function App() {
  const { 
    isAuthenticated, 
    userProfile, 
    isLoading, 
    error,
    actions 
  } = useGameStore();

  // Efecto para manejar errores globales
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      actions.setError(null);
    }
  }, [error, actions]);

  // Efecto para resetear recursos diarios
  useEffect(() => {
    const checkDailyReset = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('lastDailyReset');
      
      if (lastReset) {
        const lastResetDate = new Date(lastReset);
        if (now.getDate() !== lastResetDate.getDate() || 
            now.getMonth() !== lastResetDate.getMonth() || 
            now.getFullYear() !== lastResetDate.getFullYear()) {
          actions.resetDailyResources();
          localStorage.setItem('lastDailyReset', now.toISOString());
          
          toast.success('¡Recursos diarios renovados! 🎉', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        localStorage.setItem('lastDailyReset', now.toISOString());
      }
    };

    checkDailyReset();
    
    // Verificar cada hora
    const interval = setInterval(checkDailyReset, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [actions]);

  // Pantalla de carga
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, mostrar onboarding
  if (!isAuthenticated || !userProfile) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-background-primary text-surface-primary">
      <Header />
      
      <main className="container-game py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


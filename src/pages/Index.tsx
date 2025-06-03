
import { useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '../types';
import { useAppData } from '../hooks/useAppData';
import { Header } from '../components/Layout/Header';
import { Navigation } from '../components/Layout/Navigation';
import { WelcomeModal } from '../components/Modals/WelcomeModal';
import { AchievementsModal } from '../components/Modals/AchievementsModal';
import { SettingsModal } from '../components/Modals/SettingsModal';
import { KanbanBoard } from '../components/Modules/KanbanBoard';
import { FocusTimer } from '../components/Modules/FocusTimer';
import { ChecklistManager } from '../components/Modules/ChecklistManager';
import { NotesManager } from '../components/Modules/NotesManager';
import { MusicPlayer } from '../components/Modules/MusicPlayer';
import { PointsNotification } from '../components/PointsNotification';
import { PersistentControls } from '../components/PersistentControls';

interface PointsNotification {
  id: string;
  points: number;
  type: 'task' | 'focus' | 'checklist' | 'note';
}

import { DonateCoffeeModal } from '../components/Modals/DonateCoffeeModal';

// Function to check if it's a new day
function isNewDay(lastDate: string, now: Date) {
  const last = new Date(lastDate);
  return last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth() ||
    last.getDate() !== now.getDate();
}

const Index = () => {
  const [showDonateCoffee, setShowDonateCoffee] = useState(false);
  const { appData, setAppData, updateUser, addPoints, resetAllData } = useAppData();
  const [sessionFocusSeconds, setSessionFocusSeconds] = useState(0);
  const [pointsNotifications, setPointsNotifications] = useState<PointsNotification[]>([]);
  const [activeTab, setActiveTab] = useState('kanban');
  const lastSaveRef = useRef(0);

  // Reset diário para todos os campos *_Today
  useEffect(() => {
    const now = new Date();
    setAppData(prev => {
      if (!prev.user.lastStatsUpdate || isNewDay(prev.user.lastStatsUpdate, now)) {
        return {
          ...prev,
          user: {
            ...prev.user,
            focusSessionsToday: 0,
            focusMinutesToday: 0,
            focusSecondsToday: 0,
            completedTasksToday: 0,
            checkedItemsToday: 0,
            notesCreatedToday: 0,
            lastStatsUpdate: now.toISOString(),
          }
        };
      }
      return prev;
    });
  }, [setAppData]);

  const commitSessionFocus = useCallback(() => {
    if (sessionFocusSeconds <= 0) return;
    
    // Only show notification for complete minutes
    const focusMinutes = Math.floor(sessionFocusSeconds / 60);
    if (focusMinutes > 0) {
      const newNotification = {
        id: crypto.randomUUID(),
        points: focusMinutes,
        type: 'focus' as const,
      };
      
      setPointsNotifications(prev => {
        // Only add new notification if we don't already have one for this focus session
        const hasExistingNotification = prev.some(n => 
          n.type === 'focus' && n.points === focusMinutes
        );
        return hasExistingNotification ? prev : [...prev, newNotification];
      });
      
      // Auto-remove notification after 2 seconds
      setTimeout(() => 
        setPointsNotifications(prev => 
          prev.filter(n => n.id !== newNotification.id)
        ), 
        2000
      );
    }
    
    // Batch updates to reduce re-renders
    setAppData(prev => {
      const now = new Date();
      // Renamed local variable to avoid shadowing global function
      const isNewDayCheck = prev.user.lastStatsUpdate ? 
        isNewDay(prev.user.lastStatsUpdate, now) : false;
      
      const totalSeconds = (prev.user.focusSeconds ?? 0) + sessionFocusSeconds;
      const addMinute = Math.floor(totalSeconds / 60);
      const newFocusSeconds = totalSeconds % 60;
      
      // Reset today's stats if it's a new day
      const todaySeconds = isNewDayCheck ? 
        sessionFocusSeconds : 
        (prev.user.focusSecondsToday ?? 0) + sessionFocusSeconds;
      
      const addMinuteToday = Math.floor(todaySeconds / 60);
      const newFocusSecondsToday = todaySeconds % 60;
      
      return {
        ...prev,
        user: {
          ...prev.user,
          totalFocusMinutes: (prev.user.totalFocusMinutes ?? 0) + addMinute,
          focusSeconds: newFocusSeconds,
          focusMinutesToday: isNewDayCheck ? addMinuteToday : (prev.user.focusMinutesToday ?? 0) + addMinuteToday,
          focusSecondsToday: newFocusSecondsToday,
          lastStatsUpdate: now.toISOString(),
          // Reset daily stats if it's a new day
          ...(isNewDayCheck ? {
            focusSessionsToday: 0,
            completedTasksToday: 0,
            checkedItemsToday: 0,
            notesCreatedToday: 0
          } : {})
        }
      };
    });
    
    setSessionFocusSeconds(0);
  }, [sessionFocusSeconds, setAppData]);

  // Save focus time periodically and on unmount
  useEffect(() => {
    if (sessionFocusSeconds === 0) return;
    
    // Only save if we have at least 1 second of focus time
    // and we've accumulated at least 30 seconds or it's been 30 seconds since last save
    const now = Date.now();
    const shouldSave = sessionFocusSeconds >= 30 || 
                     (now - lastSaveRef.current) >= 30000; // 30 seconds
    
    if (shouldSave) {
      commitSessionFocus();
      lastSaveRef.current = now;
    }
    
    const saveInterval = setInterval(() => {
      if (sessionFocusSeconds > 0) {
        commitSessionFocus();
        lastSaveRef.current = Date.now();
      }
    }, 30000); // Save at most every 30 seconds

    return () => {
      clearInterval(saveInterval);
      if (sessionFocusSeconds > 0) {
        commitSessionFocus();
      }
    };
  }, [sessionFocusSeconds, commitSessionFocus]);
  
  // Save focus time when changing tabs or unmounting
  useEffect(() => {
    return () => {
      if (sessionFocusSeconds > 0) {
        commitSessionFocus();
      }
    };
  }, [activeTab, sessionFocusSeconds, commitSessionFocus]);

  // ...restante do componente Index
  // (Removidas todas as duplicatas de declaração dos hooks acima)

  // Garante persistência ao criar uma nota rápida
  const handleNoteCreate = useCallback((note) => {
    const pointsNotification: PointsNotification = {
      id: crypto.randomUUID(),
      points: 10,
      type: 'note' as const,
    };
    setAppData(prev => {
      const updatedUser = {
        ...prev.user,
        notesCreated: (prev.user.notesCreated ?? 0) + 1,
        notesCreatedToday: (prev.user.notesCreatedToday ?? 0) + 1,
        totalPoints: (prev.user.totalPoints ?? 0) + 10,
        lastStatsUpdate: new Date().toISOString(),
      };
      return {
        ...prev,
        notes: [note, ...prev.notes],
        user: updatedUser,
      };
    });
    setPointsNotifications(prev => [...prev, pointsNotification]);
    setTimeout(() => setPointsNotifications(prev => prev.slice(1)), 2000);
  }, [setAppData, setPointsNotifications]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);


  const showWelcome = !appData.user.username;

  const addPointsNotification = useCallback((points: number, type: 'task' | 'focus' | 'checklist') => {
    const notification: PointsNotification = {
      id: crypto.randomUUID(),
      points,
      type,
    };
    setPointsNotifications(prev => [...prev, notification]);
    addPoints(points);
  }, [addPoints]);

  const removePointsNotification = useCallback((id: string) => {
    setPointsNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleSetUsername = useCallback((username: string) => {
    updateUser({ 
      username,
      createdAt: new Date().toISOString()
    });
  }, [updateUser]);

  const handleTaskStatusChange = useCallback((taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    setAppData(prev => {
      const updatedTasks = prev.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });
      let user = { ...prev.user };
      let pointsNotification = null;
      const completedTask = prev.tasks.find(task => task.id === taskId && task.status === 'doing' && newStatus === 'done');
      if (completedTask) {
        user.completedTasks += 1;
        user.completedTasksToday = (user.completedTasksToday ?? 0) + 1;
        user.totalPoints += 20;
        user.lastStatsUpdate = new Date().toISOString();
        pointsNotification = {
          id: crypto.randomUUID(),
          points: 20,
          type: 'task' as const,
        };
        setPointsNotifications(prev => [...prev, pointsNotification]);
        setTimeout(() => setPointsNotifications(prev => prev.slice(1)), 2000);
      }
      return {
        ...prev,
        tasks: updatedTasks,
        user
      };
    });
  }, [setAppData, setPointsNotifications]);

  //  removido: pontos agora são dados a cada minuto em onFocusTick

  const handleChecklistItemCheck = useCallback((checked: boolean) => {
    if (!checked) return; // só conta quando marca como concluído
    const pointsNotification: PointsNotification = {
      id: crypto.randomUUID(),
      points: 5,
      type: 'checklist' as const,
    };
    setAppData(prev => {
      const updatedUser = {
        ...prev.user,
        checkedItems: (prev.user.checkedItems ?? 0) + 1,
        checkedItemsToday: (prev.user.checkedItemsToday ?? 0) + 1,
        totalPoints: (prev.user.totalPoints ?? 0) + 5,
        lastStatsUpdate: new Date().toISOString(),
      };
      return {
        ...prev,
        user: updatedUser,
      };
    });
    setPointsNotifications(prev => [...prev, pointsNotification]);
    setTimeout(() => setPointsNotifications(prev => prev.slice(1)), 2000);
  }, [setAppData, setPointsNotifications]);



  const handleUpdateUsername = useCallback((username: string) => {
    updateUser({ username });
  }, [updateUser]);

  const handleClearData = useCallback(() => {
    resetAllData();
    setPointsNotifications([]);
  }, [resetAllData]);

  // Reset daily focus sessions at midnight
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      const lastSessionDate = new Date(appData.user.createdAt).toDateString();
      
      if (today !== lastSessionDate && appData.user.focusSessionsToday > 0) {
        updateUser({ focusSessionsToday: 0 });
      }
    };

    const interval = setInterval(checkNewDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [appData.user.createdAt, appData.user.focusSessionsToday, updateUser]);

  if (showWelcome) {
    return <WelcomeModal onSetUsername={handleSetUsername} />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'kanban':
        return (
          <KanbanBoard
            tasks={appData.tasks || []}
            onTasksChange={(tasks) => {
              console.log('Atualizando tasks no Index:', tasks);
              setAppData(prev => ({
                ...prev,
                tasks: [...tasks]
              }));
            }}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskComplete={() => {}}
          />
        );
      case 'timer':
        return (
          <FocusTimer
            timerState={appData.timer}
            onTimerUpdate={(timer) => setAppData(prev => ({ ...prev, timer }))}
            onSessionComplete={commitSessionFocus}
            onFocusTick={(seconds) => {
              setSessionFocusSeconds(prev => prev + seconds);
            }}
            onReset={commitSessionFocus}
            onSkip={commitSessionFocus}
          />
        );
      case 'checklists':
        return (
          <ChecklistManager
            checklists={appData.checklists}
            onChecklistsChange={(checklists) => setAppData(prev => ({ ...prev, checklists }))}
            onItemCheck={(checklistId, itemId, checked) => {
              handleChecklistItemCheck(checked);
              setAppData(prev => {
                // Atualiza checklists
                const newChecklists = prev.checklists.map(cl => {
                  if (cl.id !== checklistId) return cl;
                  return {
                    ...cl,
                    items: cl.items.map(it => it.id === itemId ? { ...it, completed: checked } : it)
                  };
                });
                // Só adiciona ponto se marcou e o item não estava marcado antes
                const checklist = prev.checklists.find(cl => cl.id === checklistId);
                const item = checklist?.items.find(it => it.id === itemId);
                let checkedItems = prev.user.checkedItems;
                let checkedItemsToday = prev.user.checkedItemsToday ?? 0;
                let totalPoints = prev.user.totalPoints;
                let notify = false;
                if (checked && item && !item.completed) {
                  checkedItems += 1;
                  checkedItemsToday += 1;
                  totalPoints += 5;
                  notify = true;
                }
                return {
                  ...prev,
                  checklists: newChecklists,
                  user: {
                    ...prev.user,
                    checkedItems,
                    checkedItemsToday,
                    totalPoints,
                  }
                };
              });
              // Notificação visual
              if (checked) {
                const pointsNotification = {
                  id: crypto.randomUUID(),
                  points: 5,
                  type: 'checklist' as const,
                };
                setPointsNotifications(prev => [...prev, pointsNotification]);
                setTimeout(() => setPointsNotifications(prev => prev.slice(1)), 2000);
              }
            }}
          />
        );
      case 'notes':
        return (
          <NotesManager
            notes={appData.notes}
            onNotesChange={(notes) => setAppData(prev => ({ ...prev, notes }))}
            onNoteCreate={handleNoteCreate}
          />
        );
      case 'music':
      return (
        <MusicPlayer
          musicState={{
            isPlaying: appData.music.isPlaying,
            volume: appData.music.volume,
            playlistId: (appData.music as any).playlistId || 'lofi'
          }}
          onMusicStateChange={(music) => {
            setAppData(prev => ({
              ...prev,
              music: {
                ...prev.music,
                ...music
              }
            }));
          }}
        />
      );  
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">

      <Header
        username={appData.user.username}
        totalPoints={appData.user.totalPoints}
        onShowAchievements={() => setShowAchievements(true)}
        onShowSettings={() => setShowSettings(true)}
        onDonateCoffee={() => setShowDonateCoffee(true)}
      />
      
      <main className="min-h-[calc(100vh-140px)]">
        {renderActiveModule()}
      </main>

      {/* Controles Persistentes */}
      <PersistentControls
        timerState={appData.timer}
        musicState={appData.music}
        onTimerUpdate={(timer) => setAppData(prev => ({ ...prev, timer }))}
        onMusicStateChange={(music) => setAppData(prev => ({ ...prev, music }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSessionComplete={commitSessionFocus} // Pass commitSessionFocus
        onFocusTick={(seconds) => { // Pass handler for onFocusTick
          setSessionFocusSeconds(prev => prev + seconds);
        }}
      />

      {/* Navegação Inferior */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Points Notifications */}
      {pointsNotifications.map((notification) => (
        <PointsNotification
          key={notification.id}
          points={notification.points}
          type={notification.type}
          onComplete={() => removePointsNotification(notification.id)}
        />
      ))}

      {/* Modals */}
      {showAchievements && (
        <AchievementsModal
          user={appData.user}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          username={appData.user.username}
          onUpdateUsername={handleUpdateUsername}
          onClearData={handleClearData}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showDonateCoffee && (
        <DonateCoffeeModal onClose={() => setShowDonateCoffee(false)} />
      )}
    </div>
  );
};

export default Index;

// Removido commitSessionFocus daqui, ela agora está dentro do componente Index para acessar o estado corretamente.

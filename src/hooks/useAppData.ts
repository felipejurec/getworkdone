import { useLocalStorage } from './useLocalStorage';
import type { AppData, User as UserType, KanbanTask } from '../types';

const defaultUser: UserType = {
  username: '',
  totalPoints: 0,
  totalFocusSessions: 0,
  totalFocusMinutes: 0,
  focusSeconds: 0,
  completedTasks: 0,
  checkedItems: 0,
  notesCreated: 0,

  // Estatísticas do dia
  focusSessionsToday: 0,
  focusMinutesToday: 0,
  focusSecondsToday: 0,
  completedTasksToday: 0,
  checkedItemsToday: 0,
  notesCreatedToday: 0,

  createdAt: new Date().toISOString(),
  lastStatsUpdate: new Date().toISOString(),
};

const defaultAppData: AppData = {
  user: defaultUser,
  tasks: [],
  checklists: [],
  notes: [],
  timer: {
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    isBreak: false,
    sessionsCompleted: 0,
  },
  music: {
    isPlaying: false,
    volume: 50,
    playlistId: 'lofi',
  },
};

export function useAppData() {
  const [appData, setAppData] = useLocalStorage<AppData>('gwd-app-data', defaultAppData);

  // Função específica para atualizar as tarefas
  const updateTasks = (tasks: KanbanTask[]) => {
    setAppData(prev => ({
      ...prev,
      tasks
    }));
  };

  const updateUser = (updates: Partial<UserType>) => {
    setAppData(prev => ({
      ...prev,
      user: { ...prev.user, ...updates }
    }));
  };

  const addPoints = (points: number) => {
    setAppData(prev => ({
      ...prev,
      user: { ...prev.user, totalPoints: prev.user.totalPoints + points }
    }));
  };

  const resetAllData = () => {
    setAppData(defaultAppData);
  };

  return {
    appData,
    setAppData,
    updateUser,
    addPoints,
    resetAllData,
  };
}

// Os campos abaixo são essenciais e usados em toda a lógica do timer:
export interface User {
  username: string;
  totalPoints: number;

  // Total acumulado
  totalFocusSessions: number;
  totalFocusMinutes: number; // minutos focados acumulados
  focusSeconds: number; // segundos acumulados para formar 1 minuto
  completedTasks: number;
  checkedItems: number;
  notesCreated: number;

  // Estatísticas do dia
  focusSessionsToday: number;
  focusMinutesToday: number;
  focusSecondsToday: number;
  completedTasksToday: number;
  checkedItemsToday: number;
  notesCreatedToday: number;

  createdAt: string;
  lastStatsUpdate: string; // ISO date da última atualização dos stats diários
}

export interface AppData {
  user: User;
  tasks: any[];
  checklists: any[];
  notes: any[];
  timer: {
    isRunning: boolean;
    timeLeft: number;
    isBreak: boolean;
    sessionsCompleted: number;
  };
  music: {
    isPlaying: boolean;
    volume: number;
  };
}


export interface User {
  username: string;
  totalPoints: number;
  focusSessionsToday: number;
  focusMinutesToday: number;
  focusSecondsToday: number;
  totalFocusSessions: number;
  totalFocusMinutes: number;
  focusSeconds: number;
  completedTasks: number;
  completedTasksToday: number;
  checkedItems: number;
  checkedItemsToday: number;
  notesCreated: number;
  notesCreatedToday: number;
  createdAt: string;
  lastStatsUpdate?: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  isBreak: boolean;
  sessionsCompleted: number;
}

export interface MusicState {
  isPlaying: boolean;
  volume: number;
  playlistId?: string;
}

export interface AppData {
  user: User;
  tasks: KanbanTask[];
  checklists: Checklist[];
  notes: Note[];
  timer: TimerState;
  music: MusicState;
}

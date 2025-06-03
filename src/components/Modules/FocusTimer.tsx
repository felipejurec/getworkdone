
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Play, Pause, Square, CheckSquare } from 'lucide-react';
import type { TimerState } from '../../types/index';

interface FocusTimerProps {
  timerState: TimerState;
  onTimerUpdate: (state: TimerState) => void;
  onSessionComplete: (minutes: number) => void;
  onFocusTick?: (seconds: number) => void; // Novo callback para cada segundo de foco
  onPause?: () => void;
  onReset?: () => void;
  onSkip?: () => void;
}

export function FocusTimer({ timerState, onTimerUpdate, onSessionComplete, onFocusTick, onPause, onReset, onSkip }: FocusTimerProps) {
  // Deriva o tipo de sessão do estado global
  const sessionType = timerState.isBreak ? 'break' : 'focus';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer logic (useEffect with setInterval) and playNotificationSound have been removed.
  // This component now relies on PersistentControls for timer mechanics.

  const handleStart = () => {
    onTimerUpdate({ ...timerState, isRunning: true });
  };

  const handlePause = () => {
    onTimerUpdate({ ...timerState, isRunning: false });
    if (onPause) onPause();
  };

  const handleReset = () => {
    const defaultTime = timerState.isBreak ? 5 * 60 : 25 * 60;
    onTimerUpdate({
      ...timerState,
      isRunning: false,
      timeLeft: defaultTime,
    });
    if (onReset) onReset();
  };

  const handleSkip = () => {
    if (!timerState.isBreak) {
      onTimerUpdate({
        ...timerState,
        isRunning: false,
        timeLeft: 5 * 60,
        sessionsCompleted: timerState.sessionsCompleted + 1,
        isBreak: true,
      });
    } else {
      onTimerUpdate({
        ...timerState,
        isRunning: false,
        timeLeft: 25 * 60,
        isBreak: false,
      });
    }
    if (onSkip) onSkip();
  };

  const progress = !timerState.isBreak 
    ? ((25 * 60 - timerState.timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timerState.timeLeft) / (5 * 60)) * 100;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Timer de Foco</h2>
        <p className="text-muted-foreground">Técnica Pomodoro para máxima produtividade</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>{timerState.isBreak ? 'Intervalo' : 'Sessão de Foco'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-muted flex items-center justify-center relative overflow-hidden">
                <div 
                  className={`absolute inset-0 rounded-full ${
                    !timerState.isBreak ? 'bg-primary' : 'bg-accent'
                  }`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${
                      progress > 50 
                        ? `100% 0%, 100% ${(progress - 50) * 2}%`
                        : `${50 + progress}% 0%`
                    }, 50% 50%)`
                  }}
                />
                <div className="relative z-10 text-2xl font-bold">
                  {formatTime(timerState.timeLeft)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {!timerState.isRunning ? (
                  <Button 
                    onClick={handleStart}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {!timerState.isBreak ? 'Iniciar Foco' : 'Iniciar Intervalo'}
                  </Button>
                ) : (
                  <Button onClick={handlePause} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                )}
                
                <Button onClick={handleReset} variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  Reiniciar
                </Button>
              </div>

              <Button onClick={handleSkip} variant="ghost" size="sm">
                Pular {!timerState.isBreak ? 'para Intervalo' : 'para Foco'}
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <CheckSquare className="w-4 h-4" />
              <span>Sessões Focadas Hoje: {timerState.sessionsCompleted}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

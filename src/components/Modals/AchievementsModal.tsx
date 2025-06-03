import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Bell, CheckSquare, Pencil, X, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '../../types';

interface AchievementsModalProps {
  user: User;
  onClose: () => void;
}

const motivationalPhrases = [
  "Você é Imparável! ",
  "Produtividade em Alta! ",
  "Foco Total Ativado! ",
  "Conquistador Digital! ",
  "Máquina de Resultados! ",
];

export function AchievementsModal({ user, onClose }: AchievementsModalProps) {
  const [mode, setMode] = useState<'today' | 'total'>('today');



  const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  // Valores exibidos conforme o modo
  // Função para formatar o tempo em minutos e segundos
  const formatFocusTime = (minutes: number, seconds: number) => {
    const totalMinutes = minutes + Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${totalMinutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  };

  const stats = [
    {
      icon: Clock,
      label: 'Tempo Focado',
      value: mode === 'today' 
        ? formatFocusTime(user.focusMinutesToday || 0, user.focusSecondsToday || 0)
        : formatFocusTime(user.totalFocusMinutes || 0, user.focusSeconds || 0),
      color: 'text-blue-500'
    },
    {
      icon: CheckSquare,
      label: 'Tarefas Concluídas',
      value: mode === 'today' ? user.completedTasksToday || 0 : user.completedTasks || 0,
      color: 'text-green-500'
    },
    {
      icon: CheckSquare,
      label: 'Itens Checados',
      value: mode === 'today' ? user.checkedItemsToday || 0 : user.checkedItems || 0,
      color: 'text-purple-500'
    },
    {
      icon: Pencil,
      label: 'Notas Rápidas',
      value: mode === 'today' ? user.notesCreatedToday || 0 : user.notesCreated || 0,
      color: 'text-yellow-500'
    }
  ];

  // Referência para o Card
  const cardRef = useRef<HTMLDivElement>(null);

  // Handler para fechar ao clicar fora
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <Card ref={cardRef} className="w-full max-w-lg glass-effect relative overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">
                {format(new Date(), 'EEEE, d MMMM', { locale: ptBR })}
              </span>
            </div>
            <Select
              value={mode}
              onValueChange={(value) => {
                if (value === 'today' || value === 'total') {
                  setMode(value as 'today' | 'total');
                }
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="total">Total</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <CardHeader className="text-center relative">

          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-accent to-primary animate-pulse">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>

          <CardTitle className="text-2xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Suas Conquistas no GWD!
          </CardTitle>

          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30">
            <div className="text-lg font-bold text-accent">
              {user.username}
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {user.totalPoints.toLocaleString()} PONTOS
            </div>
          </div>

          <div className="text-lg font-semibold text-accent mt-4 animate-pulse">
            {randomPhrase}
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary/50 border border-border/50 text-center"
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Trophy, CheckSquare, Bell, Star } from 'lucide-react';

interface PointsNotificationProps {
  points: number;
  type: 'task' | 'focus' | 'checklist' | 'note';
  onComplete: () => void;
}

export function PointsNotification({ points, type, onComplete }: PointsNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const icons = {
    task: CheckSquare,
    focus: Bell,
    checklist: Star,
    note: Star, // You can choose a different icon for notes if preferred
  };

  const messages = {
    task: 'Tarefa Concluída!',
    focus: 'Sessão de Foco!',
    checklist: 'Item Checado!',
    note: 'Nota Criada!',
  };

  const Icon = icons[type as keyof typeof icons];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className="glass-effect p-4 rounded-lg border-2 border-accent/50 bg-gradient-to-r from-accent/20 to-primary/20 points-animation">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-accent to-primary">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-accent">{messages[type]}</div>
            <div className="text-lg font-bold">
              +{points} PONTOS! 🚀
            </div>
          </div>
          <Trophy className="w-6 h-6 text-accent animate-pulse" />
        </div>
      </div>
    </div>
  );
}

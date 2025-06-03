
import { User, Trophy, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  username: string;
  totalPoints: number;
  onShowAchievements: () => void;
  onShowSettings: () => void;
  onDonateCoffee: () => void;
}

export function Header({ username, totalPoints, onShowAchievements, onShowSettings, onDonateCoffee }: HeaderProps) {
  return (
    <header className="glass-effect border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get Work Done
            </h1>
            <div className="hidden md:block text-sm text-muted-foreground">
              Dados salvos localmente no seu navegador
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-4 px-3 py-1.5 rounded-lg bg-secondary/50">
              <button
                type="button"
                aria-label="Me pague um café"
                className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-900 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition"
                onClick={onDonateCoffee}
              >
                <Coffee className="w-4 h-4" />
                Me pague um café
              </button>
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">{username}</span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="font-bold text-accent">{totalPoints.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            
            <Button 
              onClick={onShowAchievements}
              size="sm"
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
            >
              <Trophy className="w-4 h-4" />
            </Button>
            
            <Button onClick={onShowSettings} variant="ghost" size="sm">
              Configurações
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  CheckSquare, 
  Bell, 
  Star,
  Clock,
  Music,
  Book,
  Pencil,
  LayoutGrid
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
  { id: 'timer', label: 'Foco', icon: Clock },
  { id: 'checklists', label: 'Checklists', icon: CheckSquare },
  { id: 'notes', label: 'Notas', icon: Pencil },
  { id: 'music', label: 'Música', icon: Music },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="glass-effect border-t fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-1 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 min-w-[60px] transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-[#FBDE82] hover:shadow-lg hover:scale-[1.02] hover:text-[#0E131B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

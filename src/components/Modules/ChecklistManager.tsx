
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, CheckSquare, Star } from 'lucide-react';
import { Checklist, ChecklistItem } from '../../types';

interface ChecklistManagerProps {
  checklists: Checklist[];
  onChecklistsChange: (checklists: Checklist[]) => void;
  onItemCheck: (checklistId: string, itemId: string, checked: boolean) => void;
}

export function ChecklistManager({ checklists, onChecklistsChange, onItemCheck }: ChecklistManagerProps) {
  const [newChecklistName, setNewChecklistName] = useState('');
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});
  const [showNewChecklistForm, setShowNewChecklistForm] = useState(false);

  const handleCreateChecklist = () => {
    if (!newChecklistName.trim()) return;

    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      name: newChecklistName,
      items: [],
      createdAt: new Date().toISOString(),
    };

    onChecklistsChange([...checklists, newChecklist]);
    setNewChecklistName('');
    setShowNewChecklistForm(false);
  };

  const handleDeleteChecklist = (checklistId: string) => {
    onChecklistsChange(checklists.filter(c => c.id !== checklistId));
  };

  const handleAddItem = (checklistId: string) => {
    const itemText = newItemTexts[checklistId]?.trim();
    if (!itemText) return;

    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: itemText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return { ...checklist, items: [...checklist.items, newItem] };
      }
      return checklist;
    });

    onChecklistsChange(updatedChecklists);
    setNewItemTexts(prev => ({ ...prev, [checklistId]: '' }));
  };

  const handleToggleItem = (checklistId: string, itemId: string, checked: boolean) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: checked };
          }
          return item;
        });
        return { ...checklist, items: updatedItems };
      }
      return checklist;
    });

    onChecklistsChange(updatedChecklists);
    onItemCheck(checklistId, itemId, checked);
  };


  const handleDeleteItem = (checklistId: string, itemId: string) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return { ...checklist, items: checklist.items.filter(item => item.id !== itemId) };
      }
      return checklist;
    });

    onChecklistsChange(updatedChecklists);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Checklists</h2>
        <p className="text-muted-foreground">Organize suas tarefas em listas práticas</p>
      </div>

      <div className="space-y-6">
        {checklists.map((checklist) => {
          const completedItems = checklist.items.filter(item => item.completed).length;
          const totalItems = checklist.items.length;
          const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

          return (
            <Card key={checklist.id} className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    <span>{checklist.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {completedItems}/{totalItems}
                    </span>
                    <Button
                      onClick={() => handleDeleteChecklist(checklist.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {totalItems > 0 && (
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {checklist.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary/30">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => handleToggleItem(checklist.id, item.id, checked as boolean)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span
                      className={`flex-1 ${
                        item.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {item.text}
                    </span>
                    <Button
                      onClick={() => handleDeleteItem(checklist.id, item.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}

                <div className="flex space-x-2">
                  <Input
                    placeholder="Novo item..."
                    value={newItemTexts[checklist.id] || ''}
                    onChange={(e) => setNewItemTexts(prev => ({ 
                      ...prev, 
                      [checklist.id]: e.target.value 
                    }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(checklist.id);
                      }
                    }}
                  />
                  <Button onClick={() => handleAddItem(checklist.id)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {showNewChecklistForm ? (
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nome da nova checklist"
                  value={newChecklistName}
                  onChange={(e) => setNewChecklistName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateChecklist();
                    }
                  }}
                  autoFocus
                />
                <Button onClick={handleCreateChecklist}>
                  Criar
                </Button>
                <Button
                  onClick={() => setShowNewChecklistForm(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setShowNewChecklistForm(true)}
            variant="outline"
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Checklist
          </Button>
        )}
      </div>
    </div>
  );
}


import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckSquare, Plus, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { KanbanTask } from '../../types/index';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onTasksChange: (tasks: KanbanTask[]) => void;
  onTaskStatusChange: (taskId: string, newStatus: 'todo' | 'doing' | 'done') => void;
}

export function KanbanBoard({ tasks, onTasksChange, onTaskStatusChange }: KanbanBoardProps) {
  // LOG DETALHADO
  console.log('Tasks recebidas por props:', JSON.stringify(tasks, null, 2));
  // Normaliza status antigos para garantir consistência
  const normalizedTasks = tasks.map(task => {
    let status = task.status;
    if (status === 'fazendo') status = 'doing';
    if (status === 'a_fazer') status = 'todo';
    if (status === 'concluido') status = 'done';
    return { ...task, status };
  });
  console.log('Tasks após normalização:', JSON.stringify(normalizedTasks, null, 2));

  const [showNewTaskForm, setShowNewTaskForm] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

  const columns = [
    { id: 'todo', title: 'A Fazer', color: 'border-red-500/30' },
    { id: 'doing', title: 'Fazendo', color: 'border-yellow-500/30' },
    { id: 'done', title: 'Concluído', color: 'border-green-500/30' },
  ];

  const handleAddTask = (status: 'todo' | 'doing' | 'done') => {
    if (!newTask.title.trim()) return;

    const task: KanbanTask = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate || undefined,
      status,
      createdAt: new Date().toISOString(),
    };

    // Sempre derive do normalizedTasks (props)
    onTasksChange([...normalizedTasks, task]);
    setNewTask({ title: '', description: '', dueDate: '' });
    setShowNewTaskForm(null);
  };

  const handleMoveTask = (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    onTaskStatusChange(taskId, newStatus);
  };

  const handleDeleteTask = (taskId: string) => {
    // Sempre derive de normalizedTasks
    onTasksChange(normalizedTasks.filter(task => task.id !== taskId));
  };

  const getTasksByStatus = (status: string) => {
    return normalizedTasks.filter(task => task.status === status);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    console.log('onDragEnd - destination:', destination);
    console.log('onDragEnd - source:', source);
    console.log('onDragEnd - draggableId:', draggableId);

    if (!destination) {
      console.log('Drag cancelado - sem destination');
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('Drag cancelado - mesma posição');
      return;
    }

    const newStatus = destination.droppableId as 'todo' | 'doing' | 'done';
    console.log('Novo status:', newStatus);
    // Atualização atômica
    onTaskStatusChange(draggableId, newStatus);
  };

  const getNextStatus = (currentStatus: 'todo' | 'doing' | 'done'): 'todo' | 'doing' | 'done' | null => {
    const statusOrder = ['todo', 'doing', 'done'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] as 'todo' | 'doing' | 'done' : null;
  };

  const getPrevStatus = (currentStatus: 'todo' | 'doing' | 'done'): 'todo' | 'doing' | 'done' | null => {
    const statusOrder = ['todo', 'doing', 'done'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex > 0 ? statusOrder[currentIndex - 1] as 'todo' | 'doing' | 'done' : null;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Meu Trabalho</h2>
        <p className="text-muted-foreground">Organize suas tarefas e mantenha o foco</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${column.color} bg-secondary/30`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver ? 'bg-primary/10 rounded-lg p-2' : ''
                      }`}
                    >
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`glass-effect ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-primary' : ''
                              }`}
                            >
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium flex-1">{task.title}</h4>
                                  <Button
                                    onClick={() => handleDeleteTask(task.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                                
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                )}
                                
                                {task.dueDate && (
                                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}

                                <div className="flex space-x-1">
                                  {getPrevStatus(task.status) && (
                                    <Button
                                      onClick={() => handleMoveTask(task.id, getPrevStatus(task.status)!)}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 px-2"
                                    >
                                      <ArrowLeft className="w-3 h-3 mr-1" />
                                      Voltar
                                    </Button>
                                  )}
                                  {getNextStatus(task.status) && (
                                    <Button
                                      onClick={() => handleMoveTask(task.id, getNextStatus(task.status)!)}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 px-2"
                                    >
                                      {getNextStatus(task.status) === 'done' ? '✅' : <ArrowRight className="w-3 h-3 mr-1" />}
                                      {getNextStatus(task.status) === 'done' ? 'Concluir' : 'Avançar'}
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Only show Add Task form/button if column is not 'done' */}
                      {column.id !== 'done' && (
                        <>
                          {showNewTaskForm === column.id ? (
                            <Card className="glass-effect">
                              <CardContent className="p-3 space-y-3">
                                <Input
                                  placeholder="Título da tarefa"
                                  value={newTask.title}
                                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                  autoFocus
                                />
                                <Textarea
                                  placeholder="Descrição (opcional)"
                                  value={newTask.description}
                                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                  rows={2}
                                />
                                <Input
                                  type="date"
                                  value={newTask.dueDate}
                                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => handleAddTask(column.id as any)}
                                    size="sm"
                                    className="flex-1"
                                  >
                                    Adicionar
                                  </Button>
                                  <Button
                                    onClick={() => setShowNewTaskForm(null)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Button
                              onClick={() => setShowNewTaskForm(column.id)}
                              variant="ghost"
                              className="w-full mt-2 border-dashed border-2 border-muted-foreground/30 hover:border-muted-foreground/50 transition"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Nova Tarefa
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

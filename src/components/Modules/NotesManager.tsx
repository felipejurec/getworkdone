
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Star } from 'lucide-react';
import { Note } from '../../types';

interface NotesManagerProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  onNoteCreate: (note: Note) => void;
}

export function NotesManager({ notes, onNotesChange, onNoteCreate }: NotesManagerProps) {
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const handleCreateNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      content: newNoteContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onNoteCreate(newNote);
    setNewNoteContent('');
    setShowNewNoteForm(false);
  };

  const handleUpdateNote = (noteId: string, content: string) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { ...note, content, updatedAt: new Date().toISOString() };
      }
      return note;
    });

    onNotesChange(updatedNotes);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    onNotesChange(notes.filter(note => note.id !== noteId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Notas Rápidas</h2>
        <p className="text-muted-foreground">Capture ideias e informações importantes</p>
      </div>

      <div className="space-y-4">
        {showNewNoteForm ? (
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Digite sua nota aqui..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button onClick={handleCreateNote}>
                    Salvar Nota
                  </Button>
                  <Button
                    onClick={() => setShowNewNoteForm(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setShowNewNoteForm(true)}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota Rápida
          </Button>
        )}

        {notes.length === 0 && !showNewNoteForm && (
          <Card className="glass-effect">
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Você ainda não tem notas. Crie sua primeira nota para começar!
              </p>
            </CardContent>
          </Card>
        )}

        {notes.map((note) => (
          <Card key={note.id} className="glass-effect">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {formatDate(note.updatedAt)}
                </div>
                <Button
                  onClick={() => handleDeleteNote(note.id)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {editingNote === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    defaultValue={note.content}
                    onBlur={(e) => handleUpdateNote(note.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditingNote(null);
                      }
                    }}
                    rows={4}
                    autoFocus
                  />
                  <Button
                    onClick={() => setEditingNote(null)}
                    variant="outline"
                    size="sm"
                  >
                    Concluir Edição
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => setEditingNote(note.id)}
                  className="cursor-pointer p-2 rounded hover:bg-secondary/30 transition-colors"
                >
                  <p className="whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Clique para editar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

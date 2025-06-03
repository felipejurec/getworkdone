
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, X, Star } from 'lucide-react';

interface SettingsModalProps {
  username: string;
  onUpdateUsername: (username: string) => void;
  onClearData: () => void;
  onClose: () => void;
}

export function SettingsModal({ username, onUpdateUsername, onClearData, onClose }: SettingsModalProps) {
  const [newUsername, setNewUsername] = useState(username);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const handleUpdateUsername = () => {
    if (newUsername.trim() && newUsername.trim() !== username) {
      onUpdateUsername(newUsername.trim());
    }
    onClose();
  };

  const handleClearData = () => {
    if (showClearConfirmation) {
      onClearData();
      onClose();
    } else {
      setShowClearConfirmation(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-primary" />
              <span>Configurações</span>
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Nome de Usuário</label>
            <div className="flex space-x-2">
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Seu nome de usuário"
              />
              <Button 
                onClick={handleUpdateUsername}
                disabled={!newUsername.trim() || newUsername.trim() === username}
              >
                Salvar
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-destructive">Zona de Perigo</label>
              <p className="text-sm text-muted-foreground">
                Esta ação irá apagar todos os seus dados permanentemente.
              </p>
              <Button
                onClick={handleClearData}
                variant={showClearConfirmation ? "destructive" : "outline"}
                className="w-full"
              >
                {showClearConfirmation ? 'Confirmar Limpeza' : 'Limpar Todos os Dados'}
              </Button>
              {showClearConfirmation && (
                <Button
                  onClick={() => setShowClearConfirmation(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Sobre o Get Work Done</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Plataforma de produtividade gamificada para profissionais digitais.</p>
              <p><strong>Armazenamento:</strong> Todos os dados são salvos localmente no seu navegador.</p>
              <p><strong>Privacidade:</strong> Nenhum dado é enviado para servidores externos.</p>
              <p><strong>Backup:</strong> Recomendamos fazer backup manual dos seus dados importantes.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

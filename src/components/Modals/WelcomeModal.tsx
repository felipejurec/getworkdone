
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

interface WelcomeModalProps {
  onSetUsername: (username: string) => void;
}

export function WelcomeModal({ onSetUsername }: WelcomeModalProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Bem-vindo ao Get Work Done!
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Sua plataforma de produtividade gamificada. Para começar, escolha um nome de usuário.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Digite seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Seus dados ficarão salvos no navegador
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              disabled={!username.trim()}
            >
              Começar Jornada 🚀
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

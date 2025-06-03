import React from 'react'; // Adicionado React para garantir que JSX funciona

interface ToggleButtonProps {
  mode: 'today' | 'total';
  onModeChange: (mode: 'today' | 'total') => void;
}

export function ToggleButton({ mode, onModeChange }: ToggleButtonProps) {
  const toggleMode = () => {
    const newMode = mode === 'today' ? 'total' : 'today'; // Lógica para alternar o modo
    onModeChange(newMode);
  };

  return (
    <button
      className="px-2 py-1 text-sm text-muted-foreground hover:bg-zinc-900/50 rounded-md transition-colors"
      onClick={toggleMode}
    >
      {mode === 'today' ? 'Hoje' : 'Total'} {/* <-- MUDANÇA AQUI: Mostra o modo ATUAL */}
    </button>
  );
}
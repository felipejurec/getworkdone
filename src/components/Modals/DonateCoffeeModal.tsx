import { X, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface DonateCoffeeModalProps {
  onClose: () => void;
}

export function DonateCoffeeModal({ onClose }: DonateCoffeeModalProps) {
  const pixCode = '40.104.581-0001-26';
  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixCode);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-background rounded-xl shadow-xl w-full max-w-xs p-6 flex flex-col items-center">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-primary">
          <X className="w-5 h-5" />
        </button>
        <Coffee className="w-10 h-10 text-yellow-600 mb-2" />
        <h2 className="text-lg font-bold mb-2">Me pague um café para apoiar o projeto!</h2>
        <img
          src="/pix-coffee-qr.png"
          alt="QR Code PIX"
          className="w-40 h-40 rounded bg-white mb-2 border"
        />
        <div className="w-full text-center mt-2 mb-1">
          <span className="text-sm text-muted-foreground">Código PIX:</span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="font-mono text-base select-all">40.104.581-0001-26</span>
            <Button size="icon" variant="ghost" onClick={handleCopy} title="Copiar código PIX">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Felipe Jurec</div>
      </div>
    </div>
  );
}

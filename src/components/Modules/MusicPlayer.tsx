
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Star, Music } from 'lucide-react';
import type { MusicState } from '../../types/index';

interface MusicPlayerProps {
  musicState: MusicState;
  onMusicStateChange: (state: MusicState) => void;
}

export function MusicPlayer({ musicState, onMusicStateChange }: MusicPlayerProps) {
  // Define um valor padrão para playlistId
  const currentPlaylist = 'playlistId' in musicState ? musicState.playlistId || 'lofi' : 'lofi';

  const playlists = [
    {
      id: 'lofi',
      name: 'Lo-Fi Hip Hop',
      description: 'Beats relaxantes para estudar e trabalhar',
      color: 'from-purple-500 to-pink-500',
      youtubeId: 'n61ULEU7CO0',
    },
    {
      id: 'jazz',
      name: 'Smooth Jazz',
      description: 'Jazz suave para concentração',
      color: 'from-blue-500 to-cyan-500',
      youtubeId: 'rVUv_j9AiVM',
    },
    {
      id: 'ambient',
      name: 'Ambient Focus',
      description: 'Sons ambientais para foco profundo',
      color: 'from-green-500 to-teal-500',
      youtubeId: 'PRAGLqfNK1o',
    }
  ];

  const activePlaylist = playlists.find(p => p.id === currentPlaylist) || playlists[0];

  // Handler para trocar playlist globalmente
  const handlePlaylistChange = (playlistId: string) => {
    // Pause antes de trocar
    if (musicState.isPlaying) {
      onMusicStateChange({ ...musicState, isPlaying: false });
      setTimeout(() => {
        onMusicStateChange({ ...musicState, playlistId, isPlaying: true });
      }, 200);
    } else {
      onMusicStateChange({ ...musicState, playlistId });
    }
  };


  const handleVolumeChange = (value: number[]) => {
    onMusicStateChange({ ...musicState, volume: value[0] });
  };

  const togglePlayPause = () => {
    onMusicStateChange({ ...musicState, isPlaying: !musicState.isPlaying });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Música para Foco</h2>
        <p className="text-muted-foreground">Ambiente sonoro perfeito para produtividade</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Player Principal */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className={`bg-gradient-to-r ${activePlaylist.color} bg-clip-text text-transparent`}>
              {activePlaylist.name}
            </CardTitle>
            <p className="text-muted-foreground">{activePlaylist.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
             {/* Player Display */}
             <div className="flex flex-col items-center justify-center min-h-[120px]">
               {musicState.isPlaying ? (
                 <>
                   <Music className="w-10 h-10 animate-pulse text-primary mb-2" />
                   <span className="text-base text-primary font-semibold">A música está tocando em segundo plano</span>
                 </>
               ) : (
                 <>
                   <Music className="w-10 h-10 text-muted-foreground mb-2" />
                   <span className="text-base text-muted-foreground">A música está pausada</span>
                 </>
               )}
             </div>

            {/* Controles */}
            <div className="flex items-center justify-between">
              <Button
                onClick={togglePlayPause}
                size="lg"
                className={`bg-gradient-to-r ${activePlaylist.color} hover:opacity-90`}
              >
                {musicState.isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>

              <div className="flex items-center space-x-3 flex-1 ml-6">
                <span className="text-sm text-muted-foreground">Volume</span>
                <Slider
                  value={[musicState.volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">
                  {musicState.volume}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seletor de Playlists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              className={`glass-effect cursor-pointer transition-all duration-200 hover:scale-105 ${
                currentPlaylist === playlist.id 
                  ? 'ring-2 ring-primary' 
                  : ''
              }`}
              onClick={() => handlePlaylistChange(playlist.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${playlist.color} flex items-center justify-center`}>
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{playlist.name}</h3>
                <p className="text-xs text-muted-foreground">{playlist.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>🎵 A música continua tocando mesmo quando você troca de página</p>
              <p>Use os controles na barra inferior para pausar/tocar rapidamente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

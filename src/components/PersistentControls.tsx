
import { useState, useEffect, useCallback, useRef } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Square, Music, Timer, Volume2 } from 'lucide-react';
import type { TimerState, MusicState } from '../types/index'; // Made import more explicit

interface PersistentControlsProps {
  timerState: TimerState;
  musicState: MusicState & { playlistId?: string };
  onTimerUpdate: (state: TimerState) => void;
  onMusicStateChange: (state: MusicState & { playlistId?: string }) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSessionComplete: (minutes: number) => void; // Added for session completion callback
  onFocusTick?: (seconds: number) => void; // Added for focus tick callback
}

export function PersistentControls({ 
  timerState, 
  musicState, 
  onTimerUpdate, 
  onMusicStateChange, 
  activeTab,
  onTabChange,
  onSessionComplete, // Added prop
  onFocusTick // Added prop
}: PersistentControlsProps) {
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  // Playlist global: musicState.playlistId
  const currentPlaylist = musicState.playlistId || 'lofi';

  const playlists = [
    {
      id: 'lofi',
      name: 'Lo-Fi Hip Hop',
      youtubeId: 'n61ULEU7CO0',
    },
    {
      id: 'jazz',
      name: 'Smooth Jazz',
      youtubeId: 'rVUv_j9AiVM',
    },
    {
      id: 'ambient',
      name: 'Ambient Focus',
      youtubeId: 'PRAGLqfNK1o',
    },
  ];

  const activePlaylist = playlists.find(p => p.id === currentPlaylist) || playlists[0];

  // Estado local para garantir que só tentamos manipular o player quando pronto
  const [playerReady, setPlayerReady] = useState(false);

  const handlePlaylistChange = async (playlistId: string) => {
    // Pause o player antes de trocar, se possível
    try {
      if (playerRef.current && playerReady) {
        await playerRef.current.pauseVideo();
      }
    } catch (e) {
      // ignora erro se player não estiver pronto
    }
    // Atualize o estado global
    if (musicState.isPlaying) {
      onMusicStateChange({ ...musicState, isPlaying: false });
      setTimeout(() => {
        onMusicStateChange({ ...musicState, playlistId, isPlaying: true });
      }, 200);
    } else {
      onMusicStateChange({ ...musicState, playlistId });
    }
  };

  // Controle do player YouTube
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Atualize playerReady no onReady
  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    setPlayerReady(true);
    event.target.setVolume(musicState.volume);
    if (musicState.isPlaying) {
      event.target.playVideo();
    } else {
      event.target.pauseVideo();
    }
  };



  // Atualiza volume sempre que mudar
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(musicState.volume);
    }
  }, [musicState.volume]);

  // Play/pause global
  useEffect(() => {
    if (playerRef.current && playerReady) {
      if (musicState.isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [musicState.isPlaying, playerReady]);

  // Troca de playlist: toca automaticamente se já estava tocando
  useEffect(() => {
    if (playerRef.current && playerReady && musicState.isPlaying) {
      playerRef.current.playVideo();
    }
  }, [activePlaylist.youtubeId, playerReady]);



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playNotificationSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        onTimerUpdate({
          ...timerState,
          timeLeft: timerState.timeLeft - 1,
        });
        // Call onFocusTick if it's a focus session
        if (!timerState.isBreak && typeof onFocusTick === 'function') {
          onFocusTick(1);
        }
      }, 1000);
    } else if (timerState.isRunning && timerState.timeLeft === 0) {
      playNotificationSound();
      
      if (sessionType === 'focus') {
        // Focus session completed
        if (typeof onSessionComplete === 'function') {
          const focusDurationMinutes = 25; // Assuming 25 minutes based on original FocusTimer logic
          onSessionComplete(focusDurationMinutes);
        }
        onTimerUpdate({
          ...timerState,
          isRunning: false,
          timeLeft: 5 * 60,
          sessionsCompleted: timerState.sessionsCompleted + 1,
        });
        setSessionType('break');
      } else {
        onTimerUpdate({
          ...timerState,
          isRunning: false,
          timeLeft: 25 * 60,
        });
        setSessionType('focus');
      }
    }

    return () => clearInterval(interval);
  }, [timerState, sessionType, onTimerUpdate, playNotificationSound, onSessionComplete, onFocusTick]);

  const handleTimerToggle = () => {
    onTimerUpdate({ ...timerState, isRunning: !timerState.isRunning });
  };

  const handleTimerReset = () => {
    const defaultTime = sessionType === 'focus' ? 25 * 60 : 5 * 60;
    onTimerUpdate({
      ...timerState,
      isRunning: false,
      timeLeft: defaultTime,
    });
  };

  const handleMusicToggle = () => {
    onMusicStateChange({ ...musicState, isPlaying: !musicState.isPlaying });
  };

  const showTimerControls = timerState.isRunning || timerState.timeLeft !== (sessionType === 'focus' ? 25 * 60 : 5 * 60);
  const showMusicControls = musicState.isPlaying;

  return (
    <>
      {/* Persistent YouTube Player - Hidden and never visible */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <YouTube
          videoId={activePlaylist.youtubeId}
          opts={{
            width: '100',
            height: '100',
            playerVars: {
              autoplay: musicState.isPlaying ? 1 : 0,
              mute: 0,
              controls: 0,
              loop: 1,
              playlist: activePlaylist.youtubeId,
            },
          }}
          onReady={onReady}
        />
      </div>

      {/* Controls Bar */}
      {(showTimerControls || showMusicControls) && (
        <div className="fixed bottom-20 left-4 right-4 z-40 pointer-events-none">
          <div className="flex justify-center">
            <Card className="glass-effect pointer-events-auto">
              <CardContent className="p-3">
                <div className="flex items-center space-x-4">
                  {/* Timer Controls */}
                  {showTimerControls && (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => onTabChange('timer')}
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${activeTab === 'timer' ? 'bg-primary/20' : ''}`}
                      >
                        <Timer className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-sm font-mono min-w-[45px]">
                        {formatTime(timerState.timeLeft)}
                      </span>
                      
                      <Button
                        onClick={handleTimerToggle}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                      >
                        {timerState.isRunning ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>

                      <Button
                        onClick={handleTimerReset}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Separador */}
                  {showTimerControls && showMusicControls && (
                    <div className="h-6 w-px bg-border" />
                  )}

                  {/* Music Controls */}
                  {showMusicControls && (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => onTabChange('music')}
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${activeTab === 'music' ? 'bg-primary/20' : ''}`}
                      >
                        <Music className="w-4 h-4" />
                      </Button>

                      <Button
                        onClick={handleMusicToggle}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                      >
                        {musicState.isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>

                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm min-w-[25px]">{musicState.volume}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

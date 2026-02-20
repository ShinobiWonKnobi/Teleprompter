import { useState, useMemo, useEffect } from 'react';
import { Play, Pause, Settings as SettingsIcon, Edit3, Type, X, Minimize2 } from 'lucide-react';
import { AppMode, PrompterSettings } from './types';
import { Editor } from './components/Editor';
import { Prompter } from './components/Prompter';
import { Settings } from './components/Settings';
import './index.css';

function App() {
  const [mode, setMode] = useState<AppMode>('edit');
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState("Welcome to your Teleprompter!\n\nPaste your script here.\nThen click the play button to start scrolling.");
  const [settings, setSettings] = useState<PrompterSettings>({
    fontSize: 48,
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundOpacity: 60,
    scrollSpeed: 5,
  });

  useEffect(() => {
    if (!window.ipcRenderer) return;

    const onPlayPause = () => {
      setMode((prev) => {
        if (prev !== 'prompt') return 'prompt';
        return prev;
      });
      setIsPlaying((prev) => !prev);
    };

    const onSpeedUp = () => {
      setSettings((prev) => ({ ...prev, scrollSpeed: Math.min(prev.scrollSpeed + 1, 20) }));
    };

    const onSpeedDown = () => {
      setSettings((prev) => ({ ...prev, scrollSpeed: Math.max(prev.scrollSpeed - 1, 1) }));
    };

    window.ipcRenderer.on('shortcut-play-pause', onPlayPause);
    window.ipcRenderer.on('shortcut-speed-up', onSpeedUp);
    window.ipcRenderer.on('shortcut-speed-down', onSpeedDown);

    return () => {
      window.ipcRenderer.off('shortcut-play-pause', onPlayPause);
      window.ipcRenderer.off('shortcut-speed-up', onSpeedUp);
      window.ipcRenderer.off('shortcut-speed-down', onSpeedDown);
    };
  }, []);

  // Local keyboard shortcuts when the app is in focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a textarea or input
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setMode((prev) => {
          if (prev !== 'prompt') return 'prompt';
          return prev;
        });
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, scrollSpeed: Math.min(prev.scrollSpeed + 1, 20) }));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, scrollSpeed: Math.max(prev.scrollSpeed - 1, 1) }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rgbaBackground = useMemo(() => {
    // Very naive hex to rgb
    let r = 0, g = 0, b = 0;
    if (settings.backgroundColor.length === 7) {
      r = parseInt(settings.backgroundColor.slice(1, 3), 16);
      g = parseInt(settings.backgroundColor.slice(3, 5), 16);
      b = parseInt(settings.backgroundColor.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${settings.backgroundOpacity / 100})`;
  }, [settings.backgroundColor, settings.backgroundOpacity]);

  return (
    <div
      className="w-full h-screen flex flex-col font-sans overflow-hidden"
      style={{ backgroundColor: rgbaBackground }}
    >
      {/* Titlebar / Drag Region */}
      <div className="drag-region w-full h-12 flex items-center justify-between px-4 bg-black/40 text-gray-300 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Type size={18} className="text-blue-400" />
          <span className="text-sm font-medium tracking-wider">Teleprompter</span>
        </div>

        {/* Controls - need no-drag-region to be clickable */}
        <div className="no-drag-region flex items-center gap-1">
          <button
            onClick={() => { setMode('edit'); setIsPlaying(false); }}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${mode === 'edit' ? 'text-blue-400' : ''}`}
            title="Edit Script"
          >
            <Edit3 size={18} />
          </button>

          <button
            onClick={() => setMode('settings')}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${mode === 'settings' ? 'text-blue-400' : ''}`}
            title="Settings"
          >
            <SettingsIcon size={18} />
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <button
            onClick={() => {
              if (mode !== 'prompt') setMode('prompt');
              setIsPlaying(!isPlaying);
            }}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${isPlaying ? 'text-green-400' : ''}`}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <button
            onClick={() => window.ipcRenderer?.send('window-minimize')}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            title="Minimize"
          >
            <Minimize2 size={18} />
          </button>

          <button
            onClick={() => window.ipcRenderer?.send('window-close')}
            className="p-2 rounded hover:bg-red-500/80 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full relative overflow-hidden">
        {mode === 'edit' && <Editor text={text} setText={setText} settings={settings} />}
        {mode === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
        {mode === 'prompt' && <Prompter text={text} settings={settings} isPlaying={isPlaying} />}
      </div>
    </div>
  );
}

export default App;

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Settings as SettingsIcon, Edit3, Type, X, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { AppMode, PrompterSettings } from './types';
import { Editor } from './components/Editor';
import { Prompter } from './components/Prompter';
import { Settings } from './components/Settings';
import './index.css';

const DEFAULT_SETTINGS: PrompterSettings = {
  fontSize: 64,
  textColor: '#ffffff',
  backgroundColor: '#000000',
  backgroundOpacity: 60,
  scrollSpeed: 5,
  textMargin: 80, // Default to a reasonable reading width (max-w-4xl roughly)
  showReadingGuide: true
};

function App() {
  const [mode, setMode] = useState<AppMode>('edit');
  const [isPlaying, setIsPlaying] = useState(false);

  // Persisted State
  const [text, setText] = useState(() => {
    return localStorage.getItem('teleprompter_text') || "Welcome to your Teleprompter!\n\nPaste your script here.\nThen click the play button to start scrolling.";
  });

  const [settings, setSettings] = useState<PrompterSettings>(() => {
    const saved = localStorage.getItem('teleprompter_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  // HUD State
  const [hudIcon, setHudIcon] = useState<React.ReactNode | null>(null);
  const hudTimeout = useRef<NodeJS.Timeout>();

  const showHud = (icon: React.ReactNode) => {
    setHudIcon(icon);
    if (hudTimeout.current) clearTimeout(hudTimeout.current);
    hudTimeout.current = setTimeout(() => setHudIcon(null), 800);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('teleprompter_text', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('teleprompter_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!window.ipcRenderer) return;

    const onPlayPause = () => {
      setMode((prev) => prev !== 'prompt' ? 'prompt' : prev);
      setIsPlaying((prev) => {
        showHud(!prev ? <Play size={32} className="text-white drop-shadow-lg" /> : <Pause size={32} className="text-white drop-shadow-lg" />);
        return !prev;
      });
    };

    const onSpeedUp = () => {
      setSettings((prev) => {
        const newSpeed = Math.min(prev.scrollSpeed + 1, 100);
        showHud(<div className="flex flex-col items-center text-white font-bold text-xl drop-shadow-lg"><ChevronUp size={28} />{newSpeed}</div>);
        return { ...prev, scrollSpeed: newSpeed };
      });
    };

    const onSpeedDown = () => {
      setSettings((prev) => {
        const newSpeed = Math.max(prev.scrollSpeed - 1, 1);
        showHud(<div className="flex flex-col items-center text-white font-bold text-xl drop-shadow-lg"><ChevronDown size={28} />{newSpeed}</div>);
        return { ...prev, scrollSpeed: newSpeed };
      });
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
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setMode((prev) => prev !== 'prompt' ? 'prompt' : prev);
        setIsPlaying((prev) => {
          showHud(!prev ? <Play size={32} className="text-white drop-shadow-lg" /> : <Pause size={32} className="text-white drop-shadow-lg" />);
          return !prev;
        });
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setSettings((prev) => {
          const newSpeed = Math.min(prev.scrollSpeed + 1, 100);
          showHud(<div className="flex flex-col items-center text-white font-bold text-2xl drop-shadow-lg"><ChevronUp size={48} />{newSpeed}</div>);
          return { ...prev, scrollSpeed: newSpeed };
        });
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setSettings((prev) => {
          const newSpeed = Math.max(prev.scrollSpeed - 1, 1);
          showHud(<div className="flex flex-col items-center text-white font-bold text-xl drop-shadow-lg"><ChevronDown size={28} />{newSpeed}</div>);
          return { ...prev, scrollSpeed: newSpeed };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rgbaBackground = useMemo(() => {
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
      className="w-full h-screen flex flex-col font-sans overflow-hidden transition-colors duration-500 ease-in-out relative"
      style={{ backgroundColor: rgbaBackground }}
    >
      {/* Titlebar / Drag Region */}
      <div className="drag-region w-full h-12 flex items-center justify-between px-4 bg-black/40 text-gray-300 border-b border-white/10 shrink-0 backdrop-blur-md z-50 shadow-sm transition-opacity hover:opacity-100 opacity-80">
        <div className="flex items-center gap-2">
          <Type size={18} className="text-white drop-shadow-md" />
          <span className="text-sm font-semibold tracking-wider text-white drop-shadow-md">Teleprompter</span>
        </div>

        {/* Controls - need no-drag-region to be clickable */}
        <div className="no-drag-region flex items-center gap-1">
          <button
            onClick={() => { setMode('edit'); setIsPlaying(false); }}
            className={`p-2 rounded hover:bg-white/20 transition-all ${mode === 'edit' ? 'text-blue-400 bg-white/10 shadow-inner' : ''}`}
            title="Edit Script"
          >
            <Edit3 size={18} />
          </button>

          <button
            onClick={() => { setMode('settings'); setIsPlaying(false); }}
            className={`p-2 rounded hover:bg-white/20 transition-all ${mode === 'settings' ? 'text-blue-400 bg-white/10 shadow-inner' : ''}`}
            title="Settings"
          >
            <SettingsIcon size={18} />
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <button
            onClick={() => {
              if (mode !== 'prompt') setMode('prompt');
              setIsPlaying(!isPlaying);
              showHud(!isPlaying ? <Play size={32} className="text-white drop-shadow-lg" /> : <Pause size={32} className="text-white drop-shadow-lg" />);
            }}
            className={`p-2 rounded transition-all hover:bg-white/20 ${isPlaying ? 'text-green-400 bg-white/10 shadow-inner' : ''}`}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <button
            onClick={() => window.ipcRenderer?.send('window-minimize')}
            className="p-2 rounded hover:bg-white/20 transition-colors"
            title="Minimize"
          >
            <Minimize2 size={18} />
          </button>

          <button
            onClick={() => window.ipcRenderer?.send('window-close')}
            className="p-2 rounded hover:bg-red-500/80 hover:text-white transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full relative overflow-hidden">

        {/* Animated HUD Overlay */}
        <AnimatePresence>
          {hudIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-8 right-8 w-20 h-20 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center z-50 pointer-events-none"
            >
              {hudIcon}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {mode === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Editor text={text} setText={setText} settings={settings} />
            </motion.div>
          )}

          {mode === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute inset-0 z-10"
            >
              <Settings settings={settings} setSettings={setSettings} />
            </motion.div>
          )}

          {mode === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Prompter text={text} settings={settings} isPlaying={isPlaying} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

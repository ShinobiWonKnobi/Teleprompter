import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PrompterSettings } from '../types';

interface SettingsProps {
    settings: PrompterSettings;
    setSettings: (settings: PrompterSettings) => void;
}

const COLORS = [
    { name: 'Pure White', value: '#ffffff' },
    { name: 'Soft Yellow', value: '#fef08a' },
    { name: 'Neon Green', value: '#4ade80' },
    { name: 'Sky Blue', value: '#38bdf8' },
];

const BG_COLORS = [
    { name: 'Deep Black', value: '#000000' },
    { name: 'Navy Blue', value: '#0f172a' },
    { name: 'Dark Purple', value: '#2e1065' },
];

export const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
    const update = (key: keyof PrompterSettings, value: string | number | boolean) => {
        setSettings({ ...settings, [key]: value as never });
    };

    return (
        <div className="flex flex-col p-8 w-full max-w-lg mx-auto h-full overflow-y-auto text-white space-y-8 no-drag-region">

            {/* Settings Header */}
            <div className="flex flex-col mb-4">
                <h2 className="text-3xl font-semibold tracking-tight text-white/90 drop-shadow-sm">Preferences</h2>
                <p className="text-sm text-gray-400 mt-1">Customize your reading experience.</p>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-gray-200">Text Size</label>
                    <span className="text-xs text-blue-400 font-mono bg-blue-400/10 px-2 py-1 rounded-md">{settings.fontSize}px</span>
                </div>
                <input
                    type="range" min="16" max="150" value={settings.fontSize}
                    onChange={(e) => update('fontSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
            </div>

            {/* Speed Slider */}
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-gray-200">Scroll Speed</label>
                    <span className="text-xs text-blue-400 font-mono bg-blue-400/10 px-2 py-1 rounded-md">{settings.scrollSpeed}</span>
                </div>
                <input
                    type="range" min="1" max="100" value={settings.scrollSpeed}
                    onChange={(e) => update('scrollSpeed', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
            </div>

            {/* Opacity Slider */}
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-gray-200">Background Opacity</label>
                    <span className="text-xs text-blue-400 font-mono bg-blue-400/10 px-2 py-1 rounded-md">{settings.backgroundOpacity}%</span>
                </div>
                <input
                    type="range" min="0" max="100" value={settings.backgroundOpacity}
                    onChange={(e) => update('backgroundOpacity', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
            </div>

            {/* Reading Width Slider */}
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-gray-200">Reading Width Constraints</label>
                    <span className="text-xs text-blue-400 font-mono bg-blue-400/10 px-2 py-1 rounded-md">{settings.textMargin}%</span>
                </div>
                <input
                    type="range" min="30" max="100" value={settings.textMargin}
                    onChange={(e) => update('textMargin', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
            </div>

            {/* Reading Guide Toggle */}
            <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-200 cursor-pointer select-none" onClick={() => update('showReadingGuide', !settings.showReadingGuide)}>
                        Eye-Line Reading Guide
                    </label>
                    <span className="text-xs text-gray-400 mt-1">Highlights the camera reading zone</span>
                </div>
                <button
                    onClick={() => update('showReadingGuide', !settings.showReadingGuide)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showReadingGuide ? 'bg-blue-500' : 'bg-gray-600'}`}
                >
                    <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ${settings.showReadingGuide ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>
            </div>

            {/* Colors Pickers */}
            <div className="flex gap-4">
                {/* Text Color */}
                <div className="flex flex-col flex-1 space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                    <label className="text-sm font-medium text-gray-200">Text Color</label>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => update('textColor', c.value)}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${settings.textColor === c.value ? 'border-blue-500' : 'border-transparent shadow-md'}`}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            >
                                {settings.textColor === c.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={14} className="text-black drop-shadow-sm" /></motion.div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* BG Color */}
                <div className="flex flex-col flex-1 space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                    <label className="text-sm font-medium text-gray-200">Backdrop Tint</label>
                    <div className="flex flex-wrap gap-3">
                        {BG_COLORS.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => update('backgroundColor', c.value)}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${settings.backgroundColor === c.value ? 'border-blue-500' : 'border-white/20 shadow-md'}`}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            >
                                {settings.backgroundColor === c.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={14} className="text-white drop-shadow-sm" /></motion.div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-20" /> {/* Bottom Spacer */}
        </div>
    );
};

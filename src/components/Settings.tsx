import React from 'react';
import { PrompterSettings } from '../types';

interface SettingsProps {
    settings: PrompterSettings;
    setSettings: (settings: PrompterSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
    const update = (key: keyof PrompterSettings, value: string | number) => {
        setSettings({ ...settings, [key]: value });
    };

    return (
        <div className="flex flex-col p-6 w-full max-w-md mx-auto text-white space-y-4 no-drag-region">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Settings</h2>

            <div className="space-y-1">
                <label className="text-sm text-gray-300">Font Size ({settings.fontSize}px)</label>
                <input
                    type="range" min="16" max="120" value={settings.fontSize}
                    onChange={(e) => update('fontSize', parseInt(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm text-gray-300">Scroll Speed ({settings.scrollSpeed})</label>
                <input
                    type="range" min="1" max="20" value={settings.scrollSpeed}
                    onChange={(e) => update('scrollSpeed', parseInt(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm text-gray-300">Background Opacity ({settings.backgroundOpacity})</label>
                <input
                    type="range" min="0" max="100" value={settings.backgroundOpacity}
                    onChange={(e) => update('backgroundOpacity', parseInt(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col flex-1 space-y-1">
                    <label className="text-sm text-gray-300">Text Color</label>
                    <input
                        type="color" value={settings.textColor}
                        onChange={(e) => update('textColor', e.target.value)}
                        className="w-full h-10 cursor-pointer bg-transparent"
                    />
                </div>
                <div className="flex flex-col flex-1 space-y-1">
                    <label className="text-sm text-gray-300">Background Color</label>
                    <input
                        type="color" value={settings.backgroundColor}
                        onChange={(e) => update('backgroundColor', e.target.value)}
                        className="w-full h-10 cursor-pointer bg-transparent"
                    />
                </div>
            </div>
        </div>
    );
};

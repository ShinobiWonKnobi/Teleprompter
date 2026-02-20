import React from 'react';
import { Trash2 } from 'lucide-react';
import { PrompterSettings } from '../types';

interface EditorProps {
    text: string;
    setText: (text: string) => void;
    settings: PrompterSettings;
}

export const Editor: React.FC<EditorProps> = ({ text, setText, settings }) => {
    return (
        <div className="flex-1 w-full h-full flex flex-col p-4 no-drag-region relative">
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-300">Script Editor</div>
                <button
                    onClick={() => setText('')}
                    className="text-xs flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Clear Script"
                >
                    <Trash2 size={14} /> Clear
                </button>
            </div>
            <textarea
                className="flex-1 w-full bg-black/50 text-white rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: `${settings.fontSize}px`, color: settings.textColor }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your script here..."
                spellCheck="false"
            />
        </div>
    );
};

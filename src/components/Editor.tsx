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
        <div className="flex-1 w-full h-full flex flex-col p-8 no-drag-region max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-semibold tracking-tight text-white/90 drop-shadow-sm">Script Editor</div>
                <button
                    onClick={() => setText('')}
                    className="text-sm px-3 py-1.5 rounded-md flex items-center gap-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
                    title="Clear Script"
                >
                    <Trash2 size={16} /> Clear All
                </button>
            </div>
            <div className="flex-1 w-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl group transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
                <textarea
                    className="absolute inset-0 w-full h-full bg-transparent text-white/90 p-6 resize-none focus:outline-none custom-scrollbar"
                    style={{
                        fontSize: `min(32px, ${Math.max(16, settings.fontSize * 0.6)}px)`,
                        lineHeight: '1.6',
                        fontWeight: 500,
                        letterSpacing: '-0.01em'
                    }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your script here..."
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

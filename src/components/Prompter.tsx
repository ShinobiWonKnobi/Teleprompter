import React, { useEffect, useRef } from 'react';
import { PrompterSettings } from '../types';

interface PrompterProps {
    text: string;
    settings: PrompterSettings;
    isPlaying: boolean;
}

export const Prompter: React.FC<PrompterProps> = ({ text, settings, isPlaying }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollPos = useRef(0);
    const animationRef = useRef<number>();

    useEffect(() => {
        // Reset scroll when text changes or when entering play mode if it was reset
        if (!isPlaying) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        let lastTime = performance.now();
        const scroll = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            // scrollSpeed is arbitrary. Let's say speed 1 = 10px per second. speed 5 = 50px/sec 
            // 60fps -> delta is ~16.6ms
            const pixelsPerMs = (settings.scrollSpeed * 10) / 1000;
            scrollPos.current += pixelsPerMs * delta;

            if (contentRef.current) {
                contentRef.current.style.transform = `translateY(-${scrollPos.current}px)`;
            }

            animationRef.current = requestAnimationFrame(scroll);
        };

        animationRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, settings.scrollSpeed]);

    return (
        <div
            className="flex-1 w-full overflow-hidden relative no-drag-region"
            ref={containerRef}
        >
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500/50 z-10 pointer-events-none" />
            <div
                ref={contentRef}
                className="w-full px-8 py-4 whitespace-pre-wrap flex flex-col items-center pt-[50vh]"
                style={{
                    fontSize: `${settings.fontSize}px`,
                    color: settings.textColor,
                    textAlign: 'center'
                }}
            >
                {text}
                {/* Padding at the bottom to allow scrolling completely off screen */}
                <div style={{ height: '50vh' }} />
            </div>
        </div>
    );
};

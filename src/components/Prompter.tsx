import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
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

    // Interaction State
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const lastMouseY = useRef<number>(0);
    const hoverTimeout = useRef<NodeJS.Timeout>();

    const handleMouseMove = useCallback(() => {
        setIsHovering(true);
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => {
            if (!isDragging) setIsHovering(false);
        }, 2500);
    }, [isDragging]);

    const handleMouseLeave = () => {
        if (!isDragging) setIsHovering(false);
    };

    // Auto Scrolling Engine
    useEffect(() => {
        if (!isPlaying || isDragging) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        let lastTime = performance.now();
        const scroll = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            // scrollSpeed 1-100 mapped to reasonable pixel velocity
            const pixelsPerMs = (settings.scrollSpeed * 5) / 1000;
            scrollPos.current += pixelsPerMs * delta;

            if (contentRef.current) {
                // Prevent scrolling back past the top
                if (scrollPos.current < 0) scrollPos.current = 0;
                contentRef.current.style.transform = `translateY(-${scrollPos.current}px)`;
            }

            animationRef.current = requestAnimationFrame(scroll);
        };

        animationRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, isDragging, settings.scrollSpeed]);

    // Manual Touchpad / Mouse Wheel Scroll
    const handleWheel = (e: React.WheelEvent) => {
        scrollPos.current += e.deltaY;
        if (scrollPos.current < 0) scrollPos.current = 0;

        if (contentRef.current) {
            contentRef.current.style.transform = `translateY(-${scrollPos.current}px)`;
        }
        handleMouseMove();
    };

    // Drag to Scroll
    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't drag if clicking the control bar
        if ((e.target as HTMLElement).closest('.prompter-controls')) return;
        setIsDragging(true);
        lastMouseY.current = e.clientY;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const delta = lastMouseY.current - e.clientY;
        lastMouseY.current = e.clientY;

        scrollPos.current += delta;
        if (scrollPos.current < 0) scrollPos.current = 0;

        if (contentRef.current) {
            contentRef.current.style.transform = `translateY(-${scrollPos.current}px)`;
        }
    }, [isDragging]);

    // Global listeners for dragging outside window
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleGlobalMouseMove]);

    // Control Bar Actions
    const resetScroll = () => {
        scrollPos.current = 0;
        if (contentRef.current) {
            contentRef.current.style.transition = 'transform 0.4s ease-out';
            contentRef.current.style.transform = `translateY(0px)`;

            // Remove transition after it's done so auto-scroll doesn't fight it
            setTimeout(() => {
                if (contentRef.current) contentRef.current.style.transition = '';
            }, 400);
        }
    };

    const dispatchSpeed = (dir: 'up' | 'down') => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: dir === 'up' ? 'ArrowUp' : 'ArrowDown' }));
    };

    const dispatchPlayPause = () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    };

    return (
        <div
            className={`flex-1 w-full h-full overflow-hidden relative no-drag-region flex justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
        >
            {/* Reading Guide Overlay */}
            {settings.showReadingGuide && (
                <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none z-0 flex flex-col justify-center opacity-80">
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                    <div className="absolute left-8 w-4 h-4 border-t-2 border-r-2 border-blue-500 rotate-45" />
                    <div className="absolute right-8 w-4 h-4 border-b-2 border-l-2 border-blue-500 rotate-45" />
                </div>
            )}

            {/* Main Text Content */}
            <div
                ref={contentRef}
                className="px-12 py-4 whitespace-pre-wrap flex flex-col items-center pt-[50vh] transition-colors duration-500 select-none"
                style={{
                    width: `${settings.textMargin}%`,
                    maxWidth: '1200px',
                    fontSize: `${settings.fontSize}px`,
                    color: settings.textColor,
                    textAlign: 'center',
                    lineHeight: '1.4',
                    textShadow: `0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.8)`,
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    willChange: 'transform' // Performance optimization
                }}
            >
                {text}
                <div style={{ height: '50vh' }} />
            </div>

            {/* Hover Control Bar */}
            <AnimatePresence>
                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 20, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="prompter-controls absolute bottom-8 right-8 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
                        onMouseEnter={() => setIsHovering(true)}
                    >
                        <button
                            onClick={resetScroll}
                            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
                            title="Reset to Top"
                        >
                            <RotateCcw size={16} />
                        </button>

                        <div className="w-px h-5 bg-white/20 mx-1" />

                        <button
                            onClick={() => dispatchSpeed('down')}
                            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
                            title="Slower"
                        >
                            <ChevronDown size={18} />
                        </button>

                        <div className="w-8 text-center text-white font-mono font-semibold text-sm">
                            {settings.scrollSpeed}
                        </div>

                        <button
                            onClick={() => dispatchSpeed('up')}
                            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
                            title="Faster"
                        >
                            <ChevronUp size={18} />
                        </button>

                        <div className="w-px h-5 bg-white/20 mx-1" />

                        <button
                            onClick={dispatchPlayPause}
                            className={`p-1.5 rounded-xl transition-all ${isPlaying ? 'bg-white/20 text-green-400' : 'hover:bg-white/20 text-white'}`}
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

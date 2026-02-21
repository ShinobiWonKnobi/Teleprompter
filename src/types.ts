export interface PrompterSettings {
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    backgroundOpacity: number;
    scrollSpeed: number;
    textMargin: number;
    showReadingGuide: boolean;
}

export type AppMode = 'edit' | 'prompt' | 'settings';

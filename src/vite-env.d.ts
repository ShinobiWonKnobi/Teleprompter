/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Window {
    ipcRenderer: {
        on: (channel: string, listener: (event: unknown, ...args: unknown[]) => void) => void;
        off: (channel: string, ...omit: unknown[]) => void;
        send: (channel: string, ...omit: unknown[]) => void;
        invoke: (channel: string, ...omit: unknown[]) => Promise<unknown>;
    };
}

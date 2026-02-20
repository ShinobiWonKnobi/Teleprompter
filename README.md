# Lightweight Desktop Teleprompter

A frameless, transparent, always-on-top desktop teleprompter built with Electron, React, and Tailwind CSS. The app sits perfectly over your camera and can be controlled via global keyboard shortcuts, even when it is not in focus (e.g. while on a Zoom call or using OBS).

## Features
- **Always-on-top & Frameless:** Floats over other windows seamlessly with a transparent background.
- **Smooth Scrolling Engine:** Uses `requestAnimationFrame` and CSS hardware acceleration for smooth text scrolling.
- **Global Keyboard Shortcuts:**
  - `Spacebar`: Play / Pause scrolling
  - `Up Arrow`: Increase scroll speed
  - `Down Arrow`: Decrease scroll speed
- **Customization:** Dedicated settings menu to adjust font size, colors, background opacity, and speeds.

## Development

Install dependencies:
```bash
npm install
```

Start the development server with live reload:
```bash
npm run dev
```

## Packaging for Local Use

To build an executable of the application to run natively on your machine:

1. Inside this directory, run the build script:
```bash
npm run build
```

2. Once the build completes, look in the `dist` or `release` output folder for your packaged application. Electron-builder handles creating the `.exe` (or `.app` on macOS).

*(Note: If you need to bundle for specific platforms, you can edit `electron-builder.json5` and run `npx electron-builder --win` or `--mac`.)*

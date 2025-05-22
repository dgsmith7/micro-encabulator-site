# Micro-Encabulator Interactive Experience

An immersive 3D product demonstration that adapts seamlessly across desktop, tablet, and mobile devices. The experience showcases the micro-encabulator through a combination of interactive 3D on desktop and optimized image sequences on touch devices.

## Features

### Desktop Experience

- Interactive 3D model with smooth camera animations
- Mouse wheel navigation between product features
- Dynamic SVG overlay lines connecting labels to model parts
- Precisely positioned information overlays
- High-performance WebGL rendering

### Mobile & Tablet Experience

- Progressive enhancement for touch devices
- Device and orientation-specific optimized image sequences
- Smooth crossfade transitions between views
- Touch-based navigation controls
- Responsive layout adapting to portrait/landscape modes

### Core Technical Features

- Synchronized fade transitions across all UI elements
- Dynamic positioning system for labels and overlays
- Adaptive loading strategy based on device capabilities
- Smooth animation system for camera movements
- Optimized asset loading for various device types

## Architecture

### Key Components

- `App.jsx`: Core application logic and state management
- `MicroEncabulatorModel`: 3D model handling and animations
- `SnapshotDisplay`: Mobile/tablet view management
- `SVGLines`: Dynamic overlay line system
- `ModelLabel`: Responsive label positioning system
- `TouchNavControls`: Touch device navigation

### Asset Organization

```
public/
├── snapshots/          # Device-specific image sequences
│   ├── mobile-l/      # Mobile landscape views
│   ├── mobile-p/      # Mobile portrait views
│   ├── tablet-l/      # Tablet landscape views
│   └── tablet-p/      # Tablet portrait views
├── scene.gltf         # 3D model for desktop
└── textures/          # Model textures
```

## Getting Started

```sh
git clone https://github.com/dgsmith7/micro-encabulator-site.git
cd micro-encabulator-site
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed (version 16 or higher recommended).

```sh
npm install
```

### 3. Run the Development Server

```sh
npm run dev
```

- By default, the app will be available at [http://localhost:5173](http://localhost:5173).

#### To Access from Another Device on Your Network

Start the server with:

```sh
npm run dev -- --host
```

Then, on another device on the same network, open a browser and go to:

```
http://YOUR_LOCAL_IP:5173
```

Replace `YOUR_LOCAL_IP` with your computer's local network IP address.

---

## License

This project is for demonstration purposes. See the `LICENSE` file for details.

# micro-encabulator-site

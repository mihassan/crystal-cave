![Crystal Cave Banner](./banner.jpg)

# Crystal Cave: Dragon's Lair 💎🐉

> **Survive the Heat. Master the Drift. Reclaim the Light.**

A procedurally generated, physics-based survival maze game built entirely in a single HTML file with no external dependencies.
*Made with ❤️ and pure JavaScript.*

## 🎮 Overview

**Crystal Cave: Dragon's Lair** is an infinite arcade survival game where players pilot a Frost Sentinel drone through a neon-soaked, shifting labyrinth. The goal is to collect energy shards, avoid phasing Fire Dragons, and locate the Warp Portal to descend deeper into the abyss.

The game features a unique **inertial drift movement system**, requiring players to master momentum rather than simple grid-based inputs.

## ✨ Key Features

- **🚀 Physics-Based Drift**: Custom movement engine with acceleration, friction, and wall-sliding collision response.
- **♾️ Procedural Generation**: Infinite levels generated using a Depth-First Search (DFS) maze algorithm. Maps grow in size and complexity as you progress.
- **🧠 Dynamic AI**: Dragons use a Finite State Machine (Spawn -> Idle -> Charge -> Attack -> Despawn) with telegraphing mechanics (warning cones) for fair but challenging combat.
- **🎧 Procedural Audio**: A custom `SoundEngine` class synthesizes all sound effects (echoing roars, musical chimes, ambient drones) in real-time using the Web Audio API. No MP3/WAV assets required.
- **💾 Persistence**: High scores, max levels, and best speedrun times are saved locally via `localStorage`.
- **🎨 2.5D Aesthetics**: Parallax dust particles, glowing bloom effects, and dynamic lighting create a sense of depth on a 2D canvas.
- **⌨️ Keyboard Support**: Arrow keys and WASD for desktop players.

## 🕹️ Controls

The game supports both **Touch/Mouse** and **Keyboard** input.

| Action | Touch/Mouse | Keyboard |
| :--- | :--- | :--- |
| **Move** | Click/Touch and drag anywhere | Arrow keys or WASD |
| **Stop** | Release to let friction take over | Release keys |
| **Pause** | Tap pause button | - |
| **Objective** | Follow the **Blue Chevron Arrow** to find the exit portal |

## 🎮 How to Play

### Option 1: Play Online (Cloudflare Workers)
The game is deployed as a Cloudflare Worker. Visit the deployed URL to play immediately.

### Option 2: Download Standalone HTML
1. Download or build `crystal_cave.html` (see Development section below)
2. Open it in any modern web browser (Chrome, Firefox, Edge, Safari)
3. Turn up your volume for the procedural audio experience

### Option 3: Run Locally with Wrangler
```bash
npm run dev  # Starts local development server
```

## 🛠️ Development

### Prerequisites
- Node.js (v16+)
- npm

### Project Structure
The project uses a modular architecture that builds into a single file:
```
src/
├── game/
│   ├── core/       # Constants, state management, game loop
│   ├── entities/   # Cell, Dragon, Particle classes
│   ├── systems/    # DataManager, MazeGenerator, Renderer, SoundEngine
│   ├── ui/         # HUD, QuirkyMessages, ScreenManager
│   └── utils/      # Helper functions
├── styles/         # CSS styles
├── templates/      # HTML template
├── game_html.js    # Bundled output (auto-generated)
└── index.js        # Cloudflare Worker entry point
build/
└── bundle-game.js  # Build script
scripts/
└── generate-standalone.js  # Standalone HTML generator
```

### Build Commands
- **`npm run build:bundle`**: Compiles modules into `src/game_html.js` (for Worker)
- **`npm run build:standalone`**: Generates `dist/crystal_cave.html` (for local play)
- **`npm run build`**: Runs both build steps
- **`npm run dev`**: Starts local Wrangler development server at http://localhost:8787

### Deployment
```bash
npm run deploy
```

## 🛠️ Technical Deep Dive

For developers interested in how this works under the hood, the game is built from ~2100 lines of modular JavaScript that bundles into a single HTML file (~61KB).

### 1. The Game Loop
The game uses a standard `requestAnimationFrame` loop. It separates logic into `update()` (physics, AI, collision) and `draw()` (rendering to HTML5 Canvas).

### 2. Architecture
- **SoundEngine Class**: A wrapper for the AudioContext graph. It routes oscillators through gain nodes and a stereo delay line to create the cave's "echo" atmosphere.
- **DataManager Class**: Handles serialization and deserialization of player stats to `localStorage`.
- **Dragon Entities**: Implements a simple AI state machine.
    - *Spawning*: Visual warning before hitbox activation.
    - *Idle*: Waits for player proximity.
    - *Charging*: Locks rotation and displays attack vector (Warning Cone).
    - *Attacking*: Instantiates Particle objects with velocity vectors.
- **generateMaze()**: Uses a recursive backtracker (DFS) to ensure a perfect maze (no loops, fully connected) is generated every level.

### 3. Rendering Tricks
- **Bloom**: Achieved by layering drawing operations with `shadowBlur` and `shadowColor` properties on the 2D context.
- **Parallax**: Dust particles are rendered in world space but wrap around the camera view, creating an infinite background effect without heavy resource usage.

## 🔒 Security & Quality Improvements

Recent improvements to ensure reliability and security:

- **Content Security Policy (CSP)**: Comprehensive security headers protect against XSS, clickjacking, and other injection attacks
- **Robust Error Handling**: Game loop error boundaries prevent crashes, localStorage operations handle quota exceeded gracefully
- **AudioContext Management**: Proper handling of browser autoplay policies with fallback mechanisms
- **Performance Optimizations**: Canvas rendering optimizations, particle array safety limits to prevent memory leaks
- **XSS Protection**: All dynamic content uses `.innerText` instead of `.innerHTML` for safe rendering

## 🔮 Future Roadmap

- [ ] **Power-ups**: Freeze bombs to temporarily disable dragons.
- [ ] **Biomes**: Different color palettes and enemy types for deeper levels (Ice, Void, Poison).
- [ ] **Leaderboards**: Online high-score integration.
- [ ] **Gamepad Support**: Adding the Gamepad API for controller input.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

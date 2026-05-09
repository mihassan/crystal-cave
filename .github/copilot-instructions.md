# Crystal Cave — Copilot Instructions

A roguelike dungeon crawler in React 19 (Vite, TypeScript, Tailwind v3), deployed to Cloudflare Workers as `crystal-cave`. E2E tested with Playwright.

## Commands

```sh
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # tsc + vite build → dist/
npm run preview  # Preview build locally
npm run test:e2e # Playwright end-to-end tests
npm run lint     # ESLint
```

Deployment:
```sh
npm run wrangler -- deploy   # Deploy to Cloudflare Workers
```

## Architecture

React renders a single `<canvas>` element. All game logic lives in `src/game/` and is fully decoupled from React — it never imports React types.

```
src/
  game/
    state.ts        Shared mutable state — the single store for all systems
    constants.ts    Single source of truth for all tuning values (speeds, sizes, etc.)
    systems/        Independent game systems (movement, combat, rendering, audio, etc.)
    entities/       Entity factory functions (player, monsters, items, tiles)
    utils/          Pure utilities (pathfinding, RNG, grid math)
  components/       React components (GameCanvas.tsx wraps the canvas; UI overlays)
  hooks/            React hooks that bridge game loop → React state for UI panels
  App.tsx           Entry; mounts canvas and HUD panels
```

## Key Conventions

- **`state.ts` is the hub.** All game systems read from and write to the shared state in `src/game/state.ts`. Never pass game state as React props between systems.
- **`constants.ts` is the tuning knob.** Change a number once here; it propagates everywhere. Do not hardcode magic numbers elsewhere.
- **Game logic is React-free.** Keep `src/game/` free of React imports. Hooks in `src/hooks/` are the bridge layer.
- **All audio is synthesised.** Web Audio API generates every sound at runtime — no `.mp3`/`.wav` files exist or should be added.
- **Tests are Playwright E2E** (`tests/`). Run `npm run test:e2e` before submitting changes to game logic.

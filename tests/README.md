# E2E Testing

## Setup
Playwright is already installed and configured.

## Running Tests

### Prerequisites
You need to have both dev and preview servers running:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start preview server  
npm run preview

# Terminal 3: Run tests
npm run test:e2e
```

### Test Commands

- `npm run test:e2e` - Run all tests headlessly
- `npm run test:e2e:ui` - Run tests in interactive UI mode
- `npm run test:e2e:debug` - Run tests in debug mode with Playwright Inspector

## Test Coverage

The test suite validates:
1. **Dev mode rendering** - Ensures entities (player, dragons, crystals) are visible
2. **Preview mode rendering** - Same validation for production build
3. **Home screen** - Verifies UI elements load correctly

## Screenshots

Test screenshots are saved to `tests/screenshots/`:
- `home-screen.png` - Landing page
- `dev-gameplay.png` - Dev mode game view
- `preview-gameplay.png` - Preview mode game view

## How Tests Work

Tests use canvas pixel analysis to verify content is rendered:
1. Count non-background pixels in canvas
2. Expect > 5000 pixels for walls + entities
3. Take screenshots for manual inspection

## Troubleshooting

If tests fail:
1. Check screenshots in `tests/screenshots/`
2. Ensure both servers are running
3. Run in UI mode: `npm run test:e2e:ui`

#!/usr/bin/env node

/**
 * Build script to bundle modular game files into single HTML
 * 
 * This script:
 * 1. Reads all modular JavaScript files from src/game/
 * 2. Strips 'export' keywords for inline inclusion
 * 3. Reads CSS from src/styles/game.css
 * 4. Reads HTML template from src/templates/game.html
 * 5. Combines everything into a single HTML string
 * 6. Exports as game_html.js for Cloudflare Worker
 * 
 * Usage: node build/bundle-game.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

console.log('🔨 Building Crystal Cave...\n');

// Define the order of JavaScript modules to include
// Order matters! Dependencies must come before their dependents
const jsModules = [
    // 1. Constants first (no dependencies)
    'game/core/constants.js',

    // 2. Utility classes and helpers
    'game/utils/helpers.js',
    'game/entities/Cell.js',
    'game/entities/Particle.js',
    'game/entities/Dragon.js',

    // 3. Core systems
    'game/systems/DataManager.js',
    'game/systems/SoundEngine.js',

    // 4. UI systems
    'game/ui/QuirkyMessages.js',

    // 5. Game systems
    'game/systems/MazeGenerator.js',
    'game/systems/Renderer.js',
    'game/ui/ScreenManager.js',
    'game/ui/HUD.js',

    // 6. Game state and loop (depends on everything else)
    'game/core/state.js',
    'game/core/game-loop.js',
];

/**
 * Read and process a JavaScript module
 * Strips export keywords for inline inclusion
 */
function readModule(modulePath) {
    const fullPath = path.join(srcDir, modulePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  Module not found: ${modulePath} (will be skipped)`);
        return null;
    }

    let code = fs.readFileSync(fullPath, 'utf-8');

    // Strip export keywords for inline bundling
    // This converts module exports to regular declarations
    code = code.replace(/^export\s+(const|let|var|class|function)/gm, '$1');
    code = code.replace(/^export\s+{[^}]+}/gm, '// exports removed');
    code = code.replace(/^export\s+default\s+/gm, '');

    // Strip import statements
    code = code.replace(/^import\s+.*from\s+['"].*['"];?/gm, '// import removed');

    return {
        path: modulePath,
        code: code.trim()
    };
}

// Read all JavaScript modules
console.log('📦 Reading JavaScript modules...');
const modules = jsModules
    .map(readModule)
    .filter(m => m !== null);

console.log(`   Loaded ${modules.length} modules`);

// Read CSS
console.log('\n🎨 Reading CSS...');
const cssPath = path.join(srcDir, 'styles', 'game.css');
const css = fs.existsSync(cssPath)
    ? fs.readFileSync(cssPath, 'utf-8')
    : '';
console.log(`   ${css.length} bytes`);

// Read HTML template
console.log('\n📄 Reading HTML template...');
const templatePath = path.join(srcDir, 'templates', 'game.html');
const template = fs.existsSync(templatePath)
    ? fs.readFileSync(templatePath, 'utf-8')
    : '';
console.log(`   ${template.length} bytes`);

// Combine JavaScript modules
const javascript = modules.map(m => {
    return `// ===== ${m.path} =====\n${m.code}`;
}).join('\n\n');

console.log(`\n📝 Combined JavaScript: ${javascript.length} bytes`);

// Inject CSS and JavaScript into HTML template
let html = template
    .replace('{{CSS}}', css)
    .replace('{{JAVASCRIPT}}', javascript);

console.log(`\n✨ Final HTML size: ${html.length} bytes (${(html.length / 1024).toFixed(2)} KB)`);

// Escape backticks for template literal
html = html.replace(/`/g, '\\`');
html = html.replace(/\${/g, '\\${');

// Write to game_html.js
const outputPath = path.join(srcDir, 'game_html.js');
const output = `export const html = \`${html}\`;\n`;

fs.writeFileSync(outputPath, output, 'utf-8');

console.log(`\n✅ Built successfully!`);
console.log(`   Output: src/game_html.js`);
console.log(`\n📊 Module breakdown:`);
modules.forEach(m => {
    const kb = (m.code.length / 1024).toFixed(2);
    console.log(`   ${m.path.padEnd(50)} ${kb.padStart(8)} KB`);
});

console.log(`\n🚀 Ready for deployment!`);

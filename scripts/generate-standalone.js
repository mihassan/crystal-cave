#!/usr/bin/env node

/**
 * Build script to generate standalone HTML file
 * Usage: node scripts/generate-standalone.js
 */

import { html } from '../src/game_html.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const outputFile = path.join(distDir, 'crystal_cave.html');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✓ Created dist/ directory');
}

// Write HTML file
try {
    fs.writeFileSync(outputFile, html, 'utf-8');
    const stats = fs.statSync(outputFile);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log('✓ Generated crystal_cave.html');
    console.log(`  Size: ${sizeKB} KB`);
    console.log(`  Location: ${outputFile}`);
    console.log('\nYou can now open this file in any web browser!');
} catch (error) {
    console.error('✗ Error generating standalone HTML:', error.message);
    process.exit(1);
}

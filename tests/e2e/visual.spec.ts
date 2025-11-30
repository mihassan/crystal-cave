import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
    test('entities render correctly', async ({ page }, testInfo) => {
        // Uses baseURL from playwright config for dev or preview
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 5000 });

        // Wait for game to initialize
        await page.waitForTimeout(1000);

        // Click Play button
        await page.click('button:has-text("Play")');
        await page.waitForTimeout(500);

        // Save screenshot for manual inspection
        const projectName = testInfo.project.name;
        await page.screenshot({
            path: `tests/screenshots/${projectName}-gameplay.png`,
            fullPage: false
        });

        // Verify canvas has rendered content
        const hasContent = await page.evaluate(() => {
            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
            if (!canvas) return false;

            const ctx = canvas.getContext('2d');
            if (!ctx) return false;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Count non-background pixels
            let nonBlackPixels = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                // Background is #050810 (5, 8, 16)
                if (r > 20 || g > 20 || b > 30) {
                    nonBlackPixels++;
                }
            }

            console.log(`Found ${nonBlackPixels} non-background pixels`);
            // Threshold: expect at least 5000 pixels (walls, player, entities)
            return nonBlackPixels > 5000;
        });

        expect(hasContent).toBe(true);
    });

    test('home screen displays correctly', async ({ page }, testInfo) => {
        await page.goto('/');
        await page.waitForSelector('canvas');

        // Check for title
        const title = await page.textContent('h1');
        expect(title).toContain('Crystal Cave');

        // Check for play button
        const playButton = await page.$('button:has-text("Play")');
        expect(playButton).toBeTruthy();

        const projectName = testInfo.project.name;
        await page.screenshot({
            path: `tests/screenshots/${projectName}-home-screen.png`
        });
    });
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    outputDir: 'tests/test-results',
    timeout: 30000,
    use: {
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        baseURL: 'http://localhost:5173',
    },
    projects: [
        {
            name: 'dev',
            use: { 
                ...devices['Desktop Chrome'],
                baseURL: 'http://localhost:5173',
            },
        },
        {
            name: 'preview',
            use: { 
                ...devices['Desktop Chrome'],
                baseURL: 'http://localhost:4173',
            },
        },
    ],
    /* Run your local dev server before starting the tests */
    webServer: [
        {
            command: 'npm run dev',
            url: 'http://localhost:5173',
            reuseExistingServer: true,
            timeout: 120 * 1000,
        },
        {
            command: 'npm run build && npx vite preview',
            url: 'http://localhost:4173',
            reuseExistingServer: true,
            timeout: 120 * 1000,
        },
    ],
});

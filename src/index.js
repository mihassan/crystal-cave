import { html } from './game_html.js';

export default {
    async fetch(request, env, ctx) {
        return new Response(html, {
            headers: {
                'content-type': 'text/html;charset=UTF-8',
                // Content Security Policy - Prevents XSS attacks
                'Content-Security-Policy': [
                    "default-src 'self'",
                    "script-src 'unsafe-inline' 'self'",  // Required for inline game script
                    "style-src 'unsafe-inline' 'self' https://fonts.googleapis.com",
                    "font-src https://fonts.gstatic.com",
                    "img-src 'self' data:",
                    "connect-src 'self'",
                    "frame-ancestors 'none'",  // Prevent embedding in iframes
                ].join('; '),
                // Prevent clickjacking
                'X-Frame-Options': 'DENY',
                // Prevent MIME-type sniffing
                'X-Content-Type-Options': 'nosniff',
                // Enable XSS protection in older browsers
                'X-XSS-Protection': '1; mode=block',
                // Control referrer information
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                // Permissions Policy (limit browser features)
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            },
        });
    },
};

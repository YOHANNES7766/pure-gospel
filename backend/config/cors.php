<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Adjust these settings to control which origins, methods, and headers
    | are allowed to access your Laravel API from the browser.
    |
    */

    // Your API routes and Sanctum cookie route
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    'allowed_methods' => ['*'],

    // Explicitly allow your Next.js dev URLs and optionally localhost
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        // Add your production front-end URL here when deploying:
        // 'https://your-production-domain.com',
    ],

    // No origin patterns used
    'allowed_origins_patterns' => [],

    // Accept any request headers
    'allowed_headers' => ['*'],

    // Expose additional headers to the browser (usually not needed)
    'exposed_headers' => [],

    // Cache preflight response duration (seconds)
    'max_age' => 0,

    // Whether to include cookies/authorization headers in cross-site requests
    'supports_credentials' => true,

];

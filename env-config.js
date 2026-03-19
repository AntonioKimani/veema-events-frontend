// frontend/env-config.js
// This file will be replaced by Netlify with actual environment variables

window.ENV = {
    // This will be replaced by Netlify during build
    BACKEND_URL: '{{ BACKEND_URL }}'  // Will become your actual backend URL
};

console.log('Environment loaded:', window.ENV);
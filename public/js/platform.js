// Use strict mode for better error handling
'use strict';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    init();
});

function init() {
    // Check for PWA support
    checkPWASupport();

    // Set up viewport height fix for mobile browsers
    setViewportHeight();

    displayProblems();
    showResults();
}

/**
 * Check for Progressive Web App support
 */
function checkPWASupport() {
    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported (but not implemented in this example)');
    }

    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is running in standalone mode');
    }

    // Check for install prompt
    window.addEventListener('beforeinstallprompt', (event) => {
        console.log('App can be installed');
        // Prevent the default prompt
        event.preventDefault();
        // Store the event for later use
        window.deferredPrompt = event;
    });

    // Log successful installation
    window.addEventListener('appinstalled', () => {
        console.log('App was installed successfully');
    });
}

/**
 * Fix viewport height for mobile browsers
 */
function setViewportHeight() {
    // Set CSS custom property for viewport height
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initial call
    setVH();

    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
}

/**
 * Handle errors gracefully
 */
window.addEventListener('error', (event) => {
    console.error('An error occurred:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

/**
 * Page Visibility API - optimize when page is not visible
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden - pausing animations');
        document.body.style.animationPlayState = 'paused';
    } else {
        console.log('Page is visible - resuming animations');
        document.body.style.animationPlayState = 'running';
    }
});

// This script helps handle base URLs for GitHub Pages and local development
function getBaseUrl() {
    // Check if we're on GitHub Pages
    if (window.location.hostname === 'rbrown1405.github.io') {
        return '/ZentryPOS';
    }
    // Local development or other hosting
    return '';
}

// Function to resolve paths relative to the base URL
function resolvePath(path) {
    const base = getBaseUrl();
    // Remove leading slash if present to avoid double slashes
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    return `${base}/${path}`;
}

// Navigate to a page using the base URL
function navigateTo(path) {
    window.location.href = resolvePath(path);
}

// Get a path to an asset using the base URL
function assetPath(path) {
    return resolvePath(path);
}

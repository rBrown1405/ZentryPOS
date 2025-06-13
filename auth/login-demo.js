// Simple login page script for GitHub Pages demo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    // Fix CSS paths for GitHub Pages
    fixCssPaths();
    
    // Tab switching functionality
    setupTabSwitching();
    
    // Set up login form handlers
    setupLoginFormHandlers();
    
    // Fix navigation buttons by replacing onclick handlers with event listeners
    fixNavigationButtons();
    
    // Add event listeners for the help and registration buttons
    document.getElementById('helpButton')?.addEventListener('click', function() {
        alert('Help functionality is not available in this demo.');
    });
    
    document.getElementById('registrationButton')?.addEventListener('click', function() {
        alert('Registration functionality is not available in this demo.');
    });
});

// Fix CSS paths for GitHub Pages
function fixCssPaths() {
    // Get all stylesheets
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    
    // If we're on GitHub Pages, update paths
    if (window.location.hostname === 'rbrown1405.github.io') {
        links.forEach(function(link) {
            if (link.getAttribute('href').startsWith('../')) {
                var newHref = link.getAttribute('href').replace('../', '/ZentryPOS/');
                link.setAttribute('href', newHref);
            }
        });
    }
}

// Setup tab switching functionality
function setupTabSwitching() {
    var tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length) {
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var text = this.textContent.toLowerCase();
                var tabName;
                if (text.includes('staff')) {
                    tabName = 'staff';
                } else if (text.includes('company')) {
                    tabName = 'company';
                } else if (text.includes('super') || text.includes('admin')) {
                    tabName = 'superadmin';
                } else {
                    tabName = 'staff'; // default
                }
                switchLoginTab(tabName);
            });
        });
    }
}

// Tab switching function
function switchLoginTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.login-tabs .tab-button').forEach(button => {
        button.classList.toggle('active', 
            button.textContent.toLowerCase().includes(tabName));
    });

    // Update tab content
    document.querySelectorAll('.login-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    var loginTabElement = document.getElementById(tabName + 'Login');
    if (loginTabElement) {
        loginTabElement.classList.add('active');
    }
}

// Setup login form handlers
function setupLoginFormHandlers() {
    // Staff login button
    var staffLoginBtn = document.querySelector('#staffLogin .login-button');
    if (staffLoginBtn) {
        staffLoginBtn.addEventListener('click', function() {
            alert('Staff login functionality is not available in this demo.');
        });
    }
    
    // Company login button
    var companyLoginBtn = document.querySelector('#companyLogin .login-button');
    if (companyLoginBtn) {
        companyLoginBtn.addEventListener('click', function() {
            alert('Company login functionality is not available in this demo.');
        });
    }
    
    // Super Admin login button
    var superAdminLoginBtn = document.querySelector('#superadminLogin .login-button');
    if (superAdminLoginBtn) {
        superAdminLoginBtn.addEventListener('click', function() {
            alert('Super Admin login functionality is not available in this demo.');
        });
    }
    
    // Need Help button
    var helpButton = document.querySelector('.help-button');
    if (helpButton) {
        helpButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Help functionality is not available in this demo.');
        });
    }
    
    // New Business / Staff Registration button
    var newUserButton = document.querySelector('.new-user-button');
    if (newUserButton) {
        newUserButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Registration functionality is not available in this demo.');
        });
    }
    
    // Register links
    var registerBtns = document.querySelectorAll('.register-link');
    registerBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Registration functionality is not available in this demo.');
        });
    });
}

// Fix navigation buttons by replacing onclick handlers with event listeners
function fixNavigationButtons() {
    // Replace all onclick handlers using navigateWithTransition
    document.querySelectorAll('[onclick*="navigateWithTransition"]').forEach(function(element) {
        const onclickAttr = element.getAttribute('onclick');
        if (onclickAttr) {
            // Extract the URL from the navigateWithTransition call
            const match = onclickAttr.match(/navigateWithTransition\(['"](.*?)['"]\)/);
            if (match && match[1]) {
                const url = match[1];
                // Remove the original onclick attribute
                element.removeAttribute('onclick');
                // Add a click event listener
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    navigateWithTransition(url);
                });
            }
        }
    });
}

// Navigation with transition effect
function navigateWithTransition(url) {
    console.log('Navigating to:', url);
    
    // For this demo, we'll just show an alert instead of actual navigation
    if (url === 'help.html') {
        alert('Help functionality is not available in this demo.');
    } else if (url === 'account-selection.html') {
        alert('Account registration functionality is not available in this demo.');
    } else {
        // If we're on GitHub Pages, handle the base URL
        if (typeof resolvePath === 'function') {
            window.location.href = resolvePath(url);
        } else {
            // Determine if we need to prepend a path for GitHub Pages
            let finalUrl = url;
            if (window.location.hostname === 'rbrown1405.github.io') {
                // If the URL doesn't already start with /ZentryPOS/, add it
                if (!url.startsWith('/ZentryPOS/')) {
                    // Handle relative paths properly
                    if (url.startsWith('../')) {
                        finalUrl = '/ZentryPOS/' + url.substring(3);
                    } else if (url.startsWith('./')) {
                        finalUrl = '/ZentryPOS/auth/' + url.substring(2);
                    } else {
                        finalUrl = '/ZentryPOS/auth/' + url;
                    }
                }
            }
            window.location.href = finalUrl;
        }
    }
}

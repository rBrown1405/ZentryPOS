/**
 * App Integration Module
 * Connects frontend components to backend API
 */
class AppIntegration {
    constructor() {
        this.apiManager = null;
        this.currentUser = null;
        this.initializeApiManager();
    }

    /**
     *        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            max-width: 400px;
        `;PI Manager with proper URL
     */
    initializeApiManager() {
        // Determine API URL based on environment
        let apiUrl = 'http://localhost:3000/api';
        
        if (window.location.hostname === 'rbrown1405.github.io') {
            // Production API URL - replace with your actual deployed API
            apiUrl = 'https://zentrypos-api.herokuapp.com/api';
        }
        
        this.apiManager = new ApiManager(apiUrl);
        
        // Load current user from localStorage or API
        this.loadCurrentUser();
    }

    /**
     * Load current user from storage or API
     */
    async loadCurrentUser() {
        try {
            // First check localStorage
            const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            
            if (storedUser && this.apiManager.isAuthenticated()) {
                this.currentUser = storedUser;
                return storedUser;
            }
            
            // If we have a token, fetch user from API
            if (this.apiManager.isAuthenticated()) {
                const user = await this.apiManager.getCurrentUser();
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                return user;
            }
            
            return null;
        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }

    /**
     * Authenticate user
     */
    async login(credentials, loginType = 'staff') {
        try {
            let response;
            
            switch (loginType) {
                case 'staff':
                    response = await this.apiManager.staffLogin(credentials.staffId);
                    break;
                case 'company':
                    response = await this.apiManager.login(credentials.email, credentials.password);
                    break;
                case 'superadmin':
                    response = await this.apiManager.superAdminLogin(credentials.adminKey);
                    break;
                default:
                    throw new Error('Invalid login type');
            }
            
            // Store user data
            this.currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.apiManager) {
                await this.apiManager.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local data
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Redirect to login
            this.redirectToLogin();
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.apiManager && this.apiManager.isAuthenticated() && this.currentUser;
    }

    /**
     * Get current user role
     */
    getUserRole() {
        return this.currentUser ? this.currentUser.role : null;
    }

    /**
     * Check if user has permission
     */
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const userRole = this.currentUser.role || this.currentUser.position || 'server';
        const permissions = this.getRolePermissions(userRole);
        
        return permissions.includes('all') || permissions.includes(permission);
    }

    /**
     * Get permissions for a role
     */
    getRolePermissions(role) {
        const PERMISSIONS = {
            'owner': ['all'],
            'manager': ['tables', 'menu', 'kitchen', 'orders', 'reports', 'settings'],
            'server': ['tables', 'menu', 'orders'],
            'cashier': ['menu', 'orders'],
            'kitchen': ['kitchen', 'orders']
        };
        
        return PERMISSIONS[role.toLowerCase()] || PERMISSIONS['server'];
    }

    /**
     * Fetch dashboard statistics
     */
    async getDashboardStats() {
        try {
            const [businesses, users] = await Promise.all([
                this.apiManager.getBusinesses(),
                this.apiManager.getUsers()
            ]);
            
            const pendingUsers = users.filter(user => user.status === 'pending');
            
            return {
                businessCount: businesses.length,
                staffCount: users.length,
                pendingCount: pendingUsers.length
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            
            // Fallback to localStorage data
            const businesses = JSON.parse(localStorage.getItem('businessRegistrations') || '[]');
            const staff = JSON.parse(localStorage.getItem('staffRegistrations') || '[]');
            const pendingStaff = staff.filter(s => s.status === 'pending');
            
            return {
                businessCount: businesses.length,
                staffCount: staff.length,
                pendingCount: pendingStaff.length
            };
        }
    }

    /**
     * Redirect to appropriate dashboard based on user role
     */
    redirectToDashboard() {
        if (!this.currentUser) {
            this.redirectToLogin();
            return;
        }
        
        const role = this.currentUser.role || this.currentUser.position || 'server';
        
        switch (role.toLowerCase()) {
            case 'owner':
            case 'manager':
                this.navigateTo('../admin/dashboard.html');
                break;
            case 'server':
            case 'cashier':
            case 'kitchen':
                this.navigateTo('../app/pos-interface.html');
                break;
            default:
                this.navigateTo('../app/pos-interface.html');
        }
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        this.navigateTo('auth/login.html');
    }

    /**
     * Navigation helper
     */
    navigateTo(url) {
        if (typeof resolvePath === 'function') {
            window.location.href = resolvePath(url);
        } else {
            let finalUrl = url;
            if (window.location.hostname === 'rbrown1405.github.io') {
                if (!url.startsWith('/ZentryPOS/') && !url.startsWith('http')) {
                    finalUrl = '/ZentryPOS/' + url;
                }
            }
            window.location.href = finalUrl;
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, type === 'error' ? 7000 : 5000);
    }
}

// Global instance
window.appIntegration = new AppIntegration();

/**
 * Global Login Handler Functions
 * These functions are called directly from HTML onclick handlers
 */

/**
 * Handle staff login
 */
async function handleStaffLogin() {
    try {
        const staffId = document.getElementById('staffId')?.value?.trim();
        
        if (!staffId) {
            window.appIntegration.showNotification('Please enter your Staff ID', 'error');
            return;
        }
        
        // Show loading state
        const button = document.getElementById('staffLoginButton');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="button-text">Signing In...</span>';
        button.disabled = true;
        
        try {
            const response = await window.appIntegration.login({ staffId }, 'staff');
            
            window.appIntegration.showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                window.appIntegration.redirectToDashboard();
            }, 1500);
            
        } catch (error) {
            console.error('Staff login error:', error);
            window.appIntegration.showNotification('Login failed. Please check your Staff ID.', 'error');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
        
    } catch (error) {
        console.error('Staff login handler error:', error);
        window.appIntegration.showNotification('An error occurred during login', 'error');
    }
}

/**
 * Handle company login
 */
async function handleCompanyLogin() {
    try {
        const businessId = document.getElementById('businessId')?.value?.trim();
        
        if (!businessId) {
            window.appIntegration.showNotification('Please enter your Business ID', 'error');
            return;
        }
        
        // Show loading state
        const button = document.getElementById('companyLoginButton');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="button-text">Signing In...</span>';
        button.disabled = true;
        
        try {
            const response = await window.appIntegration.login({ 
                email: businessId, 
                businessId 
            }, 'company');
            
            window.appIntegration.showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.appIntegration.navigateTo('../admin/dashboard.html');
            }, 1500);
            
        } catch (error) {
            console.error('Company login error:', error);
            window.appIntegration.showNotification('Login failed. Please check your Business ID.', 'error');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
        
    } catch (error) {
        console.error('Company login handler error:', error);
        window.appIntegration.showNotification('An error occurred during login', 'error');
    }
}

/**
 * Handle super admin login
 */
async function handleSuperAdminLogin() {
    try {
        const adminUsername = document.getElementById('adminUsername')?.value?.trim();
        const adminPassword = document.getElementById('adminPassword')?.value?.trim();
        
        if (!adminUsername || !adminPassword) {
            window.appIntegration.showNotification('Please enter both username and password', 'error');
            return;
        }
        
        // Show loading state
        const button = document.getElementById('superAdminLoginButton');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="button-text">Signing In...</span>';
        button.disabled = true;
        
        try {
            const response = await window.appIntegration.login({ 
                adminKey: adminUsername + ':' + adminPassword,
                username: adminUsername,
                password: adminPassword 
            }, 'superadmin');
            
            window.appIntegration.showNotification('Super Admin login successful! Redirecting...', 'success');
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.appIntegration.navigateTo('../admin/dashboard.html');
            }, 1500);
            
        } catch (error) {
            console.error('Super admin login error:', error);
            window.appIntegration.showNotification('Super Admin login failed. Please check your credentials.', 'error');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
        
    } catch (error) {
        console.error('Super admin login handler error:', error);
        window.appIntegration.showNotification('An error occurred during login', 'error');
    }
}

/**
 * Handle help button click
 */
function handleHelpClick() {
    try {
        // For now, show a simple alert. In production, you'd navigate to a help page
        if (window.appIntegration) {
            window.appIntegration.showNotification('Help system coming soon! Contact your administrator for assistance.', 'info');
        } else {
            alert('Help system coming soon! Contact your administrator for assistance.');
        }
    } catch (error) {
        console.error('Help click error:', error);
        alert('Help system temporarily unavailable.');
    }
}

/**
 * Handle registration button click
 */
function handleRegistrationClick() {
    try {
        // Navigate to account selection page
        if (window.appIntegration && typeof window.appIntegration.navigateTo === 'function') {
            window.appIntegration.navigateTo('auth/account-selection-working.html');
        } else {
            // Fallback navigation
            let baseUrl = '';
            if (window.location.hostname === 'rbrown1405.github.io') {
                baseUrl = '/ZentryPOS';
            }
            window.location.href = baseUrl + '/auth/account-selection-working.html';
        }
    } catch (error) {
        console.error('Registration click error:', error);
        if (window.appIntegration) {
            window.appIntegration.showNotification('Registration page temporarily unavailable.', 'error');
        } else {
            alert('Registration page temporarily unavailable.');
        }
    }
}

/**
 * Switch between login tabs
 */
function switchLoginTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.login-tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const targetTab = document.getElementById(tabName + 'Login');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activate corresponding tab button
    const tabButton = Array.from(tabButtons).find(button => {
        const text = button.textContent.toLowerCase();
        return text.includes(tabName) || 
               (tabName === 'superadmin' && (text.includes('super') || text.includes('admin')));
    });
    
    if (tabButton) {
        tabButton.classList.add('active');
    }
}

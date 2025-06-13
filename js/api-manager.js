/**
 * API Manager - Handles all backend communication
 * Provides centralized API management for the Zentry POS system
 */
class ApiManager {
    constructor(baseUrl = 'http://localhost:3000/api') {
        this.baseUrl = baseUrl;
        this.authToken = localStorage.getItem('authToken');
        this.refreshToken = localStorage.getItem('refreshToken');
        
        // Set up automatic token refresh
        this.setupTokenRefresh();
    }

    /**
     * Set up automatic token refresh
     */
    setupTokenRefresh() {
        // Refresh token every 45 minutes (tokens expire after 1 hour)
        setInterval(() => {
            this.refreshAuthToken();
        }, 45 * 60 * 1000);
    }

    /**
     * Make authenticated API request
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Add auth token if available
        if (this.authToken) {
            defaultOptions.headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, requestOptions);
            
            // Handle token expiration
            if (response.status === 401) {
                const refreshed = await this.refreshAuthToken();
                if (refreshed) {
                    // Retry the request with new token
                    requestOptions.headers['Authorization'] = `Bearer ${this.authToken}`;
                    return await fetch(url, requestOptions);
                } else {
                    // Refresh failed, redirect to login
                    this.logout();
                    return null;
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Authentication methods
     */
    async login(credentials) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            if (response && response.token) {
                this.setAuthToken(response.token, response.refreshToken);
                return response;
            }

            throw new Error('Login failed');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async refreshAuthToken() {
        if (!this.refreshToken) {
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: this.refreshToken,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                this.setAuthToken(data.token, data.refreshToken);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    setAuthToken(token, refreshToken = null) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
        
        if (refreshToken) {
            this.refreshToken = refreshToken;
            localStorage.setItem('refreshToken', refreshToken);
        }
    }

    logout() {
        this.authToken = null;
        this.refreshToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        
        // Redirect to login
        window.location.href = '/auth/login.html';
    }

    isAuthenticated() {
        return !!this.authToken;
    }

    /**
     * User management methods
     */
    async getCurrentUser() {
        return await this.makeRequest('/auth/me');
    }

    async updateUser(userId, userData) {
        return await this.makeRequest(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    /**
     * Business management methods
     */
    async getBusinesses() {
        return await this.makeRequest('/businesses');
    }

    async getBusiness(businessId) {
        return await this.makeRequest(`/businesses/${businessId}`);
    }

    async createBusiness(businessData) {
        return await this.makeRequest('/businesses', {
            method: 'POST',
            body: JSON.stringify(businessData),
        });
    }

    async updateBusiness(businessId, businessData) {
        return await this.makeRequest(`/businesses/${businessId}`, {
            method: 'PUT',
            body: JSON.stringify(businessData),
        });
    }

    /**
     * Property management methods
     */
    async getProperties(businessId) {
        return await this.makeRequest(`/businesses/${businessId}/properties`);
    }

    async getProperty(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}`);
    }

    async createProperty(businessId, propertyData) {
        return await this.makeRequest(`/businesses/${businessId}/properties`, {
            method: 'POST',
            body: JSON.stringify(propertyData),
        });
    }

    async updateProperty(propertyId, propertyData) {
        return await this.makeRequest(`/properties/${propertyId}`, {
            method: 'PUT',
            body: JSON.stringify(propertyData),
        });
    }

    /**
     * Staff management methods
     */
    async getStaff(businessId) {
        return await this.makeRequest(`/businesses/${businessId}/staff`);
    }

    async createStaff(businessId, staffData) {
        return await this.makeRequest(`/businesses/${businessId}/staff`, {
            method: 'POST',
            body: JSON.stringify(staffData),
        });
    }

    async updateStaff(staffId, staffData) {
        return await this.makeRequest(`/staff/${staffId}`, {
            method: 'PUT',
            body: JSON.stringify(staffData),
        });
    }

    async deleteStaff(staffId) {
        return await this.makeRequest(`/staff/${staffId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Menu management methods
     */
    async getMenu(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}/menu`);
    }

    async updateMenu(propertyId, menuData) {
        return await this.makeRequest(`/properties/${propertyId}/menu`, {
            method: 'PUT',
            body: JSON.stringify(menuData),
        });
    }

    async createMenuItem(propertyId, itemData) {
        return await this.makeRequest(`/properties/${propertyId}/menu/items`, {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    }

    async updateMenuItem(itemId, itemData) {
        return await this.makeRequest(`/menu/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(itemData),
        });
    }

    async deleteMenuItem(itemId) {
        return await this.makeRequest(`/menu/items/${itemId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Order management methods
     */
    async createOrder(propertyId, orderData) {
        return await this.makeRequest(`/properties/${propertyId}/orders`, {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getOrders(propertyId, filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/properties/${propertyId}/orders${queryParams ? `?${queryParams}` : ''}`;
        return await this.makeRequest(endpoint);
    }

    async getOrder(orderId) {
        return await this.makeRequest(`/orders/${orderId}`);
    }

    async updateOrder(orderId, orderData) {
        return await this.makeRequest(`/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify(orderData),
        });
    }

    /**
     * Analytics and reporting methods
     */
    async getAnalytics(propertyId, timeframe = 'daily') {
        return await this.makeRequest(`/properties/${propertyId}/analytics?timeframe=${timeframe}`);
    }

    async getSalesReport(propertyId, startDate, endDate) {
        return await this.makeRequest(`/properties/${propertyId}/reports/sales?start=${startDate}&end=${endDate}`);
    }

    async getInventoryReport(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}/reports/inventory`);
    }

    /**
     * Table management methods
     */
    async getTables(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}/tables`);
    }

    async updateTables(propertyId, tablesData) {
        return await this.makeRequest(`/properties/${propertyId}/tables`, {
            method: 'PUT',
            body: JSON.stringify(tablesData),
        });
    }

    async updateTableStatus(tableId, status) {
        return await this.makeRequest(`/tables/${tableId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    /**
     * Real-time communication setup
     */
    setupWebSocket(propertyId) {
        if (this.ws) {
            this.ws.close();
        }

        const wsUrl = this.baseUrl.replace(/^http/, 'ws').replace('/api', '/ws');
        this.ws = new WebSocket(`${wsUrl}?token=${this.authToken}&property=${propertyId}`);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                if (this.isAuthenticated()) {
                    this.setupWebSocket(propertyId);
                }
            }, 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleWebSocketMessage(data) {
        // Emit custom events for different message types
        const event = new CustomEvent('posUpdate', {
            detail: data
        });
        window.dispatchEvent(event);
    }

    /**
     * Utility methods
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            return response.ok;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }

    getBaseUrl() {
        return this.baseUrl;
    }

    setBaseUrl(url) {
        this.baseUrl = url;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiManager;
} else if (typeof window !== 'undefined') {
    window.ApiManager = ApiManager;
}

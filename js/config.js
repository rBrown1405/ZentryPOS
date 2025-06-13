/**
 * Zentry POS System Configuration
 * 
 * This file contains configuration settings for the POS frontend.
 * Update these values to match your deployment environment.
 */

const CONFIG = {
  // API Configuration
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000, // milliseconds
    retryAttempts: 3
  },
  
  // Storage Configuration
  storage: {
    prefix: 'zentry_pos_',
    useLocalStorage: true,
    useCookies: false
  },
  
  // UI Configuration
  ui: {
    theme: 'default',
    animationsEnabled: true,
    showDebugInfo: false,
    defaultView: 'menu'
  },
  
  // Feature Flags
  features: {
    roomService: true,
    tableManagement: true,
    onlinePayments: false,
    customerLoyalty: false,
    analyticsEnabled: true
  },
  
  // Default Settings
  defaults: {
    currency: 'USD',
    taxRate: 0.085,
    tipPresets: [0.15, 0.18, 0.20, 0.25],
    language: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  }
};

// Freeze the config object to prevent modifications
Object.freeze(CONFIG);

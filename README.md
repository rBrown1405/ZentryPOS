# Zentry POS System

## Overview
Zentry POS is a comprehensive Point of Sale system designed for restaurants, hotels, and retail businesses. The system supports multiple properties, menu management, table management, and integrated payment processing.

## System Architecture

The Zentry POS system is organized into the following components:

### Frontend Components
- `/app` - Main application interfaces
- `/admin` - Administration and management interfaces
- `/auth` - Authentication and user management
- `/js` - JavaScript libraries and utilities
  - `/js/lib` - Core libraries
  - `/js/utils` - Utility functions
  - `/js/auth` - Authentication scripts
  - `/js/admin` - Admin-specific scripts
- `/styles` - CSS stylesheets
- `/assets` - Images, icons, and other static resources

### Backend Components
- `/api` - Backend API and database services

### Documentation and Support
- `/docs` - Documentation and guides
- `/test` - Testing utilities and examples

## Installation

1. Clone this repository
2. Configure your web server to serve from the root directory
3. Set up the backend API by following the instructions in `/api/README.md`

## Configuration

Edit the configuration files in `/api/config` to set up your database and system settings.

## Getting Started

1. Navigate to `index.html` in your browser
2. Log in with the default super admin credentials (see `/docs/SUPER_ADMIN_GUIDE.md`)
3. Set up your business properties and menu items

## License

Copyright (c) 2025 Zentry Systems. All rights reserved.

# Zentry POS API Documentation

## Overview

The Zentry POS API provides the backend services for the POS system, including user authentication, business management, property management, and menu storage.

## API Structure

- `/src/server.js` - Main entry point for the API server
- `/src/config` - Configuration files for database and authentication
- `/src/controllers` - Controller logic for handling API requests
- `/src/middleware` - Middleware for authentication, validation, and security
- `/src/models` - Database models for MongoDB
- `/src/routes` - API route definitions
- `/src/utils` - Utility functions for the API

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify authentication token

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Businesses
- `GET /api/businesses` - Get all businesses (admin only)
- `POST /api/businesses` - Create a new business
- `GET /api/businesses/:id` - Get business by ID
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business (admin only)

### Properties
- `GET /api/properties` - Get all properties for a business
- `POST /api/properties` - Create a new property
- `GET /api/properties/:id` - Get property by ID
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/:id/menu` - Get property menu
- `POST /api/properties/:id/menu` - Update property menu

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. Include the token in the Authorization header as a Bearer token.

```
Authorization: Bearer <token>
```

## Error Handling

API errors follow a standard format:

```json
{
  "error": true,
  "message": "Error message description",
  "code": 400
}
```

## Setup Instructions

1. Install dependencies with `npm install`
2. Configure the database in `/src/config/db.js`
3. Start the server with `npm start`
4. For development, use `npm run dev` to run with nodemon

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/zentrypos
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
```

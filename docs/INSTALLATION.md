# Zentry POS Installation Guide

This guide will walk you through the process of installing and configuring the Zentry POS system.

## System Requirements

- Web server (Apache, Nginx, etc.)
- Node.js 16.x or higher
- MongoDB 5.x or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Frontend Installation

1. Copy all files to your web server's document root
2. Configure your web server to serve the files
3. Update the API endpoint in `js/app.js` if needed

## Backend Installation

1. Navigate to the `/api` directory
2. Run `npm install` to install dependencies
3. Create a `.env` file with the required environment variables (see below)
4. Run `npm start` to start the API server

## Environment Configuration

Create a `.env` file in the `/api` directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/zentrypos
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=24h
NODE_ENV=production
```

## Initial Setup

1. Access the system at `http://your-server/index.html`
2. Log in with the default super admin credentials:
   - Email: admin@zentrypos.com
   - Password: admin123
3. Change the default password immediately after logging in
4. Create your business profile
5. Set up properties, users, and menus

## Security Recommendations

1. Enable HTTPS on your web server
2. Change the JWT_SECRET to a strong, unique value
3. Set up proper MongoDB authentication
4. Configure regular database backups

## Troubleshooting

If you encounter issues:

1. Check the server logs
2. Verify MongoDB connection
3. Ensure all files are properly copied
4. Check browser console for JavaScript errors

## Support

For additional support, contact support@zentrypos.com or refer to our online documentation at https://docs.zentrypos.com

# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the Server directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017

# JWT Configuration (MUST be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# ImageKit Configuration (if using)
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
```

## Security Notes

1. **JWT_SECRET**: Must be at least 32 characters long and should be a random string
2. **MONGODB_URI**: Should use a secure connection string in production
3. **NODE_ENV**: Set to 'production' for production deployments
4. **FRONTEND_URL**: Should match your frontend domain in production

## Production Checklist

- [ ] All required environment variables are set
- [ ] JWT_SECRET is at least 32 characters and random
- [ ] MONGODB_URI uses secure connection
- [ ] NODE_ENV is set to 'production'
- [ ] FRONTEND_URL matches production domain
- [ ] ImageKit credentials are configured (if using image uploads)
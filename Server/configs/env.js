import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variable validation
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT'
];

const optionalEnvVars = [
    'FRONTEND_URL',
    'NODE_ENV'
];

// Validate required environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
}

// Validate JWT_SECRET strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long for security.');
    process.exit(1);
}

// Validate MongoDB URI format
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ MONGODB_URI must start with mongodb:// or mongodb+srv://');
    process.exit(1);
}

// Set default values for optional variables
const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 4000,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
};

// Log configuration (without sensitive data)
console.log('✅ Environment configuration loaded successfully');
console.log(`   - NODE_ENV: ${config.NODE_ENV}`);
console.log(`   - PORT: ${config.PORT}`);
console.log(`   - FRONTEND_URL: ${config.FRONTEND_URL}`);
console.log(`   - MONGODB_URI: ${config.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`   - JWT_SECRET: ${config.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);

export default config;
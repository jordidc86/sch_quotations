// server.js (Root entry point for Hostinger)
const path = require('path');

// Set environment to production
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = '0.0.0.0';

// Import and start the standalone server
// Using relative path to the standalone server
require('./.next/standalone/server.js');

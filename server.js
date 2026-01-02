// server.js (Root entry point for Hostinger)
const path = require('path');

// Port is provided by Hostinger environment or default to 3000
const port = process.env.PORT || 3000;

// Set environment to production
process.env.NODE_ENV = 'production';

// Import and start the standalone server
// We use the absolute path to ensure it finds everything correctly
require(path.join(__dirname, '.next/standalone/server.js'));

const path = require('path');
const dotenv = require('dotenv');  // Ensure dotenv is required

// ***ABSOLUTELY CRUCIAL TEST BLOCK - START***
try {
    dotenv.config({ path: path.join(__dirname, 'backend', 'config', 'config.env') });
    console.log("Testing MONGODB_URI:", process.env.MONGODB_URI);  // **NOTE:** Clear and direct log
} catch (error) {
    console.error("Error loading .env file:", error); // Log the error if any.
}
// ***ABSOLUTELY CRUCIAL TEST BLOCK - END***
const cors = require("cors");
app.use(cors());

const express = require('express');
const cloudinary = require('cloudinary');
const app = require('./backend/app');
const connectDatabase = require('./backend/config/database');
const PORT = process.env.PORT || 4000;

dotenv.config({path: path.join(__dirname, 'backend','config', 'config.env')});
console.log("Database ka pata:", process.env.MONGODB_URI);

// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down server due to Uncaught Exception");
    process.exit(1);
});

// Connect to database
connectDatabase();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Deployment Logic
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down server due to Unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});
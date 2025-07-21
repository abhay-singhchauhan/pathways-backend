"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
// Load environment variables
dotenv_1.default.config();
// Create Express application
const app = (0, express_1.default)();
// Get port from environment or default to 3000
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)()); // Enable CORS
app.use(express_1.default.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL encoded bodies
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api', routes_1.default);
// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Pathways Backend API',
        version: '1.0.0',
        documentation: '/api/health'
    });
});
// Error handling middleware (must be last)
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
// Start server
const server = app.listen(PORT, () => {
    console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}
  📊 Health check: http://localhost:${PORT}/api/health
  📖 Base API: http://localhost:${PORT}/api
  `);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map
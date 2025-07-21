"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathways_db';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};
// Handle connection events
mongoose_1.default.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});
exports.default = connectDB;
//# sourceMappingURL=database.js.map
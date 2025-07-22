"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = void 0;
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:8080';
const client = new google_auth_library_1.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        console.log('hi');
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        const user = await user_model_1.default.findOne({ email: email });
        if (!user) {
            console.log('use does not exist', payload);
            const newUser = new user_model_1.default({ email: email, firstName: payload?.given_name, lastName: payload?.family_name, profileUrl: payload?.picture });
            await newUser.save();
            const token = (0, jwt_1.generateToken)(newUser);
            res.status(200).json({
                success: true,
                message: 'User registered successfully',
                data: { user: newUser, token }
            });
        }
        else {
            const token = (0, jwt_1.generateToken)(user);
            res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                data: { user: user, token }
            });
        }
    }
    catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.googleAuth = googleAuth;
//# sourceMappingURL=auth.controller.js.map
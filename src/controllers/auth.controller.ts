import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:8080';
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);





export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
     const { idToken } = req.body;
     console.log('hi')
     const ticket = await client.verifyIdToken({
              idToken: idToken,
              audience: CLIENT_ID
          });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const user = await User.findOne({ email: email });

      if (!user) {
        console.log('use does not exist', payload)
        const newUser = new User({ email: email, firstName: payload?.given_name, lastName: payload?.family_name || '', profileUrl: payload?.picture });
        await newUser.save();
        const token = generateToken(newUser);
        res.status(200).json({
          success: true,
          message: 'User registered successfully',
          data: { user: newUser, token }
        });
      }else{
        const token = generateToken(user);
        res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          data: { user: user, token }
        });
      }

    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
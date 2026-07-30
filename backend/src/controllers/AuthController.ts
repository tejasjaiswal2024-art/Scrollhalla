import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'scrollhalla_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

export class AuthController {
  /**
   * User Registration Endpoint
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, uiSettings } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ success: false, message: 'User with this email already exists.' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user in PostgreSQL via Prisma
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          uiSettings: uiSettings || { theme: 'dark', density: 'compact' }
        }
      });

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          uiSettings: user.uiSettings,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.error('[AuthController.register Error]', error);
      res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
    }
  };

  /**
   * User Login Endpoint
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      // Verify hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          email: user.email,
          uiSettings: user.uiSettings,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.error('[AuthController.login Error]', error);
      res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
    }
  };

  /**
   * Protected Profile Endpoint
   */
  public getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          uiSettings: true,
          createdAt: true,
          subscriptions: {
            select: { id: true, title: true, feedUrl: true, createdAt: true }
          },
          bookmarks: {
            select: { id: true, articleId: true, createdAt: true }
          }
        }
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch user profile.', error: error.message });
    }
  };
}

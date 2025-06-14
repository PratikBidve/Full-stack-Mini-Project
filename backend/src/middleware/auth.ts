import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest) => {
  try {
    console.log('Full request headers:', JSON.stringify(req.headers, null, 2));
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      console.log('No authorization header');
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);
    
    if (!token) {
      console.log('No token found');
      return null;
    }

    try {
      console.log('JWT_SECRET:', JWT_SECRET);
      console.log('Attempting to verify token...');
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      console.log('Successfully decoded token:', decoded);
      
      if (!decoded.id) {
        console.log('No user ID in decoded token');
        return null;
      }

      console.log('Looking up user with ID:', decoded.id);
      const user = await User.findById(decoded.id);
      console.log('Found user:', user ? { id: user._id, email: user.email, role: user.role } : null);

      if (!user) {
        console.log('User not found in database');
        return null;
      }

      console.log('Authentication successful for user:', { id: user._id, email: user.email, role: user.role });
      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        console.error('JWT Error:', error.message);
        console.error('JWT Error name:', error.name);
      } else if (error instanceof jwt.TokenExpiredError) {
        console.error('Token Expired:', error.message);
        console.error('Token Expired at:', error.expiredAt);
      }
      return null;
    }
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export const generateToken = (user: any): string => {
  console.log('Generating token for user:', { id: user._id, email: user.email, role: user.role });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d'
  });
  console.log('Generated token:', token);
  return token;
};

export const requireAuth = async (req: AuthRequest) => {
  console.log('requireAuth called');
  const user = await auth(req);
  
  if (!user) {
    console.log('requireAuth: No user found');
    throw new Error('Not authenticated');
  }

  return user;
};

export const requireAdmin = async (req: AuthRequest) => {
  console.log('requireAdmin called');
  const user = await requireAuth(req);
  
  if (user.role !== 'ADMIN') {
    console.log('requireAdmin: User is not admin');
    throw new Error('Not authorized');
  }

  return user;
}; 
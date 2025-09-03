import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

/**
 * Express middleware to check if the user is authenticated via JWT.
 *
 * - Expects the JWT in the 'Authorization' header as 'Bearer <token>'.
 * - Attaches the user object ({ id, role }) to req.user if valid.
 * - Responds with 401 if token is missing or invalid.
 * - Responds with 500 if TOKEN_SECRET is not set.
 *
 * Usage:
 *   app.use(authenticate);
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!config.jwt.secret) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, config.jwt.secret, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }        
        (req as any).user = { id: (payload as any)._id, role: (payload as any).role };
        next();
    });
};

/**
 * Express middleware to check if the authenticated user has a required role.
 *
 * @param role - The required user role (e.g., 'admin', 'editor').
 * Usage:
 *   app.use(requireRole('admin'));
 *   app.use(requireRole('editor'));
 */
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user?.role === role) {
      next();
    } else {
      res.status(403).json({ message: `${role} access required` });
    }
  };
}
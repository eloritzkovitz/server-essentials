import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to check if the user is authenticated
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }        
        (req as any).user = { id: (payload as any)._id, role: (payload as any).role };
        next();
    });
};

// Middleware to check if the user is an admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user?.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};
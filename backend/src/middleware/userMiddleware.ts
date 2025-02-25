import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../auth';
import { UserModel } from '../models';

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
    const decoded: any = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in userMiddleware', error);
    return res
      .status(500)
      .json({ message: 'Failed to authenticate user', error });
  }
};

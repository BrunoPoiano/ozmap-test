import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { User, UserModel } from '../models';
import { loggedUser } from '../controllers/userController';

export const userValidator = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  await Promise.all([
    body('name').notEmpty().withMessage('Name is required').isString().run(req),
    body('address').optional().isString().run(req),
    body('password')
      .custom(async (value: string) => {
        if (req.method === 'POST' && value === undefined) {
          throw new Error('Password is required');
        }
        if (value && value.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        return true;
      })
      .run(req),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .custom(async (value: string) => {
        const user = await UserModel.findOne({ email: value });
        if (!user) {
          return true;
        }
        if (req.method === 'POST') {
          throw new Error('Email already exists');
        }
        if (req?.user?._id !== user._id) {
          throw new Error('Email already exists');
        }
        return true;
      })
      .run(req),
    body('coordinates')
      .optional()
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of two elements')
      .custom((value: unknown[]) => {
        if (typeof value[0] !== 'number' || typeof value[1] !== 'number') {
          throw new Error('Coordinates must be an array of two numbers');
        }
        return true;
      })
      .run(req),
  ]);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).json({ message:"Error in userValidator", errors: errors.array() });
  }

  return next();
};

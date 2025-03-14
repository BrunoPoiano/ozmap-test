import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models';
import { loggedUser } from '../controllers/userController';

export const loginValidator = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  await Promise.all([
    body('password')
      .isString()
      .notEmpty()
      .withMessage('Password is required')
      .run(req),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .run(req),
  ]);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp
      .status(400)
      .json({ message: 'Error in loginValidator', errors: errors.array() });
  }

  return next();
};

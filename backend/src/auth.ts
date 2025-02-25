const dotenv = require('dotenv');
dotenv.config();

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './models';

export const jwtConfig = {
  secret: String(process.env.JWT_SECRET),
  expiresIn: 86400,
};

export const passwordCompare = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const generateToken = (user: User) => {
  return jwt.sign(
    { id: user._id, email: user.email, password: user.password },
    jwtConfig.secret as string,
    { expiresIn: jwtConfig.expiresIn }
  );
};

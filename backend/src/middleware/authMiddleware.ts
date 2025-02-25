import { expressjwt } from 'express-jwt';
import { jwtConfig } from '../auth';

export const authMiddleware = expressjwt({
  secret: jwtConfig.secret,
  algorithms: ['HS256'],
  requestProperty: 'user',
}).unless({
  path: [
    '/api/auth/login',
    '/api/auth/register',
    { url: /\/public\/.*/, methods: ['GET'] },
  ],
});

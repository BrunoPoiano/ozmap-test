import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const regionValidator = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  await Promise.all([
    body('name').notEmpty().withMessage('Name is required').isString().run(req),
    body('coordinates')
      .notEmpty()
      .withMessage('coordinates is required')
      .isArray({ min: 1, max: 1 })
      .withMessage('Coordinates must be an array')
      .custom((value: unknown[]) => {
        const polygon = value[0];
        if (!Array.isArray(polygon) || polygon.length < 4) {
          throw new Error(
            'Each polygon must contain at least 4 coordinate pairs'
          );
        }
        for (const point of polygon) {
          if (typeof point[0] !== 'number' || typeof point[1] !== 'number') {
            throw new Error('Coordinates must be an array of numbers');
          }
        }
        return true;
      })
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).json({ message:"Error in regionValidator", errors: errors.array() });
  }
  return next();
};

export const regionFindValidator = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  await Promise.all([
    body('latitude')
      .notEmpty()
      .withMessage('latitude is required')
      .isNumeric()
      .withMessage('latitude must be a number')
      .run(req.query),
    body('longitude')
      .notEmpty()
      .withMessage('longitude is required')
      .isNumeric()
      .withMessage('longitude must be a number')
      .run(req.query),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).json({ message: "Error in regionFindValidator", errors: errors.array() });
  }
  return next();
};

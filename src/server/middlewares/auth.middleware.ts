import { timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';
import { loadEnvironment } from '../../config/env.js';

export const requireAdmin: RequestHandler = (req, res, next) => {
  const received = req.header('x-api-key') ?? '';
  const expected = loadEnvironment().ADMIN_API_KEY;
  const first = Buffer.from(received);
  const second = Buffer.from(expected);
  if (first.length !== second.length || !timingSafeEqual(first, second)) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'API key inválida' } });
    return;
  }
  next();
};

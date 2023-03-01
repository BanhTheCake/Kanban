import { CookieOptions } from 'express';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

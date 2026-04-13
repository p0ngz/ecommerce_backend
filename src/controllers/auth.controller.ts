import { Response, NextFunction } from 'express';
import { authService, registerSchema, loginSchema } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/response';

export const authController = {
  async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      sendSuccess(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, req.user, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  },
};

import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response';

export const adminController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getAll({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search as string | undefined,
      });
      sendSuccess(res, result, 'Users retrieved');
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(req.params.id);
      sendSuccess(res, user, 'User retrieved');
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.delete(req.params.id);
      sendSuccess(res, null, 'User deleted');
    } catch (error) {
      next(error);
    }
  },
};

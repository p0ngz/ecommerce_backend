import { Request, Response, NextFunction } from 'express';
import {
  productService,
  createProductSchema,
  updateProductSchema,
} from '../services/product.service';
import { sendSuccess } from '../utils/response';

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search as string | undefined,
        isActive: true,
      });
      sendSuccess(res, result, 'Products retrieved');
    } catch (error) {
      next(error);
    }
  },

  async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search as string | undefined,
      });
      sendSuccess(res, result, 'Products retrieved');
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      sendSuccess(res, product, 'Product retrieved');
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.create(data);
      sendSuccess(res, product, 'Product created', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.update(req.params.id, data);
      sendSuccess(res, product, 'Product updated');
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.params.id);
      sendSuccess(res, null, 'Product deleted');
    } catch (error) {
      next(error);
    }
  },
};

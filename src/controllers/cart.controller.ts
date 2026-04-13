import { Response, NextFunction } from 'express';
import {
  cartService,
  addToCartSchema,
  removeFromCartSchema,
  updateCartItemSchema,
} from '../services/cart.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/response';

export const cartController = {
  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      sendSuccess(res, cart, 'Cart retrieved');
    } catch (error) {
      next(error);
    }
  },

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = addToCartSchema.parse(req.body);
      const cart = await cartService.addItem(req.user!.userId, data);
      sendSuccess(res, cart, 'Item added to cart');
    } catch (error) {
      next(error);
    }
  },

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = removeFromCartSchema.parse(req.body);
      const cart = await cartService.removeItem(req.user!.userId, data);
      sendSuccess(res, cart, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  },

  async updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = updateCartItemSchema.parse(req.body);
      const cart = await cartService.updateItem(req.user!.userId, data);
      sendSuccess(res, cart, 'Cart item updated');
    } catch (error) {
      next(error);
    }
  },

  async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await cartService.clearCart(req.user!.userId);
      sendSuccess(res, null, 'Cart cleared');
    } catch (error) {
      next(error);
    }
  },
};

import { z } from 'zod';
import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { AppError } from '../middlewares/error.middleware';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer').default(1),
});

export const removeFromCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export const updateCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

export const cartService = {
  async getCart(userId: string) {
    const cart = await cartRepository.findOrCreate(userId);
    return this.calculateTotal(cart);
  },

  async addItem(userId: string, input: AddToCartInput) {
    const product = await productRepository.findById(input.productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    if (!product.isActive) {
      throw new AppError('Product is not available', 400);
    }
    if (product.stock < input.quantity) {
      throw new AppError(`Insufficient stock. Available: ${product.stock}`, 400);
    }

    const cart = await cartRepository.addItem(userId, input.productId, input.quantity);
    return this.calculateTotal(cart!);
  },

  async removeItem(userId: string, input: RemoveFromCartInput) {
    const cart = await cartRepository.removeItem(userId, input.productId);
    return this.calculateTotal(cart!);
  },

  async updateItem(userId: string, input: UpdateCartItemInput) {
    const cart = await cartRepository.updateItemQuantity(
      userId,
      input.productId,
      input.quantity
    );
    return this.calculateTotal(cart!);
  },

  async clearCart(userId: string) {
    await cartRepository.clearCart(userId);
  },

  calculateTotal(cart: Awaited<ReturnType<typeof cartRepository.findOrCreate>>) {
    if (!cart) return null;
    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);
    return { ...cart, total };
  },
};

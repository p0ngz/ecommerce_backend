import { z } from 'zod';
import { productRepository } from '../repositories/product.repository';
import { AppError } from '../middlewares/error.middleware';
import { PaginationQuery, PaginatedResponse } from '../types';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  imageUrl: z.string().url('Invalid URL').optional(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productService = {
  async getAll(query: PaginationQuery & { isActive?: boolean }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(query.isActive !== undefined && { isActive: query.isActive }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      productRepository.findAll({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      productRepository.count(where),
    ]);

    const result: PaginatedResponse<typeof items[0]> = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return result;
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },

  async create(input: CreateProductInput) {
    return productRepository.create({
      ...input,
      price: input.price,
    });
  },

  async update(id: string, input: UpdateProductInput) {
    await this.getById(id);
    return productRepository.update(id, input);
  },

  async delete(id: string) {
    await this.getById(id);
    await productRepository.delete(id);
  },
};

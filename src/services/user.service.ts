import { userRepository } from '../repositories/user.repository';
import { AppError } from '../middlewares/error.middleware';
import { PaginationQuery } from '../types';

export const userService = {
  async getAll(query: PaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [items, total] = await Promise.all([
      userRepository.findAll({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      userRepository.count(where),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async delete(id: string) {
    await this.getById(id);
    await userRepository.delete(id);
  },
};

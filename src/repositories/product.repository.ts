import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export const productRepository = {
  findById: (id: string) =>
    prisma.product.findUnique({ where: { id } }),

  findAll: (args?: Prisma.ProductFindManyArgs) =>
    prisma.product.findMany(args),

  count: (where?: Prisma.ProductWhereInput) =>
    prisma.product.count({ where }),

  create: (data: Prisma.ProductCreateInput) =>
    prisma.product.create({ data }),

  update: (id: string, data: Prisma.ProductUpdateInput) =>
    prisma.product.update({ where: { id }, data }),

  delete: (id: string) => prisma.product.delete({ where: { id } }),
};

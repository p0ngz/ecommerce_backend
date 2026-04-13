import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findAll: (args?: Prisma.UserFindManyArgs) =>
    prisma.user.findMany({
      ...args,
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    }),

  count: (where?: Prisma.UserWhereInput) =>
    prisma.user.count({ where }),

  create: (data: Prisma.UserCreateInput) =>
    prisma.user.create({
      data,
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    }),

  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    }),

  delete: (id: string) => prisma.user.delete({ where: { id } }),
};

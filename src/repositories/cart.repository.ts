import { prisma } from '../config/database';

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          imageUrl: true,
        },
      },
    },
  },
};

export const cartRepository = {
  findByUserId: (userId: string) =>
    prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    }),

  findOrCreate: async (userId: string) => {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
    if (existing) return existing;
    return prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  },

  addItem: async (userId: string, productId: string, quantity: number) => {
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  },

  removeItem: async (userId: string, productId: string) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  },

  updateItemQuantity: async (userId: string, productId: string, quantity: number) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id, productId },
      });
    } else {
      await prisma.cartItem.updateMany({
        where: { cartId: cart.id, productId },
        data: { quantity },
      });
    }

    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  },

  clearCart: async (userId: string) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  },
};

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create regular users
  const userPassword = await bcrypt.hash('user123', 12);
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
    },
  });

  await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: userPassword,
      name: 'Jane Smith',
      role: 'USER',
    },
  });

  // Create products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with titanium design',
        price: 49900,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/400x400?text=iPhone+15+Pro',
        isActive: true,
      },
      {
        name: 'MacBook Air M3',
        description: '13-inch laptop with Apple M3 chip',
        price: 42900,
        stock: 30,
        imageUrl: 'https://via.placeholder.com/400x400?text=MacBook+Air+M3',
        isActive: true,
      },
      {
        name: 'AirPods Pro',
        description: 'Active Noise Cancellation wireless earbuds',
        price: 9900,
        stock: 100,
        imageUrl: 'https://via.placeholder.com/400x400?text=AirPods+Pro',
        isActive: true,
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Android flagship with AI features',
        price: 39900,
        stock: 40,
        imageUrl: 'https://via.placeholder.com/400x400?text=Galaxy+S24',
        isActive: true,
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-cancelling headphones',
        price: 11900,
        stock: 60,
        imageUrl: 'https://via.placeholder.com/400x400?text=Sony+WH-1000XM5',
        isActive: true,
      },
      {
        name: 'iPad Pro 12.9"',
        description: 'Professional tablet with M2 chip',
        price: 35900,
        stock: 25,
        imageUrl: 'https://via.placeholder.com/400x400?text=iPad+Pro',
        isActive: false,
      },
    ],
  });

  // Create cart for user1
  const allProducts = await prisma.product.findMany({ take: 2 });
  await prisma.cart.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          { productId: allProducts[0].id, quantity: 1 },
          { productId: allProducts[1].id, quantity: 2 },
        ],
      },
    },
  });

  console.log('✅ Seeding completed!');
  console.log(`   Admin: admin@ecommerce.com / admin123`);
  console.log(`   User:  john@example.com / user123`);
  console.log(`   Created ${products.count} products`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Premium Leather Jacket',
    description: 'Handcrafted premium leather jacket with modern design. Perfect for any occasion.',
    price: 299.99,
    originalPrice: 399.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    category: 'Jackets',
    inStock: true,
    stockQuantity: 15,
    featured: true
  },
  {
    name: 'Classic White Shirt',
    description: 'Elegant white dress shirt made from premium cotton. Perfect for business or casual wear.',
    price: 79.99,
    originalPrice: 99.99,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
    category: 'Shirts',
    inStock: true,
    stockQuantity: 30,
    featured: true
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Comfortable slim-fit jeans with stretch fabric. Available in multiple sizes.',
    price: 89.99,
    originalPrice: 119.99,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    category: 'Pants',
    inStock: true,
    stockQuantity: 25,
    featured: false
  },
  {
    name: 'Wool Overcoat',
    description: 'Luxurious wool overcoat for winter. Keeps you warm and stylish.',
    price: 449.99,
    originalPrice: 599.99,
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
    category: 'Coats',
    inStock: true,
    stockQuantity: 10,
    featured: true
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Soft cotton t-shirt in various colors. Comfortable and breathable.',
    price: 29.99,
    originalPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    category: 'T-Shirts',
    inStock: true,
    stockQuantity: 50,
    featured: false
  },
  {
    name: 'Designer Sneakers',
    description: 'High-quality designer sneakers with premium materials. Comfortable for all-day wear.',
    price: 199.99,
    originalPrice: 249.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    category: 'Shoes',
    inStock: true,
    stockQuantity: 20,
    featured: true
  },
  {
    name: 'Formal Dress Pants',
    description: 'Classic formal dress pants perfect for business meetings and formal events.',
    price: 129.99,
    originalPrice: 159.99,
    images: ['https://images.unsplash.com/photo-1506629905607-ccf4c0e4b0e0?w=800'],
    category: 'Pants',
    inStock: true,
    stockQuantity: 18,
    featured: false
  },
  {
    name: 'Cashmere Sweater',
    description: 'Luxurious cashmere sweater. Soft, warm, and elegant.',
    price: 179.99,
    originalPrice: 229.99,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
    category: 'Sweaters',
    inStock: true,
    stockQuantity: 12,
    featured: true
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with modern fit. Versatile and timeless.',
    price: 99.99,
    originalPrice: 129.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    category: 'Jackets',
    inStock: true,
    stockQuantity: 22,
    featured: false
  },
  {
    name: 'Leather Boots',
    description: 'Premium leather boots with durable sole. Perfect for all seasons.',
    price: 249.99,
    originalPrice: 299.99,
    images: ['https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800'],
    category: 'Shoes',
    inStock: true,
    stockQuantity: 15,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed by pre-save hook
      isAdmin: true
    });
    console.log('Admin user created:', admin.email);

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'admin123', // Will be hashed by pre-save hook
      isAdmin: false
    });
    console.log('Test user created:', testUser.email);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

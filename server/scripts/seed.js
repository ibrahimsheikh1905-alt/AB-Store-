import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const watches = [
 
  // Add a new testing product
  {
    name: "Testing Cloudinary Product",
    description: "This is a test product with a Cloudinary image.",
    price: 99,
    originalPrice: 120,
    images: [
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    ],
    category: "Test",
    inStock: true,
    stockQuantity: 10,
    featured: false
  },
  // ...baaki watches bhi isi tarah add karein
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({ category: "Men" }); // Optional: pehle ke watches hata de
    await Product.insertMany(watches);
    console.log("Watches products restored!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
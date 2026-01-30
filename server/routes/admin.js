import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/auth.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// ✅ Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// ✅ Admin middleware
router.use(protect, admin);



// ======================= PRODUCTS =======================

// ✅ GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ CREATE PRODUCT (accepts image URLs array from frontend)
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, inStock, stockQuantity, featured, images } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Product image is required (Cloudinary URL)" });
    }
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images, // Array of Cloudinary URLs
      category,
      inStock: inStock === 'true' || inStock === true,
      stockQuantity: parseInt(stockQuantity) || 0,
      featured: featured === 'true' || featured === true,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ UPDATE PRODUCT (accepts image URLs array from frontend)
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, originalPrice, category, inStock, stockQuantity, featured, images } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.originalPrice = originalPrice ? parseFloat(originalPrice) : product.originalPrice;
    product.images = images || product.images; // Update images if provided
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? (inStock === 'true' || inStock === true) : product.inStock;
    product.stockQuantity = stockQuantity ? parseInt(stockQuantity) : product.stockQuantity;
    product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ DELETE PRODUCT
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ======================= ORDERS =======================

// GET all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order to paid
router.put('/orders/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order to delivered
router.put('/orders/:id/deliver', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order must be paid before delivery' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

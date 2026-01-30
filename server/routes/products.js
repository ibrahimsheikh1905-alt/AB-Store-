import express from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../utils/cloudinary.js';

import Product from '../models/Product.js';

// ------------------- MULTER SETUP -------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ------------------- GET ALL PRODUCTS -------------------
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------- GET SINGLE PRODUCT -------------------
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

;
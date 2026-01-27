import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();

// ------------------- CLOUDINARY SETUP -------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// ------------------- CREATE PRODUCT -------------------
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, inStock, stockQuantity, featured } = req.body;

    // ------------------- HANDLE IMAGE UPLOAD -------------------
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
        imageUrls.push(uploadResult.secure_url);
      }
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      category,
      inStock,
      stockQuantity,
      featured,
      images: imageUrls, // save uploaded images
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------- UPDATE PRODUCT -------------------
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, originalPrice, category, inStock, stockQuantity, featured } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.originalPrice = originalPrice || product.originalPrice;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.stockQuantity = stockQuantity || product.stockQuantity;
    product.featured = featured !== undefined ? featured : product.featured;

    // ------------------- UPDATE IMAGES IF NEW FILES -------------------
    if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
        imageUrls.push(uploadResult.secure_url);
      }
      product.images = imageUrls;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------- DELETE PRODUCT -------------------
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
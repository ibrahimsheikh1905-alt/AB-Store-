import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Conditionally import Cloudinary only in production
let cloudinary, streamifier;
if (process.env.NODE_ENV === 'production') {
  try {
    const cloudinaryModule = await import('cloudinary');
    const streamifierModule = await import('streamifier');
    cloudinary = cloudinaryModule.v2;
    streamifier = streamifierModule.default;

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  } catch (error) {
    console.warn('Cloudinary not available, falling back to local storage');
  }
}

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------- MULTER SETUP -------------------
let storage, upload;

if (process.env.NODE_ENV === 'production' && cloudinary) {
  // Use memory storage for Cloudinary in production
  storage = multer.memoryStorage();
  upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif|webp/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });
} else {
  // Use disk storage for local development
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif|webp/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });
}

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
    let images = [];

    if (req.files && req.files.length > 0) {
      if (process.env.NODE_ENV === 'production' && cloudinary) {
        // Upload to Cloudinary in production
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
          images.push(uploadResult.secure_url);
        }
      } else {
        // Use local storage in development
        const baseUrl = 'http://localhost:5000';
        images = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
      }
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      inStock: inStock === 'true' || inStock === true,
      stockQuantity: parseInt(stockQuantity) || 0,
      featured: featured === 'true' || featured === true,
      images, // save uploaded images
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
    product.price = price ? parseFloat(price) : product.price;
    product.originalPrice = originalPrice ? parseFloat(originalPrice) : product.originalPrice;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? (inStock === 'true' || inStock === true) : product.inStock;
    product.stockQuantity = stockQuantity ? parseInt(stockQuantity) : product.stockQuantity;
    product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;

    // ------------------- UPDATE IMAGES IF NEW FILES -------------------
    if (req.files && req.files.length > 0) {
      if (process.env.NODE_ENV === 'production' && cloudinary) {
        // Upload to Cloudinary in production
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
          product.images.push(uploadResult.secure_url);
        }
      } else {
        // Use local storage in development
        const baseUrl = 'http://localhost:5000';
        const newImages = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
        // Append new images to keep existing ones unless explicitly replaced
        product.images = [...product.images, ...newImages];
      }
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
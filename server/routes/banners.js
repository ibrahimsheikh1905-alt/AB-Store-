import express from 'express';
import Banner from '../models/Banner.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create hero banner
// @route   POST /api/banners
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, image, category } = req.body;

    if (!title || !image || !category) {
      return res.status(400).json({ message: 'Title, image and category are required' });
    }

    const banner = await Banner.create({
      title,
      image,
      category: category.toLowerCase()
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all hero banners
// @route   GET /api/banners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).lean();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete hero banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await banner.deleteOne();
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

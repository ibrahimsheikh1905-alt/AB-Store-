import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const checkReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if user has purchased this product (paid order)
    const order = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      isPaid: true
    });

    const hasOrder = !!order;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    const hasReviewed = !!existingReview;

    res.json({
      canReview: hasOrder && !hasReviewed,
      hasReviewed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user can review product (has purchased but not reviewed)
// @route   GET /api/reviews/check/:productId
// @access  Private
router.get('/check/:productId', protect, checkReviewEligibility);

// @desc    Get user's reviews
// @route   GET /api/reviews
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get reviews for product
// @route   GET /api/reviews/product/:productId
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update review
// @route   POST /api/reviews/:productId
// @access  Private
// @desc    Get all reviews for admin
router.get('/admin', protect, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:productId', protect, async (req, res) => {
  try {

    console.log('Review body:', req.body);
    console.log('User:', req.user);
    const { rating, comment } = req.body;


    const review = await Review.findOne({
      product: req.params.productId,
      user: req.user._id
    });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment || review.comment;
      review.updatedAt = Date.now();
      await review.save();

      // Update product rating
      await updateProductRating(req.params.productId);
      res.json(review);
    } else {
      // Create new review
      const newReview = new Review({
        product: req.params.productId,
        user: req.user._id,
        userName: req.user.name,
        rating,
        comment
      });
      await newReview.save();

      // Update product rating
      console.log('Updating product rating for:', req.params.productId);
      await updateProductRating(req.params.productId);
      res.status(201).json(newReview);

    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.remove();

    // Update product rating
    await updateProductRating(review.product);

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Update average rating for product
const updateProductRating = async (productId) => {
  const productObjectId = new mongoose.Types.ObjectId(productId);

  const reviews = await Review.aggregate([
    { $match: { product: productObjectId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  const rating = reviews[0]?.avgRating ?? 0;
  const numReviews = reviews[0]?.numReviews ?? 0;

  await Product.findByIdAndUpdate(
    productId,
    {
      rating: Math.round(rating * 10) / 10,
      numReviews
    },
    { new: true }
  );
};

export default router;

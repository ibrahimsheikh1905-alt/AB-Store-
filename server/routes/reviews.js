import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper function to calculate and update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        $set: { rating: 0, numReviews: 0 }
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      $set: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        numReviews: reviews.length
      }
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has ordered this product
    const hasOrdered = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      isPaid: true // Only allow reviews for paid orders
    });

    if (!hasOrdered) {
      return res.status(403).json({ 
        message: 'You must purchase this product before you can review it' 
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment || '';
      existingReview.updatedAt = Date.now();
      await existingReview.save();

      // Update product rating
      await updateProductRating(productId);

      const review = await Review.findById(existingReview._id)
        .populate('user', 'name email')
        .populate('product', 'name');

      return res.json({
        message: 'Review updated successfully',
        review
      });
    }

    // Create new review
    const review = new Review({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating,
      comment: comment || ''
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .populate('product', 'name');

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reviews/user
// @desc    Get all reviews by current user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images price')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    review.updatedAt = Date.now();
    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .populate('product', 'name');

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reviews/check/:productId
// @desc    Check if user can review a product (has ordered it)
// @access  Private
router.get('/check/:productId', protect, async (req, res) => {
  try {
    const hasOrdered = await Order.findOne({
      user: req.user._id,
      'orderItems.product': req.params.productId,
      isPaid: true
    });

    const hasReviewed = await Review.findOne({
      user: req.user._id,
      product: req.params.productId
    });

    res.json({
      canReview: !!hasOrdered,
      hasReviewed: !!hasReviewed,
      hasOrdered: !!hasOrdered
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reviews/admin
// @desc    Get all reviews (Admin only)
// @access  Private/Admin
router.get('/admin', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name images')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

const validateCoupon = (coupon, subtotal) => {
  if (!coupon || !coupon.active) {
    return 'Invalid or inactive coupon';
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    return 'Coupon not active yet';
  }
  if (coupon.endDate && now > coupon.endDate) {
    return 'Coupon has expired';
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return 'Coupon usage limit reached';
  }
  if (subtotal < (coupon.minOrderValue || 0)) {
    return `Minimum order value for this coupon is ${coupon.minOrderValue}`;
  }

  return null;
};

const calculateDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;

  let discount = coupon.discountType === 'amount'
    ? coupon.discountValue
    : (subtotal * coupon.discountValue) / 100;

  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  if (discount > subtotal) {
    discount = subtotal;
  }

  return Math.max(discount, 0);
};

// @route   POST /api/coupons/apply
// @desc    Validate and calculate coupon discount
// @access  Private
router.post('/apply', protect, async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    const validationError = validateCoupon(coupon, subtotal || 0);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const discount = calculateDiscount(coupon, subtotal || 0);

    res.json({
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minOrderValue: coupon.minOrderValue,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin-only routes
router.use(protect, admin);

// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/coupons
// @desc    Create coupon
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const couponData = req.body;
    const coupon = new Coupon(couponData);
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/coupons/:id
// @desc    Update coupon
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    Object.keys(req.body).forEach((key) => {
      coupon[key] = req.body[key];
    });
    coupon.code = coupon.code?.toUpperCase();
    coupon.updatedAt = Date.now();

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await Coupon.deleteOne({ _id: req.params.id });
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

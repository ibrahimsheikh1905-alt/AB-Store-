import express from 'express';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import { protect } from '../middleware/auth.js';

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

  let discount = 0;
  if (coupon.discountType === 'amount') {
    discount = coupon.discountValue;
  } else {
    discount = (subtotal * coupon.discountValue) / 100;
  }

  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  if (discount > subtotal) {
    discount = subtotal;
  }

  return Math.max(discount, 0);
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      couponCode
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const itemsPrice = orderItems.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);

    const shippingPrice = itemsPrice > 28000 ? 0 : 2800;
    const taxValue = Number(taxPrice) || 0;

    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      const validationError = validateCoupon(coupon, itemsPrice);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      discountAmount = calculateDiscount(coupon, itemsPrice);
      appliedCouponCode = coupon.code;

      // Increment usage count after successful application
      coupon.usageCount += 1;
      await coupon.save();
    }

    const totalPrice = Math.max(itemsPrice - discountAmount + shippingPrice + taxValue, 0);

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice: taxValue,
      discountAmount,
      couponCode: appliedCouponCode,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

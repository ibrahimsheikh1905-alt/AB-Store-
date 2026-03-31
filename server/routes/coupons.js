import express from 'express';


import Coupon from '../models/Coupon.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public GET - active coupons only
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).sort({ createdAt: -1 }).lean();
    res.json(coupons);
  } catch (error) {
    console.error('Coupons GET error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin all coupons
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json(coupons);
  } catch (error) {
    console.error('Coupons GET error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply coupon - WITH DEBUG LOGS
router.post('/apply', async (req, res) => {
  try {
    console.log('=== COUPON APPLY DEBUG ===');
    console.log('Code:', req.body.code);
    console.log('Total coupons:', await Coupon.countDocuments());
    console.log('Active coupons:', await Coupon.countDocuments({active: true}));

    console.log('Subtotal:', req.body.subtotal);
    console.log('User:', req.user?._id);

    const { code, subtotal } = req.body;
    if (!code) {
      console.log('ERROR: No code');
      return res.status(400).json({ message: 'Coupon code required' });
    }

    const upperCode = code.toUpperCase();
    console.log('Searching for code:', upperCode);

    const now = new Date();
const activeCoupons = await Coupon.find({active: true}).lean();
console.log('ALL ACTIVE COUPONS:', activeCoupons.map(c => c.code));

console.log('TEST SIMPLE QUERY...');
const coupon = await Coupon.findOne({code: upperCode, active: true}).lean();
console.log('SIMPLE query coupon:', coupon);
if (!coupon) {
  console.log('Even simple query failed!');
}



    console.log('Found coupon:', coupon ? 'YES' : 'NO');
    if (!coupon) {
      console.log('ERROR: Invalid or expired coupon');
      return res.status(400).json({ message: 'Invalid or expired coupon. Check server console.' });
    }

    console.log('MinOrder:', coupon.minOrderValue, 'Subtotal:', subtotal);
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      console.log('ERROR: Min order not met');
      return res.status(400).json({ 
        message: `Minimum order ${coupon.minOrderValue} required (subtotal ${subtotal})`,
        minOrderValue: coupon.minOrderValue,
        subtotal: subtotal
      });
    }

    console.log('Usage:', coupon.usageCount, '/', coupon.usageLimit || 'Unlimited');
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      console.log('ERROR: Usage limit reached');
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    console.log('Calculated discount:', discountAmount);

    // Save incremented usage
    await Coupon.findOneAndUpdate(
      { code: upperCode },
      { $inc: { usageCount: 1 } }
    );

    console.log('SUCCESS: Coupon applied');
    res.json({
      success: true,
      code: coupon.code,
      discount: Math.round(discountAmount * 100) / 100
    });
  } catch (error) {
    console.error('Coupon apply error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code || !orderTotal) {
      return res.status(400).json({ message: 'Code and order total required' });
    }

    const now = new Date();
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).lean();

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }

    if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
      return res.status(400).json({ 
        message: `Minimum order value $${coupon.minOrderValue} required`,
        minOrderValue: coupon.minOrderValue 
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon,
      discountAmount: Math.round(discountAmount * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


import request from 'supertest';
import express from 'express';
import adminRoutes from '../routes/admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Mock middleware
jest.mock('../middleware/auth.js', () => ({
  protect: (req, res, next) => next(),
  admin: (req, res, next) => next(),
}));

// Mock models
jest.mock('../models/Product.js');
jest.mock('../models/Order.js');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin/products', () => {
    it('should return all products', async () => {
      const mockProducts = [{ name: 'Product 1' }, { name: 'Product 2' }];
      Product.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockProducts),
      });

      const res = await request(app).get('/admin/products');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockProducts);
      expect(Product.find).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      Product.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Test Error')),
      });

      const res = await request(app).get('/admin/products');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Test Error' });
    });
  });

  describe('POST /admin/products', () => {
    it('should create a new product', async () => {
        const mockProduct = {
            name: 'New Product',
            description: 'A shiny new product',
            price: 100,
            originalPrice: 120,
            category: 'Electronics',
            inStock: 'true',
            stockQuantity: '10',
            featured: 'true',
            images: ['http://example.com/image.jpg'],
          };
      const createdProduct = { _id: '123', ...mockProduct };
      
      Product.prototype.save = jest.fn().mockResolvedValue(createdProduct);

      const res = await request(app).post('/admin/products').send(mockProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdProduct);
      expect(Product.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if no images are provided', async () => {
        const mockProduct = {
            name: 'New Product',
            description: 'A shiny new product',
            price: 100,
          };
      const res = await request(app).post('/admin/products').send(mockProduct);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Product image is required (Cloudinary URL)' });
    });
  });

  describe('DELETE /admin/products/:id', () => {
    it('should delete a product', async () => {
      const mockProduct = { _id: '123', name: 'Test Product' };
      Product.findById.mockResolvedValue(mockProduct);
      Product.deleteOne.mockResolvedValue({n:1});

      const res = await request(app).delete('/admin/products/123');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Product removed' });
      expect(Product.findById).toHaveBeenCalledWith('123');
      expect(Product.deleteOne).toHaveBeenCalledWith({ _id: '123' });
    });

    it('should return 404 if product not found', async () => {
      Product.findById.mockResolvedValue(null);

      const res = await request(app).delete('/admin/products/123');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Product not found' });
    });
  });

  describe('GET /admin/orders', () => {
    it('should return all orders', async () => {
      const mockOrders = [{ total: 100 }, { total: 200 }];
      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockOrders)
        })
      });

      const res = await request(app).get('/admin/orders');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockOrders);
    });
  });

  describe('PUT /admin/orders/:id/pay', () => {
    it('should update order to paid', async () => {
      const mockOrder = {
        _id: '123',
        isPaid: false,
        save: jest.fn().mockResolvedValue({ _id: '123', isPaid: true }),
      };
      Order.findById.mockResolvedValue(mockOrder);

      const res = await request(app).put('/admin/orders/123/pay');

      expect(res.statusCode).toBe(200);
      expect(res.body.isPaid).toBe(true);
      expect(mockOrder.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /admin/orders/:id/deliver', () => {
    it('should update order to delivered', async () => {
      const mockOrder = {
        _id: '123',
        isPaid: true,
        isDelivered: false,
        save: jest.fn().mockResolvedValue({ _id: '123', isDelivered: true }),
      };
      Order.findById.mockResolvedValue(mockOrder);

      const res = await request(app).put('/admin/orders/123/deliver');

      expect(res.statusCode).toBe(200);
      expect(res.body.isDelivered).toBe(true);
      expect(mockOrder.save).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if order is not paid', async () => {
        const mockOrder = {
            _id: '123',
            isPaid: false,
          };
        Order.findById.mockResolvedValue(mockOrder);
  
        const res = await request(app).put('/admin/orders/123/deliver');
  
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ message: 'Order must be paid before delivery' });
      });
  });
});

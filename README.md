# E-Commerce Full-Stack Application

A production-ready full-stack e-commerce application built from scratch with React, Node.js, Express, and MongoDB.

## Features

### User Features
- User registration and authentication (JWT)
- Browse products with filtering and search
- Product details page with image gallery
- Shopping cart with quantity management
- Secure checkout process
- Order history

### Admin Features
- Admin authentication
- Product management (CRUD operations)
- Image upload for products
- View and manage customer orders
- Mark orders as delivered

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Context API** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## Project Structure

```
ecommerce-clone/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context providers (Auth, Cart)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions (API)
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Express application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── scripts/           # Seed script
│   ├── uploads/           # Uploaded images
│   ├── server.js          # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Install Dependencies

From the root directory:

```bash
npm run install-all
```

Or install manually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

### 3. Create Uploads Directory

```bash
cd server
mkdir uploads
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas cloud database and update `MONGODB_URI` in `.env`.

### 5. Seed Database (Optional)

Populate the database with sample products and users:

```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Test user: `test@example.com` / `admin123`
- 10 sample products

### 6. Run the Application

#### Option 1: Run Both Servers Together (Recommended)

From the root directory:

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) concurrently.

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with query params: category, featured, search)
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders/myorders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)

### Admin
- `GET /api/admin/products` - Get all products (Admin)
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)
- `DELETE /api/admin/products/:id` - Delete product (Admin)
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/admin/orders/:id/deliver` - Mark order as delivered (Admin)

## Default Credentials

After running the seed script:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Test User:**
- Email: `test@example.com`
- Password: `admin123`

## Development

### Frontend Development
- Hot module replacement enabled
- Proxy configured for API calls
- Tailwind CSS with JIT compilation

### Backend Development
- Nodemon for auto-restart
- CORS enabled for development
- Error handling middleware

## Production Build

### Frontend
```bash
cd client
npm run build
```

The build output will be in `client/dist/`.

### Backend
```bash
cd server
npm start
```

## Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add HTTPS in production
- Validate and sanitize all inputs
- Use MongoDB connection string with authentication in production

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in server `.env`
- Change port in `client/vite.config.js`

### Image Upload Issues
- Ensure `server/uploads/` directory exists
- Check file permissions
- Verify multer configuration

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

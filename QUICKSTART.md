# Quick Start Guide

## Fast Setup (5 minutes)

### 1. Install All Dependencies
```bash
npm run install-all
```

### 2. Setup Environment
```bash
cd server
# Copy the example env file
# On Windows PowerShell:
Copy-Item .env.example .env
# On Mac/Linux:
cp .env.example .env
```

Edit `server/.env` and set:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
```

### 3. Start MongoDB
Make sure MongoDB is running. If not installed:
- Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 4. Seed Database (Optional but Recommended)
```bash
cd server
npm run seed
```

This creates:
- Admin: `admin@example.com` / `admin123`
- User: `test@example.com` / `admin123`
- 10 sample products

### 5. Run the Application
From root directory:
```bash
npm run dev
```

### 6. Open Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

## That's it! 🎉

You can now:
- Browse products at http://localhost:3000
- Login as admin at http://localhost:3000/login
- Access admin panel at http://localhost:3000/admin

## Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in `server/.env`
- For MongoDB Atlas, use connection string like: `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce`

**Port already in use?**
- Change PORT in `server/.env`
- Change port in `client/vite.config.js`

**Module not found errors?**
- Run `npm run install-all` again
- Delete `node_modules` and reinstall

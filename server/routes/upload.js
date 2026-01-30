import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            error: 'Cloudinary upload failed',
            details: error.message,
          });
        }
        res.json({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: err.message,
    });
  }
});

export default router;
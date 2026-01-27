import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    // Remove file from local uploads after upload
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Cloudinary upload failed', details: err.message });
  }
});

export default router;

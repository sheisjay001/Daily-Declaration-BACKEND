import { Router } from 'express';
import multer from 'multer';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Configure multer for memory storage (for now, you can use cloud storage later)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload image endpoint
router.post('/', authenticate, upload.single('image'), (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // For now, convert to base64 (in production, use cloud storage like AWS S3 or Cloudinary)
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    res.json({ url: base64 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;

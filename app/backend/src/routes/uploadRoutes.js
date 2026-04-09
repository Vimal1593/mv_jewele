import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { requireAdmin } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Memory storage to stream directly to S3 without using container disk space
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximum
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Strictly images only.'));
  }
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'jewelsmv1';

router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided." });

    const fileExtension = req.file.originalname.split('.').pop();
    const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `products/${uniqueFileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      // ACL: 'public-read' // Note: This depends on Bucket Ownership Settings
    });

    await s3Client.send(command);
    
    // Format AWS URI string dynamically
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/products/${uniqueFileName}`;

    res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "S3 Storage Network Failure" });
  }
});

export default router;

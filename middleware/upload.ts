import multer from 'multer';
import path from 'path';
import config from '../config/config';

/**
 * Multer middleware for handling image uploads.
 *
 * - Stores uploaded files in the 'uploads' directory at the project root.
 * - Filenames are prefixed with a timestamp for uniqueness.
 * - Only allows JPEG and PNG image files.
 *
 * Usage:
 *   app.post('/upload', upload.single('image'), (req, res) => { ... });
 */
const uploadDir = path.join(process.cwd(), config.uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

/**
 * File filter to allow only JPEG and PNG images.
 * @param req - Express request object.
 * @param file - Uploaded file object.
 * @param cb - Callback to indicate acceptance or rejection.
 */
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

/**
 * Multer upload instance configured for image files.
 */
const upload = multer({
  storage,
  fileFilter,  
});

export default upload;
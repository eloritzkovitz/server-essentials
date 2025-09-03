import multer from 'multer';
import path from 'path';
import config from '../config/config';

/**
 * Directory for uploads, configurable via config.
 */
export const uploadDir = path.join(process.cwd(), config.uploadDir);

/**
 * Multer storage configuration object (for testing).
 */
export const storageConfig = {
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
};

/**
 * Multer storage engine.
 */
export const storage = multer.diskStorage(storageConfig);

/**
 * File filter for images (JPEG, PNG).
 */
export const imageFileFilter = (req: any, file: any, cb: any) => {
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
 * File filter for common document and file types (PDF, DOC, DOCX, XLS, XLSX, TXT).
 */
export const documentFileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, DOCX, XLS, XLSX, TXT) are allowed'));
  }
};

/**
 * File filter for any file type (accepts all).
 */
export const anyFileFilter = (req: any, file: any, cb: any) => {
  cb(null, true);
};

/**
 * Create a Multer upload instance with optional custom file filter and storage.
 * @param fileFilter - Optional custom file filter function (default: imageFileFilter).
 * @param customStorage - Optional custom Multer storage (default: storage).
 */
export function createUpload(
  fileFilter = anyFileFilter,
  customStorage = storage
) {
  return multer({
    storage: customStorage,
    fileFilter,
  });
}

/**
 * Default Multer upload instance for any file type.
 */
export const upload = createUpload();

/**
 * Default Multer upload instance for images.
 */
export const uploadImage = createUpload(imageFileFilter);

/**
 * Multer upload instance for documents.
 */
export const uploadDocument = createUpload(documentFileFilter);

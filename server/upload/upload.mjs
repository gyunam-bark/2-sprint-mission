import multer from "multer";
import fs from 'fs';
import path from 'path';

export const STORAGE_DIRECTORY = path.resolve('storage');

export const getStorageUrl = (url) => {
  return path.resolve(`./${url}`);
};

const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

if (!fs.existsSync(STORAGE_DIRECTORY)) {
  fs.mkdirSync(STORAGE_DIRECTORY, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, STORAGE_DIRECTORY);
  },
  filename: async (req, file, callback) => {
    const date = Date.now().toString();
    const originalname = file.originalname;
    const uniquename = `${date}-${originalname}`;
    const ext = path.extname(originalname);

    file.ext = ext;

    callback(null, uniquename);
  }
});

const limits = {
  fileSize: FILE_SIZE_LIMIT
};

export const upload = multer({
  storage: storage,
  limits: limits
});

export default upload;
import multer from 'multer';
import path from 'path';
import { generateUniqueFilename, ensureUploadDir } from '../utils/fileUtils';
import prisma from '../config/database';

// Ensure upload directory exists
ensureUploadDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  }
});

export class FileService {
  async saveFileRecord(file: Express.Multer.File): Promise<string> {
    try {
      const fileRecord = await prisma.file.create({
        data: {
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
        }
      });

      return fileRecord.id;
    } catch (error) {
      console.error('Error saving file record:', error);
      throw new Error('Failed to save file record');
    }
  }

  async getFileById(id: string) {
    try {
      return await prisma.file.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error getting file by ID:', error);
      throw new Error('Failed to get file');
    }
  }

  async deleteFileRecord(id: string): Promise<void> {
    try {
      await prisma.file.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting file record:', error);
      throw new Error('Failed to delete file record');
    }
  }
}

export const fileService = new FileService();
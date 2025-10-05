import { Router, Request, Response } from 'express';
import { upload, fileService } from '../services/fileService';
import { FileUploadResponse } from '../types';

const router = Router();

router.post('/', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'projectReport', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.cv || !files.projectReport) {
      return res.status(400).json({
        error: 'Both CV and project report files are required'
      });
    }

    const cvFile = files.cv[0];
    const projectFile = files.projectReport[0];

    // Save file records to database
    const cvId = await fileService.saveFileRecord(cvFile);
    const projectReportId = await fileService.saveFileRecord(projectFile);

    const response: FileUploadResponse = {
      cvId,
      projectReportId
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload files'
    });
  }
});

export default router;
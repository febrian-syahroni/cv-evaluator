import { Request, Response, NextFunction } from "express";

export const validateFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files || (!files.cv && !files.projectReport)) {
    return res.status(400).json({
      error: "No files uploaded",
    });
  }

  if (!files.cv) {
    return res.status(400).json({
      error: "CV file is required",
    });
  }

  if (!files.projectReport) {
    return res.status(400).json({
      error: "Project report file is required",
    });
  }

  return next();
};

export const validateEvaluationRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jobTitle, cvId, projectReportId } = req.body;

  if (!jobTitle || typeof jobTitle !== "string") {
    return res.status(400).json({
      error: "jobTitle is required and must be a string",
    });
  }

  if (!cvId || typeof cvId !== "string") {
    return res.status(400).json({
      error: "cvId is required and must be a string",
    });
  }

  if (!projectReportId || typeof projectReportId !== "string") {
    return res.status(400).json({
      error: "projectReportId is required and must be a string",
    });
  }

  return next();
};

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Multer errors
  if (err.message === 'Only PDF files are allowed') {
    statusCode = 400;
    message = 'Only PDF files are allowed';
  }

  if (err.message === 'File too large') {
    statusCode = 400;
    message = 'File size exceeds the maximum limit';
  }

  // Prisma errors
  if (err.message.includes('Unique constraint')) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
};
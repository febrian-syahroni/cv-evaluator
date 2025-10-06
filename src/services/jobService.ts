import { Queue, Worker, Job } from 'bullmq';
import redis from '../config/redis';
import prisma from '../config/database';
import { aiService } from './aiService';
import { fileService } from './fileService';
import { extractTextFromPDF } from '../utils/fileUtils';
import { EvaluationRequest } from '../types';
import { JobStatus } from '@prisma/client';

// Create evaluation queue
export const evaluationQueue = new Queue('evaluation', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Job data interface
interface EvaluationJobData extends EvaluationRequest {
  jobId: string;
}

export class JobService {
  async createEvaluationJob(data: EvaluationRequest): Promise<string> {
    try {
      // Create job record in database
      const job = await prisma.job.create({
        data: {
          jobTitle: data.jobTitle,
          cvId: data.cvId,
          projectId: data.projectReportId,
          status: 'QUEUED',
        }
      });

      // Add job to queue
      await evaluationQueue.add('evaluate', {
        ...data,
        jobId: job.id,
      });

      return job.id;
    } catch (error) {
      console.error('Error creating evaluation job:', error);
      throw new Error('Failed to create evaluation job');
    }
  }

  async getJobStatus(jobId: string) {
    try {
      return await prisma.job.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          status: true,
          result: true,
          error: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    } catch (error) {
      console.error('Error getting job status:', error);
      throw new Error('Failed to get job status');
    }
  }

  async updateJobStatus(jobId: string, status: JobStatus, result?: any, error?: string) {
    try {
      return await prisma.job.update({
        where: { id: jobId },
        data: {
          status,
          result,
          error,
          updatedAt: new Date(),
        }
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      throw new Error('Failed to update job status');
    }
  }
}

export const jobService = new JobService();

// Worker to process evaluation jobs
const evaluationWorker = new Worker('evaluation', async (job: Job<EvaluationJobData>) => {
  const { jobTitle, cvId, projectReportId, jobId } = job.data;

  try {
    // Update job status to processing
    await jobService.updateJobStatus(jobId, 'PROCESSING');

    // Get file records
    const cvFile = await fileService.getFileById(cvId);
    const projectFile = await fileService.getFileById(projectReportId);

    if (!cvFile || !projectFile) {
      throw new Error('File not found');
    }

    // Extract text from PDFs
    const cvText = await extractTextFromPDF(cvFile.path);
    const projectText = await extractTextFromPDF(projectFile.path);

    // Perform AI evaluations
    const cvEvaluation = await aiService.evaluateCV(cvText, jobTitle);
    const projectEvaluation = await aiService.evaluateProject(projectText, jobTitle);
    const finalAnalysis = await aiService.generateFinalAnalysis(cvEvaluation, projectEvaluation, jobTitle);

    // Prepare final result
    const result = {
      cv_match_rate: cvEvaluation.match_rate,
      cv_feedback: cvEvaluation.feedback,
      project_score: projectEvaluation.score,
      project_feedback: projectEvaluation.feedback,
      overall_summary: finalAnalysis.overall_summary,
    };

    // Update job with result
    await jobService.updateJobStatus(jobId, 'COMPLETED', result);

    return result;
  } catch (error) {
    console.error('Error processing evaluation job:', error);
    await jobService.updateJobStatus(jobId, 'FAILED', null, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}, {
  connection: redis,
  concurrency: 5,
});

// Worker event handlers
evaluationWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

evaluationWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

evaluationWorker.on('error', (err) => {
  console.error('Worker error:', err);
});

export { evaluationWorker };
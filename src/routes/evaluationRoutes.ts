import { Router, Request, Response } from "express";
import { jobService } from "../services/jobService";
import { EvaluationRequest, EvaluationResponse, JobResult } from "../types";

const router = Router();

// POST /evaluate - Start evaluation process
router.post("/", async (req: Request, res: Response) => {
  try {
    const { jobTitle, cvId, projectReportId }: EvaluationRequest = req.body;

    // Validate required fields
    if (!jobTitle || !cvId || !projectReportId) {
      return res.status(400).json({
        error: "jobTitle, cvId, and projectReportId are required",
      });
    }

    // Create evaluation job
    const jobId = await jobService.createEvaluationJob({
      jobTitle,
      cvId,
      projectReportId,
    });

    const response: EvaluationResponse = {
      id: jobId,
      status: "queued",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Evaluation error:", error);
    return res.status(500).json({
      error: "Failed to start evaluation process",
    });
  }
});

// GET /result/:id - Get evaluation result
router.get("/result/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await jobService.getJobStatus(id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    const response: JobResult = {
      id: job.id,
      status: job.status.toLowerCase(),
    };

    if (job.status === "COMPLETED" && job.result) {
      response.result = job.result as any;
    }

    if (job.status === "FAILED" && job.error) {
      response.error = job.error;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get result error:", error);
    return res.status(500).json({
      error: "Failed to get evaluation result",
    });
  }
});

export default router;

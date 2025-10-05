export interface FileUploadResponse {
  cvId: string;
  projectReportId: string;
}

export interface EvaluationRequest {
  jobTitle: string;
  cvId: string;
  projectReportId: string;
}

export interface EvaluationResponse {
  id: string;
  status: string;
}

export interface JobResult {
  id: string;
  status: string;
  result?: {
    cv_match_rate: number;
    cv_feedback: string;
    project_score: number;
    project_feedback: string;
    overall_summary: string;
  };
  error?: string;
}

export interface CVEvaluation {
  match_rate: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}

export interface ProjectEvaluation {
  score: number;
  feedback: string;
  technical_quality: number;
  implementation_quality: number;
  documentation_quality: number;
}

export interface FinalAnalysis {
  overall_summary: string;
  recommendation: string;
  fit_score: number;
}
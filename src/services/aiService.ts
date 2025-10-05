import openai from '../config/openai';
import { CVEvaluation, ProjectEvaluation, FinalAnalysis } from '../types';
import { 
  CV_EVALUATION_PROMPT, 
  PROJECT_EVALUATION_PROMPT, 
  FINAL_ANALYSIS_PROMPT,
  JOB_DESCRIPTIONS,
  PROJECT_BRIEFS 
} from '../utils/prompts';

export class AIService {
  private async callOpenAI(prompt: string, maxRetries = 3): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert HR and technical reviewer. Always respond with valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        return content;
      } catch (error) {
        console.error(`OpenAI API attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          throw new Error(`OpenAI API failed after ${maxRetries} attempts: ${error}`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw new Error('Unexpected error in OpenAI service');
  }

  private parseJSONResponse<T>(response: string): T {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      console.error('Raw response:', response);
      throw new Error('Invalid JSON response from AI service');
    }
  }

  async evaluateCV(cvText: string, jobTitle: string): Promise<CVEvaluation> {
    const jobDescription = JOB_DESCRIPTIONS[jobTitle as keyof typeof JOB_DESCRIPTIONS] || 
                          JOB_DESCRIPTIONS["Backend Engineer"];

    const prompt = CV_EVALUATION_PROMPT
      .replace('{jobDescription}', jobDescription)
      .replace('{cvText}', cvText);

    const response = await this.callOpenAI(prompt);
    return this.parseJSONResponse<CVEvaluation>(response);
  }

  async evaluateProject(projectText: string, jobTitle: string): Promise<ProjectEvaluation> {
    const projectBrief = PROJECT_BRIEFS[jobTitle as keyof typeof PROJECT_BRIEFS] || 
                        PROJECT_BRIEFS["Backend Engineer"];

    const prompt = PROJECT_EVALUATION_PROMPT
      .replace('{projectBrief}', projectBrief)
      .replace('{projectText}', projectText);

    const response = await this.callOpenAI(prompt);
    return this.parseJSONResponse<ProjectEvaluation>(response);
  }

  async generateFinalAnalysis(
    cvEvaluation: CVEvaluation, 
    projectEvaluation: ProjectEvaluation, 
    jobTitle: string
  ): Promise<FinalAnalysis> {
    const prompt = FINAL_ANALYSIS_PROMPT
      .replace('{cvEvaluation}', JSON.stringify(cvEvaluation, null, 2))
      .replace('{projectEvaluation}', JSON.stringify(projectEvaluation, null, 2))
      .replace('{jobTitle}', jobTitle);

    const response = await this.callOpenAI(prompt);
    return this.parseJSONResponse<FinalAnalysis>(response);
  }
}

export const aiService = new AIService();
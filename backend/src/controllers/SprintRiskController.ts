import { Request, Response } from 'express';
import { SprintRiskService } from '../services/SprintRiskService';

export class SprintRiskController {
  private sprintRiskService: SprintRiskService;

  constructor() {
    this.sprintRiskService = new SprintRiskService();
  }

  public getSprintRisk = async (req: Request, res: Response): Promise<void> => {
    try {
      const riskAssessment = await this.sprintRiskService.fetchAndCalculateRisk();
      res.json({
        success: true,
        data: riskAssessment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to calculate Sprint Risk Score',
        error: error.message
      });
    }
  };
}

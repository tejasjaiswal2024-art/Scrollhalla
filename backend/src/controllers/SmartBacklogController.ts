import { Request, Response } from 'express';
import { TaskController } from './TaskController';
import { SmartBacklogService } from '../services/SmartBacklogService';

export class SmartBacklogController {
  private taskController: TaskController;
  private smartBacklogService: SmartBacklogService;

  constructor(taskController: TaskController) {
    this.taskController = taskController;
    this.smartBacklogService = new SmartBacklogService();
  }

  public getSmartBacklog = (req: Request, res: Response): void => {
    const tasks = this.taskController.getRawTasks();
    const rankedBacklog = this.smartBacklogService.getRankedBacklog(tasks);

    res.json({
      success: true,
      algorithm: 'Xikipedia Engagement Score (Views, Comments, Backlog Days, MoSCoW Weight)',
      count: rankedBacklog.length,
      data: rankedBacklog.map(item => item.toJSON())
    });
  };
}

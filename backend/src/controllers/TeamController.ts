import { Request, Response } from 'express';
import { initialTeamMembers } from '../data/mockData';
import { TaskController } from './TaskController';

export class TeamController {
  private taskController: TaskController;

  constructor(taskController: TaskController) {
    this.taskController = taskController;
  }

  public getTeamMembers = (req: Request, res: Response): void => {
    const tasks = this.taskController.getRawTasks();

    const membersWithWorkload = initialTeamMembers.map(member => {
      const assignedTasks = tasks.filter(t => t.assignee === member.name);
      const totalPoints = assignedTasks.reduce((sum, t) => sum + t.storyPoints, 0);

      return {
        ...member,
        assignedTasksCount: assignedTasks.length,
        assignedStoryPoints: totalPoints,
        capacityUtilizationPercentage: Math.min(100, Math.round((totalPoints / member.velocity) * 100))
      };
    });

    res.json({
      success: true,
      count: membersWithWorkload.length,
      data: membersWithWorkload
    });
  };
}

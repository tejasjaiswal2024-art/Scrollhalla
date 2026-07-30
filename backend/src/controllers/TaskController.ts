import { Request, Response } from 'express';
import { Task, TaskStatus, MoscowPriority } from '../models/Task';
import { initialTasks } from '../data/mockData';

export class TaskController {
  private tasks: Task[];

  constructor() {
    this.tasks = [...initialTasks];
  }

  public getAllTasks = (req: Request, res: Response): void => {
    const { status, moscow } = req.query;
    let result = this.tasks;

    if (status) {
      result = result.filter(t => t.status === status);
    }
    if (moscow) {
      result = result.filter(t => t.moscow === moscow);
    }

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  };

  public getTaskById = (req: Request, res: Response): void => {
    const { id } = req.params;
    const task = this.tasks.find(t => t.id === id);

    if (!task) {
      res.status(404).json({ success: false, message: `Task ${id} not found.` });
      return;
    }

    // Auto increment view engagement metric when viewing details
    task.incrementViews();

    res.json({
      success: true,
      data: task
    });
  };

  public createTask = (req: Request, res: Response): void => {
    const { title, description, status, moscow, storyPoints, assignee } = req.body;

    if (!title || !description) {
      res.status(400).json({ success: false, message: 'Title and description are required.' });
      return;
    }

    const newTask = new Task({
      title,
      description,
      status: status || TaskStatus.TO_DO,
      moscow: moscow || MoscowPriority.SHOULD_HAVE,
      storyPoints: Number(storyPoints) || 3,
      assignee: assignee || 'Unassigned'
    });

    this.tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask
    });
  };

  public updateTask = (req: Request, res: Response): void => {
    const { id } = req.params;
    const taskIndex = this.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      res.status(404).json({ success: false, message: `Task ${id} not found.` });
      return;
    }

    const currentTask = this.tasks[taskIndex];
    const { title, description, status, moscow, storyPoints, assignee } = req.body;

    if (title !== undefined) currentTask.title = title;
    if (description !== undefined) currentTask.description = description;
    if (status !== undefined) currentTask.status = status;
    if (moscow !== undefined) currentTask.moscow = moscow;
    if (storyPoints !== undefined) currentTask.storyPoints = Number(storyPoints);
    if (assignee !== undefined) currentTask.assignee = assignee;

    res.json({
      success: true,
      data: currentTask
    });
  };

  public addComment = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { author, text } = req.body;

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      res.status(404).json({ success: false, message: `Task ${id} not found.` });
      return;
    }

    if (!text) {
      res.status(400).json({ success: false, message: 'Comment text is required.' });
      return;
    }

    const newComment = task.addComment(author, text);

    res.status(201).json({
      success: true,
      data: newComment,
      task
    });
  };

  public deleteTask = (req: Request, res: Response): void => {
    const { id } = req.params;
    const index = this.tasks.findIndex(t => t.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: `Task ${id} not found.` });
      return;
    }

    const deleted = this.tasks.splice(index, 1);
    res.json({
      success: true,
      data: deleted[0]
    });
  };

  public getRawTasks(): Task[] {
    return this.tasks;
  }
}

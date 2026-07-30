import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { SmartBacklogController } from '../controllers/SmartBacklogController';
import { SprintRiskController } from '../controllers/SprintRiskController';
import { TeamController } from '../controllers/TeamController';
import { AuthController } from '../controllers/AuthController';
import { FeedController } from '../controllers/FeedController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Instantiate Controllers (Dependency Injection)
const taskController = new TaskController();
const smartBacklogController = new SmartBacklogController(taskController);
const sprintRiskController = new SprintRiskController();
const teamController = new TeamController(taskController);
const authController = new AuthController();
const feedController = new FeedController();

// Authentication Endpoints
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateJWT, authController.getProfile);

// Combined RSS/Atom Timeline Endpoint (Redis Cached)
router.get('/feed', feedController.getCombinedTimeline);

// Task Endpoints
router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.post('/tasks/:id/comments', taskController.addComment);

// Smart Backlog Endpoint
router.get('/smart-backlog', smartBacklogController.getSmartBacklog);

// Sprint Risk Telemetry Endpoint
router.get('/sprint-risk', sprintRiskController.getSprintRisk);

// Team Management Endpoint
router.get('/team', teamController.getTeamMembers);

export default router;

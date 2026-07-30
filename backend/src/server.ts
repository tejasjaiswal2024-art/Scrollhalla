import app from './app';
import { FeedCronWorker } from './workers/feedCronWorker';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Scrollhalla Backend API Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
  console.log(`👉 Smart Backlog: http://localhost:${PORT}/api/smart-backlog`);
  console.log(`👉 Sprint Risk: http://localhost:${PORT}/api/sprint-risk`);
  console.log(`👉 Timeline Feed: http://localhost:${PORT}/api/feed`);
  console.log(`==================================================`);

  // Start background worker cron job (every 15 min)
  FeedCronWorker.startCronJob();
});

import { Request, Response } from 'express';
import { cacheService } from '../config/redis';
import { FeedCronWorker } from '../workers/feedCronWorker';

const REDIS_FEED_CACHE_KEY = 'scrollhalla:timeline:global';

export class FeedController {
  /**
   * GET /api/feed
   * Serves user's combined timeline directly from Redis cache for instant load times.
   */
  public getCombinedTimeline = async (req: Request, res: Response): Promise<void> => {
    try {
      const startTime = Date.now();

      // Attempt instant fetch from Redis Cache
      let cachedTimeline = await cacheService.get(REDIS_FEED_CACHE_KEY);
      let articles = [];

      if (cachedTimeline) {
        articles = JSON.parse(cachedTimeline);
      } else {
        // Cache miss: execute on-demand harvest & populate cache
        console.log('[FeedController] Redis cache miss. Triggering on-demand harvest...');
        articles = await FeedCronWorker.executeFeedHarvest();
      }

      const responseTimeMs = Date.now() - startTime;

      res.json({
        success: true,
        source: cachedTimeline ? 'REDIS_CACHE_HIT' : 'ON_DEMAND_HARVEST',
        latencyMs: `${responseTimeMs}ms`,
        count: articles.length,
        data: articles
      });
    } catch (error: any) {
      console.error('[FeedController Error]', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve timeline feed.',
        error: error.message
      });
    }
  };
}

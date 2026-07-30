import cron from 'node-cron';
import { prisma } from '../config/prisma';
import { cacheService } from '../config/redis';
import { FeedParserFactory } from '../parsers/FeedParserFactory';
import { IFeedItem } from '../parsers/BaseParser';

const REDIS_FEED_CACHE_KEY = 'scrollhalla:timeline:global';

export const defaultSubscriptions = [
  { url: 'https://www.githubstatus.com/history.rss', title: 'GitHub System Status' },
  { url: 'https://news.ycombinator.com/rss', title: 'Hacker News RSS' },
  { url: 'https://dev.to/feed', title: 'DEV Community RSS' }
];

export class FeedCronWorker {
  /**
   * Fetches subscriptions from PostgreSQL (or default seeds), parses via Factory, and caches in Redis.
   */
  public static async executeFeedHarvest(): Promise<IFeedItem[]> {
    console.log(`[Background Worker] 🚀 Starting RSS/Atom feed harvest at ${new Date().toISOString()}...`);

    let subscriptionUrls: Array<{ url: string; title: string }> = [];

    try {
      const dbSubscriptions = await prisma.subscription.findMany({
        select: { feedUrl: true, title: true }
      });
      if (dbSubscriptions.length > 0) {
        subscriptionUrls = dbSubscriptions.map(s => ({ url: s.feedUrl, title: s.title }));
      } else {
        subscriptionUrls = defaultSubscriptions;
      }
    } catch (dbError) {
      console.warn('[Background Worker] Database query notice. Using default RSS feeds for harvest.');
      subscriptionUrls = defaultSubscriptions;
    }

    const allArticles: IFeedItem[] = [];

    // Process each subscription using the Factory Pattern
    for (const sub of subscriptionUrls) {
      try {
        const parser = FeedParserFactory.createParser(sub.url);
        const items = await parser.parse(sub.url);
        items.forEach(item => {
          if (sub.title && !item.sourceTitle) item.sourceTitle = sub.title;
        });
        allArticles.push(...items);
      } catch (err) {
        console.error(`[Background Worker] Failed to harvest feed '${sub.url}'`, err);
      }
    }

    // Sort combined timeline chronologically descending
    allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Store normalized JSON array into Redis cache for instant 0ms latency lookup
    await cacheService.set(REDIS_FEED_CACHE_KEY, JSON.stringify(allArticles), 1800); // 30 min cache TTL

    console.log(`[Background Worker] ✅ Successfully harvested and cached ${allArticles.length} timeline articles in Redis.`);
    return allArticles;
  }

  /**
   * Initializes background cron worker executing every 15 minutes.
   */
  public static startCronJob(): void {
    console.log('[Background Worker] Initializing Feed Worker Cron Schedule (Every 15 minutes)');

    // Run initial harvest immediately on server startup
    FeedCronWorker.executeFeedHarvest().catch(err => {
      console.error('[Background Worker Initial Run Error]', err);
    });

    // Schedule cron every 15 minutes
    cron.schedule('*/15 * * * *', () => {
      FeedCronWorker.executeFeedHarvest().catch(err => {
        console.error('[Background Worker Scheduled Run Error]', err);
      });
    });
  }
}

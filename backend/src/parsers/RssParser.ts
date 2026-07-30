import Parser from 'rss-parser';
import { BaseParser, IFeedItem } from './BaseParser';

export class RssParser extends BaseParser {
  private rssClient: Parser;

  constructor() {
    super('RSS_2.0_Parser');
    this.rssClient = new Parser();
  }

  public async parse(feedUrl: string): Promise<IFeedItem[]> {
    try {
      const feed = await this.rssClient.parseURL(feedUrl);
      const sourceTitle = feed.title || 'RSS Feed';

      return (feed.items || []).map(item => ({
        id: item.guid || item.link || `rss-${Date.now()}-${Math.random()}`,
        title: item.title || 'Untitled Article',
        link: item.link || '#',
        content: item.contentSnippet || item.content || item.summary || '',
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        feedType: 'RSS',
        sourceTitle
      }));
    } catch (error) {
      console.warn(`[RssParser] Error parsing RSS feed '${feedUrl}':`, error);
      return [];
    }
  }
}

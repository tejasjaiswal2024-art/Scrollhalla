import Parser from 'rss-parser';
import { BaseParser, IFeedItem } from './BaseParser';

export class AtomParser extends BaseParser {
  private atomClient: Parser;

  constructor() {
    super('Atom_1.0_Parser');
    this.atomClient = new Parser({
      customFields: {
        item: ['updated', 'summary', 'author']
      }
    });
  }

  public async parse(feedUrl: string): Promise<IFeedItem[]> {
    try {
      const feed = await this.atomClient.parseURL(feedUrl);
      const sourceTitle = feed.title || 'Atom Feed Channel';

      return (feed.items || []).map(item => ({
        id: item.id || item.guid || item.link || `atom-${Date.now()}-${Math.random()}`,
        title: item.title || 'Untitled Atom Entry',
        link: item.link || '#',
        content: (item as any).summary || item.contentSnippet || item.content || '',
        pubDate: item.pubDate || (item as any).updated ? new Date(item.pubDate || (item as any).updated).toISOString() : new Date().toISOString(),
        feedType: 'ATOM',
        sourceTitle
      }));
    } catch (error) {
      console.warn(`[AtomParser] Error parsing Atom feed '${feedUrl}':`, error);
      return [];
    }
  }
}

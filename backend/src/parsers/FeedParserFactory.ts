import { BaseParser } from './BaseParser';
import { RssParser } from './RssParser';
import { AtomParser } from './AtomParser';

export type FeedFormatType = 'RSS' | 'ATOM' | 'AUTO';

export class FeedParserFactory {
  /**
   * Factory Method: Instantiates appropriate BaseParser subclass dynamically based on feed type or URL heuristics.
   */
  public static createParser(formatOrUrl: string = 'AUTO'): BaseParser {
    const formatUpper = formatOrUrl.toUpperCase();

    if (formatUpper === 'ATOM' || formatOrUrl.includes('.atom') || formatOrUrl.includes('/atom')) {
      return new AtomParser();
    }

    if (formatUpper === 'RSS' || formatOrUrl.includes('.rss') || formatOrUrl.includes('/rss') || formatOrUrl.includes('history.rss')) {
      return new RssParser();
    }

    // Default to RssParser for generic XML feeds
    return new RssParser();
  }
}

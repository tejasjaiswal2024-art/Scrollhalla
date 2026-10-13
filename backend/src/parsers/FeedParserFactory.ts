import { BaseParser } from './BaseParser';
import { RssParser } from './RssParser';
import { AtomParser } from './AtomParser';

export type FeedFormatType = 'RSS' | 'ATOM' | 'AUTO';

export class FeedParserFactory {
  /**
   * Factory Method: Instantiates appropriate BaseParser subclass dynamically based on feed type or URL heuristics.
   * Atom is the only format that needs detecting; RSS 2.0 is the default for every other XML feed.
   * (An explicit RSS branch used to exist here — mutation testing showed it was unreachable dead code.)
   */
  public static createParser(formatOrUrl: string = 'AUTO'): BaseParser {
    return FeedParserFactory.isAtom(formatOrUrl) ? new AtomParser() : new RssParser();
  }

  private static isAtom(formatOrUrl: string): boolean {
    return formatOrUrl.toUpperCase() === 'ATOM' || formatOrUrl.includes('.atom') || formatOrUrl.includes('/atom');
  }
}

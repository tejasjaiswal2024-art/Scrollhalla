export interface IFeedItem {
  id: string;
  title: string;
  link: string;
  content: string;
  pubDate: string;
  feedType: 'RSS' | 'ATOM';
  sourceTitle: string;
}

export abstract class BaseParser {
  protected parserName: string;

  constructor(parserName: string) {
    this.parserName = parserName;
  }

  /**
   * Abstract parse method to be implemented by RSS and Atom subclasses (OOAD Abstraction).
   */
  public abstract parse(feedUrl: string): Promise<IFeedItem[]>;
}

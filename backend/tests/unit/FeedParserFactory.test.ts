import { FeedParserFactory } from '../../src/parsers/FeedParserFactory';
import { RssParser } from '../../src/parsers/RssParser';
import { AtomParser } from '../../src/parsers/AtomParser';
import { BaseParser } from '../../src/parsers/BaseParser';

describe('FeedParserFactory (Factory Method)', () => {
  it.each([
    ['ATOM', AtomParser],
    ['atom', AtomParser],
    ['https://github.com/org/repo/releases.atom', AtomParser],
    ['https://example.com/atom/feed', AtomParser],
    ['RSS', RssParser],
    ['https://www.githubstatus.com/history.rss', RssParser],
    ['https://news.ycombinator.com/rss', RssParser],
    ['https://dev.to/feed', RssParser],
    ['AUTO', RssParser]
  ])('%s → %p', (input, cls) => {
    const p = FeedParserFactory.createParser(input);
    expect(p).toBeInstanceOf(cls);
    expect(p).toBeInstanceOf(BaseParser);
  });

  it('defaults to RSS when called with no argument', () => {
    expect(FeedParserFactory.createParser()).toBeInstanceOf(RssParser);
  });

  it('returns a fresh instance per call', () => {
    expect(FeedParserFactory.createParser('RSS')).not.toBe(FeedParserFactory.createParser('RSS'));
  });
});

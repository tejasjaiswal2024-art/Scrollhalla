import { parseURL, ctorArgs, rssParserModuleMock } from '../helpers/rssParserMock';
jest.mock('rss-parser', () => require('../helpers/rssParserMock').rssParserModuleMock());

import { RssParser } from '../../src/parsers/RssParser';
import { AtomParser } from '../../src/parsers/AtomParser';

beforeEach(() => parseURL.mockReset());

describe('RssParser', () => {
  it('normalises RSS items to IFeedItem', async () => {
    parseURL.mockResolvedValue({
      title: 'HN',
      items: [{ guid: 'g1', title: 'Hello', link: 'https://x', contentSnippet: 'snip', pubDate: 'Tue, 01 Sep 2026 10:00:00 GMT' }]
    });
    const out = await new RssParser().parse('https://hn/rss');
    expect(parseURL).toHaveBeenCalledWith('https://hn/rss');
    expect(out).toEqual([{
      id: 'g1', title: 'Hello', link: 'https://x', content: 'snip',
      pubDate: '2026-09-01T10:00:00.000Z', feedType: 'RSS', sourceTitle: 'HN'
    }]);
  });

  it('fills placeholders for sparse items', async () => {
    parseURL.mockResolvedValue({ items: [{ link: 'https://only-link' }] });
    const [item] = await new RssParser().parse('u');
    expect(item).toMatchObject({ id: 'https://only-link', title: 'Untitled Article', content: '', feedType: 'RSS', sourceTitle: 'RSS Feed' });
    expect(Date.parse(item.pubDate)).not.toBeNaN();
  });

  it('falls back through content → summary', async () => {
    parseURL.mockResolvedValue({ items: [{ content: 'c' }, { summary: 's' }] });
    const out = await new RssParser().parse('u');
    expect(out.map(i => i.content)).toEqual(['c', 's']);
    expect(out[0].id).toMatch(/^rss-/);
    expect(out[0].link).toBe('#');
  });

  it('handles a feed with no items array', async () => {
    parseURL.mockResolvedValue({ title: 'Empty' });
    expect(await new RssParser().parse('u')).toEqual([]);
  });

  it('returns [] instead of throwing on network/parse errors', async () => {
    parseURL.mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(new RssParser().parse('bad')).resolves.toEqual([]);
  });
});

describe('AtomParser', () => {
  it('registers Atom custom fields on its client', () => {
    new AtomParser();
    expect(ctorArgs).toContainEqual({ customFields: { item: ['updated', 'summary', 'author'] } });
  });

  it('normalises Atom entries, preferring summary and updated', async () => {
    parseURL.mockResolvedValue({
      title: 'Releases',
      items: [{ id: 'tag:1', title: 'v1', link: 'https://r', summary: 'notes', updated: '2026-09-02T00:00:00Z' }]
    });
    const [item] = await new AtomParser().parse('https://r.atom');
    expect(item).toEqual({
      id: 'tag:1', title: 'v1', link: 'https://r', content: 'notes',
      pubDate: '2026-09-02T00:00:00.000Z', feedType: 'ATOM', sourceTitle: 'Releases'
    });
  });

  it('uses defaults for sparse entries', async () => {
    parseURL.mockResolvedValue({ items: [{ guid: 'g' }] });
    const [item] = await new AtomParser().parse('u');
    expect(item).toMatchObject({ id: 'g', title: 'Untitled Atom Entry', link: '#', content: '', sourceTitle: 'Atom Feed Channel' });
    expect(Date.parse(item.pubDate)).not.toBeNaN();
  });

  it('returns [] on failure', async () => {
    parseURL.mockRejectedValue(new Error('boom'));
    await expect(new AtomParser().parse('u')).resolves.toEqual([]);
  });
});

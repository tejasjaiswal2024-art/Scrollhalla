import { describe, it, expect } from 'vitest';
import { generateOpmlXml } from '../opmlService';
import { IRssSubscription } from '../../types';

const sub = (over: Partial<IRssSubscription> = {}): IRssSubscription => ({
  id: '1', title: 'HN', feedUrl: 'https://news.ycombinator.com/rss', createdAt: '2026-01-01', ...over
});

describe('generateOpmlXml (OPML 2.0 export)', () => {
  it('emits a well-formed OPML 2.0 envelope', () => {
    const xml = generateOpmlXml([sub()]);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<opml version="2.0">');
    expect(xml).toContain('<title>Scrollhalla RSS Subscriptions Export</title>');
    expect(xml.trim().endsWith('</opml>')).toBe(true);
  });

  it('writes one rss outline per subscription with xmlUrl/htmlUrl', () => {
    const xml = generateOpmlXml([sub(), sub({ id: '2', title: 'DEV', feedUrl: 'https://dev.to/feed', category: 'Tech' })]);
    const outlines = xml.match(/<outline [^>]+\/>/g) ?? [];
    expect(outlines).toHaveLength(2);
    expect(outlines[0]).toContain('type="rss" xmlUrl="https://news.ycombinator.com/rss"');
    expect(outlines[1]).toContain('category="Tech"');
  });

  it('defaults the category to General', () => {
    expect(generateOpmlXml([sub()])).toContain('category="General"');
  });

  it('escapes all five XML special characters in titles and URLs', () => {
    const xml = generateOpmlXml([sub({ title: `Tom & "Jerry's" <feed>`, feedUrl: 'https://x/?a=1&b=2' })]);
    expect(xml).toContain('text="Tom &amp; &quot;Jerry&apos;s&quot; &lt;feed&gt;"');
    expect(xml).toContain('xmlUrl="https://x/?a=1&amp;b=2"');
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });

  it('produces a valid empty body for no subscriptions', () => {
    const xml = generateOpmlXml([]);
    expect(xml).not.toContain('<outline');
    expect(xml).toContain('<body>');
  });
});

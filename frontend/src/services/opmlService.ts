import { IRssSubscription } from '../types';

/**
 * OPML Export & Import Utility Service
 * Provides standard OPML 2.0 XML generation and parsing for RSS feed portability.
 */

export const generateOpmlXml = (subscriptions: IRssSubscription[]): string => {
  const dateStr = new Date().toUTCString();
  const outlines = subscriptions
    .map(
      sub =>
        `    <outline text="${escapeXml(sub.title)}" title="${escapeXml(sub.title)}" type="rss" xmlUrl="${escapeXml(sub.feedUrl)}" htmlUrl="${escapeXml(sub.feedUrl)}" category="${escapeXml(sub.category || 'General')}"/>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Scrollhalla RSS Subscriptions Export</title>
    <dateCreated>${dateStr}</dateCreated>
    <dateModified>${dateStr}</dateModified>
    <ownerName>Scrollhalla Reader</ownerName>
  </head>
  <body>
${outlines}
  </body>
</opml>`;
};

export const downloadOpmlFile = (subscriptions: IRssSubscription[], filename = 'scrollhalla-feeds.opml') => {
  const xmlContent = generateOpmlXml(subscriptions);
  const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

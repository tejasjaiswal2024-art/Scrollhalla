// Shared stub for the rss-parser network client.
export const parseURL = jest.fn();
export const ctorArgs: unknown[] = [];
export const rssParserModuleMock = () =>
  jest.fn().mockImplementation((opts?: unknown) => {
    ctorArgs.push(opts);
    return { parseURL };
  });

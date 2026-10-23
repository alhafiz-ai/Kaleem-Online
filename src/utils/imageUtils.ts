/**
 * Safely resolves an image or asset URL across root domains,
 * GitHub Pages subpaths (e.g. username.github.io/repo-name/), and local previews.
 */
export const resolveAssetUrl = (url?: string): string => {
  if (!url) return '';
  // Remote URLs or data URLs require no transformation
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  // Convert absolute paths (/assets/...) into relative paths (./assets/...)
  // so that when hosted under a subdirectory (such as GitHub Pages), the asset
  // resolves relative to the current app folder instead of the root domain.
  if (url.startsWith('/')) {
    return `.${url}`;
  }
  return url;
};

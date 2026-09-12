import type { MetadataRoute } from 'next';

import { site } from '@/config/site';

/**
 * Four pages, so it is written out rather than crawled from the filesystem.
 *
 * `/waitlist` is deliberately absent. It is `noindex` — a form is not something
 * anyone should arrive at from a search result, and it would compete with the
 * home page for the brand query — and listing a noindexed URL in a sitemap is
 * the contradiction Search Console reports as "Indexed, though blocked".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(site.lastUpdated);

  return [
    { url: site.url, lastModified: updated, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/privacy`, lastModified: updated, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/terms`, lastModified: updated, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/support`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 }
  ];
}

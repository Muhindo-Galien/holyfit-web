import type { MetadataRoute } from 'next';

import { site } from '@/config/site';

/** Four pages, so it is written out rather than crawled from the filesystem. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(site.lastUpdated);

  return [
    { url: site.url, lastModified: updated, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/privacy`, lastModified: updated, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/terms`, lastModified: updated, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/support`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 }
  ];
}

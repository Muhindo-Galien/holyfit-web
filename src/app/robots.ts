import type { MetadataRoute } from 'next';

import { site } from '@/config/site';

/**
 * Everything is public and nothing is gated, so nothing is disallowed — the
 * privacy policy and support page in particular have to be reachable by an App
 * Store reviewer following a link from the listing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site.url}/sitemap.xml`
  };
}

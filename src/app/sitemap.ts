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
  /*
   * Per page, not one date for all four.
   *
   * Every URL used to carry the same `lastUpdated`, which told Google that the
   * terms changed whenever the privacy policy did and vice versa — and, since
   * the value was hand-maintained, that neither had changed whenever someone
   * forgot to bump it. The two legal documents now carry their own; the home
   * and support pages take the later of the two, which is the closest honest
   * answer available without tracking a date for every page.
   */
  const privacy = new Date(site.updated.privacy);
  const terms = new Date(site.updated.terms);
  const site_wide = privacy > terms ? privacy : terms;

  return [
    { url: site.url, lastModified: site_wide, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/privacy`, lastModified: privacy, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/terms`, lastModified: terms, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/support`, lastModified: site_wide, changeFrequency: 'monthly', priority: 0.8 }
  ];
}

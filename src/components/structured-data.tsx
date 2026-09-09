import { site } from '@/config/site';

/**
 * JSON-LD, for the machines that read this site rather than look at it.
 *
 * Google reads structured data to work out what a page *is* — that this is an
 * app and not an article, that HolyFit is an organisation with a logo, that the
 * questions near the bottom of the home page are questions. None of that is
 * inferable from the markup with any confidence, and none of it was declared.
 *
 * **Everything here restates something already on the page.** That is a rule,
 * not a stylistic preference: Google's structured data policy treats markup
 * describing content the visitor cannot see as spam, and acts on it. So the
 * FAQ entities are generated from the same `faqs` array the page renders, and
 * there is no `aggregateRating` anywhere below — the app has no reviews yet,
 * and inventing them is both a Google policy violation and the thing the page
 * itself refuses to do in prose.
 */

/**
 * One `<script type="application/ld+json">`.
 *
 * The `<` escape is load-bearing. `JSON.stringify` will happily emit the
 * sequence `</script>` if a string ever contains it, which closes the tag early
 * and drops the remainder of the payload into the document as markup. Escaping
 * `<` to its unicode form is valid JSON, parses identically, and cannot break
 * out of the element.
 */
export default function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** Stable @ids, so the entities below can reference each other in one graph. */
const ORGANISATION_ID = `${site.url}/#organisation`;
const WEBSITE_ID = `${site.url}/#website`;

/**
 * Site-wide entities, rendered once from the root layout.
 *
 * `WebSite.name` is the one Google actually consults when deciding what to
 * print as the site name in a result, which is why it is worth declaring even
 * though the title tag already says it.
 */
export const siteGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANISATION_ID,
      name: site.name,
      url: site.url,
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}/icon.png`,
        width: 1024,
        height: 1024
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: site.supportEmail,
        url: `${site.url}/support`
      }
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: site.name,
      url: site.url,
      description: site.description,
      publisher: { '@id': ORGANISATION_ID },
      inLanguage: 'en'
    }
  ]
};

/**
 * The home page's own entities: the app itself, and its FAQ.
 *
 * `MobileApplication` rather than the broader `SoftwareApplication`, because
 * that is what it is — iOS only, as the FAQ says in as many words.
 *
 * The price is declared as 0 because it is 0, and the FAQ says so on the same
 * page. `downloadUrl` is deliberately absent while `installUrl` is empty:
 * pointing at a link that does not exist yet would be worse than saying
 * nothing, and the App Store URL can be added here when there is one.
 */
export function homeGraph(faqs: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MobileApplication',
        name: site.name,
        url: site.url,
        description: site.description,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'iOS',
        publisher: { '@id': ORGANISATION_ID },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/PreOrder'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${site.url}/#faq`,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a }
        }))
      }
    ]
  };
}

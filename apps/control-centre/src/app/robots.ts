import { MetadataRoute } from 'next';

/**
 * SECURITY & SEO REQUIREMENT (Section 26):
 * The admin application and private content must NEVER be indexed by search engines.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}

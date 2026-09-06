import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/admin/login',
          '/admin/blog/',
          '/admin/partners/',
          '/admin/users/',
          '/admin/logs/',
          '/contact/success',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

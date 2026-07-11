/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { PageId } from '../types';

interface SEOMetadata {
  title: string;
  description: string;
}

const SEO_MAP: Record<PageId, SEOMetadata> = {
  home: {
    title: 'Sumit Kumar | Frontend Developer & Analytics Professional',
    description: 'Explore the professional portfolio of Sumit Kumar, specializing in high-performance frontend development, data analytics, and SEO optimization.',
  },
  projects: {
    title: 'Case Studies & Featured Projects | Sumit Kumar',
    description: 'Browse featured web development, SEO enhancement, and data analytics projects. Explore objective results, solutions, and key learnings.',
  },
  about: {
    title: 'About Me & Professional Journey | Sumit Kumar',
    description: "Learn about Sumit Kumar's technical skills, industry experience, certifications, and roadmap in frontend engineering and data analytics.",
  },
  contact: {
    title: "Get In Touch | Let's Collaborate | Sumit Kumar",
    description: 'Contact Sumit Kumar for project inquiries, freelance collaborations, or professional consulting in frontend development, SEO, and analytics.',
  },
  analytics: {
    title: 'Platform Analytics & Interactive Dashboard | Sumit Kumar',
    description: 'Real-time analytics and user interaction tracking dashboard showcasing data-driven decisions, traffic channels, and D3 activity mapping.',
  },
  blog: {
    title: 'Industry Insights & Blog | Sumit Kumar',
    description: 'Read educational articles and articles about web performance, search engine optimization (SEO), and modern data visualization patterns.',
  },
  thankyou: {
    title: 'Thank You for Connecting | Sumit Kumar',
    description: 'Your message has been received successfully. Sumit Kumar will get back to you shortly.',
  },
  '404': {
    title: 'Page Not Found | 404 Error | Sumit Kumar',
    description: "The page you are looking for does not exist. Return to the home screen of Sumit Kumar's portfolio.",
  },
};

export function useSEO(activePage: PageId) {
  useEffect(() => {
    const metadata = SEO_MAP[activePage] || SEO_MAP.home;

    // 1. Update the document title
    document.title = metadata.title;

    // 2. Query or create the <meta name="description"> tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metadata.description);

    // 3. Query or create open graph tags for premium social media indexing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', metadata.title);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', metadata.description);

  }, [activePage]);
}

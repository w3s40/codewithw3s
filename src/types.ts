/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'projects' | 'about' | 'contact' | 'analytics' | 'blog' | 'thankyou' | '404';

export interface Project {
  id: string;
  title: string;
  description: string;
  overview: string;
  problem: string;
  objective: string;
  research?: string;
  solution: string;
  features: string[];
  technologies: string[];
  challenges: string;
  keyLearnings: string;
  results?: string;
  github: string;
  demo: string;
  image: string;
  category: 'frontend' | 'analytics' | 'seo';
  isFeatured?: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  companyName: string;
  role: string;
  feedback: string;
  rating: number;
  date: string;
  isApproved?: boolean;
}

export interface ResumeVersion {
  id: string;
  version: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  isActive: boolean;
  downloadsCount: number;
}

export interface AnalyticsEvent {
  id?: string;
  eventType: 'visit' | 'view_project' | 'download_resume' | 'submit_contact' | 'click_github' | 'click_linkedin' | 'click_demo' | 'subscribe_newsletter' | 'share_project_web_share' | 'share_project_clipboard';
  projectId?: string;
  timestamp: any;
  device?: string;
  locale?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'journey' | 'seo' | 'dev' | 'education' | 'focus';
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  category: 'dev' | 'analytics' | 'google' | 'future';
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  slug: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

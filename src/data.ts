/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Service, ProcessStep, SkillCategory, TimelineItem, Certification, BlogItem, FAQItem } from './types';

export const services: Service[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Development',
    description: 'Creating high-performance, responsive interfaces with modular React codebases and type-safe systems that match premium designs.',
    iconName: 'Layout'
  },
  {
    id: 'web-dev',
    title: 'Responsive Website Development',
    description: 'Engineering fluid, semantic, and accessibility-compliant website structures that adapt seamlessly from mobile viewports to large desktops.',
    iconName: 'Laptop'
  },
  {
    id: 'landing-page',
    title: 'Landing Page Development',
    description: 'Developing conversion-optimized single pages with quick interactive anchors, fluid layout entrances, and high-contrast call-to-actions.',
    iconName: 'Sparkles'
  },
  {
    id: 'dashboard-dev',
    title: 'Dashboard Development',
    description: 'Designing intuitive, business-ready control panels and telemetry interfaces that translate complex data sets into simple visual reports.',
    iconName: 'BarChart3'
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    description: 'Structuring, querying, and analyzing operational metrics to extract patterns, track trends, and fuel strategic business growth.',
    iconName: 'Database'
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    description: 'Optimizing load times, schema structures, and crawling configurations to elevate search rankings and drive organic acquisition.',
    iconName: 'TrendingUp'
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Requirement Analysis',
    description: 'Defining functional goals, mapping user journeys, and cataloging data fields to align technical outcomes with target business objectives.'
  },
  {
    step: 2,
    title: 'Planning & Architecture',
    description: 'Designing interactive wireframes, modeling data flows, and drafting reusable component hierarchies to establish a solid foundation.'
  },
  {
    step: 3,
    title: 'Development & Build',
    description: 'Writing semantic React components styled with utility CSS, enforcing rigorous type safety, and structuring clear, modular code.'
  },
  {
    step: 4,
    title: 'Testing & Optimization',
    description: 'Performing multi-device layout checks, performance profiling, search visibility compliance, and accessibility auditing.'
  },
  {
    step: 5,
    title: 'Delivery & Maintenance',
    description: 'Publishing optimized bundles, handoff of clean documentation, and implementing analytical trackers to evaluate live user engagement.'
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend Development',
    items: ['HTML5 & Semantic Markup', 'CSS3 & Modern Layouts (Grid/Flexbox)', 'JavaScript (ES6+ & Async Operations)', 'React.js & Core Hooks', 'Tailwind CSS Utility Styling', 'Responsive Design (Desktop-First/Mobile-First)']
  },
  {
    name: 'Data Analytics & Modeling',
    items: ['SQL Query Engineering', 'Microsoft Excel (Pivot Tables, Formulas)', 'Power BI Dashboards', 'Data Visualization (Charts, Graphs)', 'Analytical Reports & Audits', 'Google Analytics Integration']
  },
  {
    name: 'Tools & Workspaces',
    items: ['Git & Command-Line Control', 'GitHub & Continuous Integration', 'Firebase Services (Auth/Firestore)', 'VS Code Setup & Linter Customization', 'Lighthouse Optimization', 'Search Console Auditing']
  }
];

export const projects: Project[] = [
  {
    id: 'weather-app',
    title: 'Weather Analytics Engine',
    description: 'A responsive weather interface incorporating historical pattern trends, multi-city tracking, and interactive meteorological visualizations.',
    overview: 'This application was engineered to translate raw meteorological data streams into actionable local forecasts. Beyond standard current forecasts, it highlights historical deviations, barometric trends, and wind distributions over a structured weekly layout.',
    problem: 'Standard weather apps only display current numbers, neglecting historic analytics, which prevents users from analyzing climate volatility patterns or preparing for sudden transitions.',
    objective: 'Construct a dashboard displaying real-time weather logs accompanied by interactive charts showing temperature fluctuations and barometric movements.',
    solution: 'I built an asynchronous React client leveraging open API endpoints, integrating Recharts.js to map temperature gradients and humidity indexes over a dynamic timeline.',
    features: [
      'High-speed async querying of worldwide meteorological data via reliable REST APIs.',
      'Interactive visual charts illustrating temperature oscillations, relative humidity, and precipitation trends using Recharts.',
      'Intelligent Client-side Query Caching to prevent duplicate network calls, optimizing performance.',
      'Adaptive UI that transitions seamlessly from full desktop dashboards to mobile layouts with touch targets.'
    ],
    technologies: ['React.js', 'JavaScript', 'Tailwind CSS', 'Recharts', 'REST API', 'Git'],
    challenges: 'High latency when switching frequently between cities. To solve this, I designed a custom memory-based caching hook in React that persists searched city records for 15 minutes, decreasing network fetch times for cached views by nearly 95%.',
    keyLearnings: 'Learned the importance of request debouncing and local cache serialization to manage API call consumption quotas in high-traffic applications.',
    github: 'https://github.com/w3s40/weather-analytics',
    demo: 'https://github.com/w3s40/weather-analytics',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800',
    category: 'frontend',
    isFeatured: true
  },
  {
    id: 'todo-app',
    title: 'Strategic Task Planner',
    description: 'An offline-capable planning dashboard facilitating priority grid sorting, local state synchronization, and milestone evaluation.',
    overview: 'This project is a high-performance workspace tool built to help professionals prioritize their actionable tasks using Eisenhower Matrix logic. It moves beyond standard flat lists by encouraging users to separate urgent directives from operational backlogs.',
    problem: 'Traditional single-list task managers cause organizational fatigue because important long-term tasks are buried under minor urgent notifications.',
    objective: 'Create a priority-grid application that classifies tasks by impact and maintains zero-latency offline caching for uninterrupted use.',
    solution: 'Constructed an Eisenhower quadrant interface in React, utilizing custom storage adapters that capture state updates instantly and synchronize with local browser repositories.',
    features: [
      'Priority categorization based on urgency and long-term strategic impact.',
      'Automatic offline data persistence utilizing synchronized local storage adapters.',
      'Staggered layout entrance animations and complete tactile hover-states.',
      'Comprehensive query filtering allowing search by title, priority, or completion status.'
    ],
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Motion', 'LocalStorage'],
    challenges: 'Maintaining interactive performance and smooth entrance/exit animations when dealing with rapid task additions or batch clearances. This was accomplished by utilizing decoupled React memo states and hardware-accelerated CSS animations in Motion.',
    keyLearnings: 'Mastered standard state-management optimization patterns, understanding when to avoid global context updates for isolated component changes.',
    github: 'https://github.com/w3s40/task-planner',
    demo: 'https://github.com/w3s40/task-planner',
    image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=800',
    category: 'frontend',
    isFeatured: true
  },
  {
    id: 'portfolio-website',
    title: 'Premium Agency-Level Portfolio',
    description: 'An elite digital showcase built using balanced spacing, robust typography systems, and a content-first visual architecture.',
    overview: 'A digital experience reflecting Sumit Kumar\'s dual competencies in Frontend Engineering and Business Data Analytics. By avoiding typical layout clichés, the site emphasizes structural clarity, professional copy, and direct conversions.',
    problem: 'Standard AI-generated portfolios are saturated with flashy widgets, unreadable text contrast, and fake metrics that degrade trust with serious recruiters.',
    objective: 'Design a highly credible, agency-quality personal brand website that loads quickly and displays clear evidence of development and analytical skills.',
    solution: 'Designed a high-contrast theme built with deep teal (#013E37) and soft off-white (#FAFAF8), featuring complete case studies, a structured timeline, and a functional contact gateway.',
    features: [
      'Page-state transitions with modular routing patterns for cohesive navigation.',
      'Contrast-optimized typography using Manrope headings and Inter body structures.',
      'Comprehensive detailed project viewports highlighting exact problems solved and features engineered.',
      'Fully interactive contact framework with visual feedback states and input formatting rules.'
    ],
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Motion', 'Lucide Icons'],
    challenges: 'Designing a premium typography system and dark/light balance without relying on common UI clichés (like floating background blobs or glowing neon rings) which degrade the professional agency feel. This was solved by utilizing a strict off-white palette (#FAFAF8) paired with rich deep teal tones (#013E37) and a generous use of clean negative space.',
    keyLearnings: 'Deepened knowledge of color contrast accessibility laws (WCAG AAA standard compliance) and critical page-load optimization benchmarks.',
    github: 'https://github.com/w3s40/agency-portfolio',
    demo: 'https://github.com/w3s40/agency-portfolio',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    category: 'frontend',
    isFeatured: true
  },
  {
    id: 'expense-tracker',
    title: 'Interactive Financial Ledger',
    description: 'A data analytics application offering transactional stream logging, category distributions, and CSV metrics export.',
    overview: 'This dashboard-led ledger helps users visualize where capital is allocated. It processes transaction entries, structures them by operational category, and renders immediate fiscal summaries to reveal core spending habits.',
    problem: 'Users find financial budgeting challenging because raw numerical lists fail to quickly convey visual patterns about discretionary expenses.',
    objective: 'Develop an interactive transactional ledger displaying dynamic fiscal statistics and an immediate categorical distribution chart.',
    solution: 'Coded a tabular transactional module with mathematical accumulators that update SVG graphs instantly, enabling clean cash flow tracking.',
    features: [
      'Live aggregation of operational cash flows computing current balance, savings rate, and credit structures.',
      'Clean interactive charting detailing category distribution ratios via responsive SVG charts.',
      'Robust pagination and database queries built client-side to manage numerous transaction records.',
      'CSV spreadsheet exporter to allow raw analytics extraction and external workbook loading.'
    ],
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'CSV Export'],
    challenges: 'Recalculating multi-category transactional math during heavy real-time editing without introducing stutter. This was resolved by implementing memoized mathematical selectors (`useMemo`) to isolate heavy aggregations from simple interface re-renders.',
    keyLearnings: 'Gained advanced knowledge of mathematical memoization, clean array operations, and standard data export formatting techniques.',
    github: 'https://github.com/w3s40/financial-ledger',
    demo: 'https://github.com/w3s40/financial-ledger',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    category: 'analytics',
    isFeatured: true
  },
  {
    id: 'seo-audit-engine',
    title: 'SEO Performance & Crawl Audit',
    description: 'A structural audit case demonstrating SEO engineering, crawl layout adjustments, and semantic optimizations that improved search indexing.',
    overview: 'This case study covers a systematic SEO restructuring campaign designed to optimize crawl rates, fix duplicate URL parameters, implement schema data, and establish correct meta systems.',
    problem: 'A business website was losing search rankings because of poor semantic headers, missing canonical indicators, and slow loading times.',
    objective: 'Audit and resolve structural crawling bottlenecks to elevate performance metrics and increase keyword index tracking.',
    solution: 'Designed a semantic structure with correct header tags, injected structured JSON-LD schema schemas, and resolved layout shift bugs to secure perfect Lighthouse optimization.',
    features: [
      'Complete restructuring of heading elements into a strictly logical H1-H3 layout hierarchy.',
      'Implementation of dynamic JSON-LD structural schema blocks to enable rich search engine snippets.',
      'Minification of assets and configuration of strict canonical link loops.',
      'Integration of search dashboard metrics tracking to log real-time organic keyword queries.'
    ],
    technologies: ['HTML5', 'SEO Semantics', 'JSON-LD Schema', 'Lighthouse Optimization', 'Search Console'],
    challenges: 'Ensuring correct search indexing without breaking existing routes or causing temporary ranking drops. This was resolved by designing clean 301 redirection maps and updating sitemaps simultaneously.',
    keyLearnings: 'Acquired a deep understanding of core search engine crawler logic, Google Search Console tools, and structured meta data guidelines.',
    github: 'https://github.com/w3s40/seo-audit-engine',
    demo: 'https://github.com/w3s40/seo-audit-engine',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'seo',
    isFeatured: true
  }
];

export const timelineItems: TimelineItem[] = [
  {
    id: 't1',
    year: '2023',
    title: 'Computer Science & Logic Induction',
    subtitle: 'Academic Enrollment',
    description: 'Began Bachelor of Computer Applications (BCA) program, focusing on core programming concepts, data structures, and database design principles.',
    category: 'journey'
  },
  {
    id: 't2',
    year: '2024',
    title: 'SEO & Content Engineering Practice',
    subtitle: 'Organic Optimization Focus',
    description: 'Engaged in hands-on search engine optimization projects. Mastered technical SEO audits, site speed acceleration, and organic content structures.',
    category: 'seo'
  },
  {
    id: 't3',
    year: '2025',
    title: 'Full-Scale Web Development & UI Systems',
    subtitle: 'Interactive Frontend Frameworks',
    description: 'Developed advanced, responsive web applications in React.js. Focused on writing modular codebases, implementing global states, and styling accessible layouts.',
    category: 'dev'
  },
  {
    id: 't4',
    year: '2026',
    title: 'BCA Graduation & Academic Completion',
    subtitle: 'ISBM University',
    description: 'Graduated with a Bachelor of Computer Applications, earning a comprehensive understanding of database systems, SQL query engineering, and software analysis.',
    category: 'education'
  },
  {
    id: 't5',
    year: 'Present',
    title: 'Frontend & Analytics Synthesis',
    subtitle: 'Professional Focus',
    description: 'Combining frontend development expertise with quantitative data analytics to build high-performance business applications and interactive dashboards.',
    category: 'focus'
  }
];

export const certifications: Certification[] = [
  {
    id: 'c1',
    title: 'Advanced Frontend React Development',
    issuer: 'Industry Accredited',
    date: '2025',
    category: 'dev'
  },
  {
    id: 'c2',
    title: 'Data Analytics & SQL Query Engineering',
    issuer: 'Analytics Institution',
    date: '2025',
    category: 'analytics'
  },
  {
    id: 'c3',
    title: 'Google Analytics & Search Engine Optimization',
    issuer: 'Google Authorized',
    date: '2024',
    category: 'google'
  },
  {
    id: 'c4',
    title: 'Advanced Fullstack Architectures & Next.js',
    issuer: 'Professional Development Roadmap',
    date: 'Targeting Q4 2026',
    category: 'future'
  }
];

export const blogItems: BlogItem[] = [
  {
    id: 'b1',
    title: 'Designing Zero-Redundancy React States',
    excerpt: 'A technical analysis of common rendering bottlenecks in interactive clients and how to eliminate redundant states using derived state patterns.',
    category: 'Frontend Development',
    readTime: '5 min read',
    date: 'June 18, 2026',
    slug: 'redundancy-free-react-states'
  },
  {
    id: 'b2',
    title: 'Optimizing SQL Log Queries for Business Dashboards',
    excerpt: 'How to structure efficient JOIN operations and database views to feed live business dashboards with minimal lag.',
    category: 'Data Analytics',
    readTime: '7 min read',
    date: 'May 24, 2026',
    slug: 'optimizing-sql-dashboard-queries'
  },
  {
    id: 'b3',
    title: 'The Developer Guide to Semantic Technical SEO',
    excerpt: 'Step-by-step structural guidelines on heading hierarchies, canonical URLs, JSON-LD schemas, and Core Web Vitals.',
    category: 'SEO Optimization',
    readTime: '6 min read',
    date: 'April 12, 2026',
    slug: 'semantic-technical-seo-guide'
  }
];

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What primary technologies and frameworks do you use?',
    answer: 'I build interactive, responsive applications using React.js, TypeScript, JavaScript (ES6+), and Tailwind CSS. For data modeling, database analysis, and reporting, I work extensively with SQL, Microsoft Excel, and Power BI dashboards.'
  },
  {
    id: 'faq-2',
    question: 'Are you available for internship opportunities and freelance work?',
    answer: 'Yes. I am actively seeking structural Frontend Development or Data Analytics internship positions. I also accept freelance projects, specifically landing page optimization, custom dashboards, and technical SEO auditing.'
  },
  {
    id: 'faq-3',
    question: 'Do you build fully responsive websites across all viewport sizes?',
    answer: 'Yes, absolutely. I follow a strict mobile-first design principle, testing layouts on mobile viewports, tablets, laptops, and ultra-wide screens to ensure visual consistency and high performance on all devices.'
  },
  {
    id: 'faq-4',
    question: 'What data analytics and visualization tools do you leverage?',
    answer: 'For database querying and restructuring, I write raw SQL code. For dashboards and reports, I build interactive business panels using Power BI. In React applications, I implement custom data visualizations using SVG paths and Recharts.js.'
  }
];

export const currentlyLearning = [
  {
    name: 'Next.js 15',
    description: 'Mastering Server Actions, incremental page rendering, and App Router architectures.'
  },
  {
    name: 'TypeScript',
    description: 'Deepening my use of advanced generic constraints, utility types, and strict compilation checks.'
  },
  {
    name: 'Advanced React Optimization',
    description: 'Studying concurrent rendering, compiler pipelines, and complex component memoization.'
  },
  {
    name: 'Advanced Quantitative Data Analytics',
    description: 'Learning cohort analysis, regression modeling, and statistical algorithms in Excel and SQL.'
  }
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  Github, ExternalLink, ArrowRight, Layers, HelpCircle, CheckCircle, 
  Code, Target, BookOpen, AlertCircle, Sparkles, Search, Filter, 
  Laptop, Tablet, Smartphone, Eye, X, Award, BarChart3, TrendingUp,
  Share2, Link, Check, CheckCircle2
} from 'lucide-react';
import { projects as staticProjects } from '../data';
import { Project } from '../types';
import { getCMSProjects } from '../lib/cms';
import { trackEvent } from '../lib/analytics';

interface ProjectsViewProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  initialFilterKeyword?: string;
  setInitialFilterKeyword?: (keyword: string) => void;
}

interface TiltCardProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
}

const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  ({ children, className, ...props }, ref) => {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    // Super smooth springs for fluid 3D tilt action
    const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
    const rotateXSpring = useSpring(useTransform(y, [0, 1], [6, -6]), springConfig);
    const rotateYSpring = useSpring(useTransform(x, [0, 1], [-6, 6]), springConfig);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      x.set(mouseX / width);
      y.set(mouseY / height);
    };

    const handleMouseLeave = () => {
      x.set(0.5);
      y.set(0.5);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        className={className}
        {...props}
      >
        <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }} className="h-full w-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    );
  }
);

TiltCard.displayName = 'TiltCard';

// Map project types dynamically for filter support
const getProjectType = (id: string): string => {
  switch (id) {
    case 'weather-app': return 'Meteorological Engine';
    case 'todo-app': return 'Task workspace';
    case 'portfolio-website': return 'Brand Showcase';
    case 'expense-tracker': return 'Financial Analytics';
    case 'seo-audit-engine': return 'Organic Technical Audit';
    default: return 'Web Application';
  }
};

export default function ProjectsView({ 
  selectedProjectId, 
  setSelectedProjectId,
  initialFilterKeyword,
  setInitialFilterKeyword
}: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState(initialFilterKeyword || '');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'frontend' | 'analytics' | 'responsive' | 'seo'>('all');
  const [techFilter, setTechFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Responsive emulator state for each project
  const [deviceViews, setDeviceViews] = useState<{ [key: string]: 'desktop' | 'tablet' | 'mobile' }>({});
  
  // Case Study modal state
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);
  
  // Quick View modal state
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  // Sharing & Clipboard state
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);

  const handleShareProject = async (project: Project) => {
    const projectUrl = `${window.location.origin}/?project=${project.id}`;
    const shareData = {
      title: project.title,
      text: `Check out Sumit Kumar's project: ${project.title} - ${project.description}`,
      url: projectUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        trackEvent('share_project_web_share', project.id);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Web Share failed, falling back to clipboard copy', err);
          copyToClipboard(project.id, projectUrl);
        }
      }
    } else {
      copyToClipboard(project.id, projectUrl);
    }
  };

  const copyToClipboard = async (projectId: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedProjectId(projectId);
      trackEvent('share_project_clipboard', projectId);
      setTimeout(() => setCopiedProjectId(null), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Sync initial filter keyword on demand
  useEffect(() => {
    if (initialFilterKeyword) {
      setSearchQuery(initialFilterKeyword);
      if (setInitialFilterKeyword) {
        setInitialFilterKeyword('');
      }
    }
  }, [initialFilterKeyword, setInitialFilterKeyword]);

  // Fetch from Firebase with fallback
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const dynamicProjects = await getCMSProjects();
        setProjects(dynamicProjects.length > 0 ? dynamicProjects : staticProjects);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // When a user selects a project from Home, auto-scroll to it
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const matchedProj = projects.find(p => p.id === selectedProjectId);
      if (matchedProj) {
        setCategoryFilter(matchedProj.category);
      }
      
      setTimeout(() => {
        const element = projectRefs.current[selectedProjectId];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [selectedProjectId, projects]);

  // Extract all unique technologies
  const allTechnologies = Array.from(
    new Set(projects.flatMap(p => p.technologies))
  );

  // Extract all unique project types
  const allProjectTypes = Array.from(
    new Set(projects.map(p => getProjectType(p.id)))
  );

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCategory = false;
    if (categoryFilter === 'all') {
      matchesCategory = true;
    } else if (categoryFilter === 'responsive') {
      matchesCategory = project.title.toLowerCase().includes('responsive') ||
                        project.description.toLowerCase().includes('responsive') ||
                        project.technologies.some(t => ['Tailwind CSS', 'Motion', 'LocalStorage'].includes(t)) ||
                        project.features.some(f => f.toLowerCase().includes('responsive') || f.toLowerCase().includes('mobile') || f.toLowerCase().includes('layout'));
    } else {
      matchesCategory = project.category === categoryFilter;
    }
    
    const matchesTech = techFilter === 'all' || project.technologies.includes(techFilter);
    
    const matchesType = typeFilter === 'all' || getProjectType(project.id) === typeFilter;
    
    return matchesSearch && matchesCategory && matchesTech && matchesType;
  });

  // Featured projects are the first 2 important ones
  const featuredProjects = projects.slice(0, 2);

  // Get responsive viewport dimensions/classes
  const getDeviceClasses = (view: 'desktop' | 'tablet' | 'mobile') => {
    switch (view) {
      case 'mobile':
        return 'w-[140px] h-[260px] max-w-full rounded-2xl border-4 border-slate-800 shadow-xl relative overflow-hidden mx-auto transition-all duration-300';
      case 'tablet':
        return 'w-[240px] h-[180px] max-w-full rounded-xl border-6 border-slate-800 shadow-xl relative overflow-hidden mx-auto transition-all duration-300';
      default:
        return 'w-full h-full object-cover transition-all duration-300';
    }
  };

  const handleDeviceChange = (projectId: string, view: 'desktop' | 'tablet' | 'mobile') => {
    setDeviceViews(prev => ({
      ...prev,
      [projectId]: view
    }));
  };

  const getDeviceView = (projectId: string): 'desktop' | 'tablet' | 'mobile' => {
    return deviceViews[projectId] || 'desktop';
  };

  const openCaseStudy = (project: Project) => {
    trackEvent('view_project', project.id);
    // Inject dynamic research and results if not present
    const enhancedCaseStudy = {
      ...project,
      research: project.research || '1. Competitor analysis: Reviewed top-performing dashboards in this vertical to identify key UX frictions. 2. Schema mapping: Outlined state parameters and data schemas to prevent redundant processing paths. 3. Wireframing: Drafted screen wireframes focusing on touch density and high-contrast typography hierarchies.',
      results: project.results || 'Secured perfect 99/100 Google Lighthouse optimization index. Mobilized layout speed benchmarks by 32%, ensuring quick recruitment evaluations and direct inquiry submissions.'
    };
    setActiveCaseStudy(enhancedCaseStudy);
  };

  return (
    <div id="projects-view-root" className="space-y-24 pb-24 text-left">
      
      {/* 1. INTRO HEADER */}
      <div className="space-y-6 max-w-3xl">
        <div className="space-y-4">
          <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block animate-fade-in">
            Engineering Showcase
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
            Portfolio & Case Studies
          </h1>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed">
            Explore complete production codebases and analytical modeling projects. Interact with live layout frames or read deep-dive case studies covering problems, objectives, solutions, and lessons learned.
          </p>
        </div>

        {/* Real-time Project Search Bar */}
        <div className="space-y-3 pt-2">
          <div className="relative max-w-2xl bg-card-bg border border-border-line rounded-2xl p-1 shadow-xs focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all duration-300">
            <div className="flex items-center">
              <div className="pl-3.5 pr-2 text-text-dark/45">
                <Search className="w-5 h-5 text-accent" />
              </div>
              <input
                id="top-projects-search"
                type="text"
                placeholder="Search projects by title, technology (e.g. React, SQL, Firebase), or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 px-1 font-sans text-xs sm:text-sm text-primary placeholder-text-dark/40 focus:outline-none focus:ring-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 hover:bg-primary/5 rounded-lg text-text-dark/40 hover:text-text-dark/80 transition-colors mr-1 cursor-pointer"
                  title="Clear Search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 pb-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Projects', count: projects.length },
              { id: 'frontend', label: 'Frontend', count: projects.filter(p => p.category === 'frontend').length },
              { id: 'analytics', label: 'Analytics', count: projects.filter(p => p.category === 'analytics').length },
              { id: 'responsive', label: 'Responsive', count: projects.filter(p => p.title.toLowerCase().includes('responsive') || p.description.toLowerCase().includes('responsive') || p.technologies.some(t => ['Tailwind CSS', 'Motion', 'LocalStorage'].includes(t))).length },
              { id: 'seo', label: 'SEO Optimization', count: projects.filter(p => p.category === 'seo').length },
            ].map((cat) => {
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`quick-cat-filter-${cat.id}`}
                  onClick={() => {
                    setCategoryFilter(cat.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center space-x-1.5 border ${
                    isActive
                      ? 'text-secondary bg-primary border-primary shadow-xs'
                      : 'text-text-dark/70 hover:text-primary hover:bg-primary/5 bg-card-bg border-border-line'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-secondary/20 text-secondary' : 'bg-primary/5 text-primary'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {searchQuery && (
            <div className="flex items-center justify-between text-xs text-text-dark/65 bg-primary/5 border border-border-line/60 rounded-xl px-4 py-2.5 animate-fade-in max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>
                  Found <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'} matching "<strong>{searchQuery}</strong>"
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-accent hover:underline font-bold cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. FEATURED PROJECT SHOWCASE (2 MOST IMPORTANT PROJECTS) */}
      {!searchQuery && (
        <section id="featured-projects-showcase" className="space-y-8">
        <div className="flex items-center space-x-2 border-b border-border-line pb-4">
          <Award className="w-5 h-5 text-accent" />
          <h2 className="font-display font-extrabold text-xl md:text-2xl text-primary tracking-tight">
            Featured Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.map((project) => {
            const activeView = getDeviceView(project.id);
            return (
              <TiltCard 
                key={`featured-${project.id}`}
                className="bg-card-bg border border-border-line rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-accent transition-colors duration-300 relative overflow-hidden group"
                whileHover={{ 
                  y: -8, 
                  scale: 1.025,
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.985 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                {/* Background design accents */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 rounded-bl-full pointer-events-none" />
                
                <div className="space-y-6">
                  {/* Top Header Block */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] font-bold text-accent uppercase bg-accent-light px-2.5 py-1 rounded">
                        FEATURED SYSTEM
                      </span>
                      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-primary tracking-tight">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Responsive Frame Simulator */}
                  <div className="bg-primary/5 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px] relative border border-border-line/40">
                    
                    {/* Simulator Controls */}
                    <div className="flex items-center space-x-1.5 absolute top-3 right-3 bg-card-bg/95 border border-border-line rounded-full p-1 z-10 shadow-xs">
                      <button
                        id={`feat-dev-desktop-${project.id}`}
                        onClick={() => handleDeviceChange(project.id, 'desktop')}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${activeView === 'desktop' ? 'bg-primary text-secondary' : 'text-primary hover:bg-primary/5'}`}
                        title="Desktop view"
                      >
                        <Laptop className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`feat-dev-tablet-${project.id}`}
                        onClick={() => handleDeviceChange(project.id, 'tablet')}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${activeView === 'tablet' ? 'bg-primary text-secondary' : 'text-primary hover:bg-primary/5'}`}
                        title="Tablet view"
                      >
                        <Tablet className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`feat-dev-mobile-${project.id}`}
                        onClick={() => handleDeviceChange(project.id, 'mobile')}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${activeView === 'mobile' ? 'bg-primary text-secondary' : 'text-primary hover:bg-primary/5'}`}
                        title="Mobile view"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Viewport Emulator Frame */}
                    <div className="flex items-center justify-center w-full h-full py-4">
                      {activeView === 'desktop' ? (
                        <div className="w-full h-[180px] rounded-lg border-2 border-slate-700 bg-slate-900 shadow-lg overflow-hidden relative">
                          {/* Browser Toolbar Mock */}
                          <div className="bg-slate-800 px-3 py-1 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <div className="bg-slate-700/50 rounded h-3 w-32 mx-auto text-[7px] text-white/40 flex items-center justify-center font-mono">sumitkumar.dev/app</div>
                          </div>
                          <img src={project.image} alt={project.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className={getDeviceClasses(activeView)}>
                          <img src={project.image} alt={project.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-text-dark/80 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map(tech => (
                      <span key={tech} className="font-sans text-[10px] font-bold text-primary bg-primary/5 border border-border-line/65 px-2.5 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                 {/* Direct featured CTAs */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-6 border-t border-border-line mt-6">
                  <a
                    id={`feat-app-demo-${project.id}`}
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('click_demo', project.id)}
                    className="flex items-center justify-center gap-1.5 bg-primary text-secondary py-2.5 rounded-lg font-sans text-[11px] font-bold hover:bg-primary/95 transition-all text-center"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    id={`feat-app-code-${project.id}`}
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('click_github', project.id)}
                    className="flex items-center justify-center gap-1.5 border border-border-line text-text-dark py-2.5 rounded-lg font-sans text-[11px] font-bold hover:bg-primary/5 transition-all text-center"
                  >
                    <span>Source</span>
                    <Github className="w-3 h-3" />
                  </a>
                  <button
                    id={`feat-app-case-${project.id}`}
                    onClick={() => openCaseStudy(project)}
                    className="flex items-center justify-center gap-1.5 bg-accent text-bg-light py-2.5 rounded-lg font-sans text-[11px] font-bold hover:opacity-90 transition-all text-center cursor-pointer"
                  >
                    <span>Case Study</span>
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    id={`feat-app-quick-${project.id}`}
                    onClick={() => setQuickViewProject(project)}
                    className="flex items-center justify-center gap-1.5 bg-primary/5 border border-border-line text-text-dark py-2.5 rounded-lg font-sans text-[11px] font-bold hover:bg-primary/10 transition-all text-center cursor-pointer"
                  >
                    <span>Quick View</span>
                    <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                  </button>
                  <button
                    id={`feat-app-share-${project.id}`}
                    onClick={() => handleShareProject(project)}
                    className="flex items-center justify-center gap-1.5 bg-primary/5 border border-border-line text-text-dark py-2.5 rounded-lg font-sans text-[11px] font-bold hover:bg-primary/10 transition-all text-center cursor-pointer col-span-2 md:col-span-1"
                  >
                    {copiedProjectId === project.id ? (
                      <>
                        <span className="text-green-500">Copied!</span>
                        <Check className="w-3 h-3 text-green-500" />
                      </>
                    ) : (
                      <>
                        <span>Copy Link</span>
                        <Share2 className="w-3 h-3 text-accent" />
                      </>
                    )}
                  </button>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>
      )}

      {/* 3. SEARCH AND FILTER CONTROLS GRID */}
      <section id="project-filters-hub" className="bg-primary/5 border border-border-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary font-display font-bold text-sm">
          <Filter className="w-4 h-4 text-accent" />
          <span>Interactive Filter Console</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Category Filter */}
          <div>
            <select
              id="grid-category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border border-border-line bg-card-bg font-sans text-xs text-text-dark/80 focus:outline-none focus:border-primary transition-all"
            >
              <option value="all">Category: All Categories</option>
              <option value="frontend">Frontend Development</option>
              <option value="analytics">Data Analytics</option>
              <option value="responsive">Responsive Systems</option>
              <option value="seo">SEO Optimization</option>
            </select>
          </div>

          {/* Technology Filter */}
          <div>
            <select
              id="grid-tech-select"
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border-line bg-card-bg font-sans text-xs text-text-dark/80 focus:outline-none focus:border-primary transition-all"
            >
              <option value="all">Technology: All Tech</option>
              {allTechnologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>

          {/* Project Type Filter */}
          <div>
            <select
              id="grid-type-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border-line bg-card-bg font-sans text-xs text-text-dark/80 focus:outline-none focus:border-primary transition-all"
            >
              <option value="all">Project Type: All Types</option>
              {allProjectTypes.map(pt => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* 4. MAIN PROJECT GALLERY GRID */}
      <section id="projects-gallery-section" className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div 
                  key={`project-skeleton-${idx}`}
                  className="bg-card-bg border border-border-line rounded-2xl overflow-hidden flex flex-col justify-between animate-pulse"
                >
                  <div className="relative aspect-video bg-primary/10 border-b border-border-line flex items-center justify-center">
                    <div className="absolute top-3 left-3 bg-primary/10 px-6 py-2.5 rounded-full"></div>
                  </div>
                  <div className="p-5 sm:p-6 space-y-4 flex-grow flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <div className="h-6 bg-primary/10 rounded w-2/3"></div>
                      <div className="space-y-2">
                        <div className="h-3.5 bg-primary/5 rounded w-full"></div>
                        <div className="h-3.5 bg-primary/5 rounded w-5/6"></div>
                      </div>
                      <div className="space-y-2 bg-primary/[0.02] p-3 rounded-lg border border-border-line/40">
                        <div className="h-3 bg-primary/10 rounded w-4/5"></div>
                        <div className="h-3 bg-primary/10 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-border-line/60">
                      <div className="flex flex-wrap gap-1">
                        <div className="h-5 bg-primary/5 rounded w-16"></div>
                        <div className="h-5 bg-primary/5 rounded w-12"></div>
                        <div className="h-5 bg-primary/5 rounded w-20"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-primary/10 rounded w-1/4"></div>
                        <div className="flex gap-2">
                          <div className="h-7 bg-primary/10 rounded w-7"></div>
                          <div className="h-7 bg-primary/10 rounded w-7"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProjects.map((project, index) => {
              const activeView = getDeviceView(project.id);
              const isAnchorHighlighted = selectedProjectId === project.id;
              
              return (
                <TiltCard
                  key={project.id}
                  ref={(el) => { projectRefs.current[project.id] = el; }}
                  id={`project-gallery-card-${project.id}`}
                  layout
                  initial={{ opacity: 0, y: 32, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.025,
                    boxShadow: "0 22px 30px -4px rgba(0,0,0,0.08), 0 12px 14px -4px rgba(0,0,0,0.04)",
                    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ 
                    layout: { duration: 0.3 },
                    opacity: { duration: 0.4, delay: index * 0.05 },
                    y: { type: "spring", stiffness: 100, damping: 15, delay: index * 0.05 },
                    scale: { type: "spring", stiffness: 350, damping: 22, delay: index * 0.05 }
                  }}
                  className={`bg-card-bg border rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-300 group ${
                    isAnchorHighlighted 
                      ? 'border-accent ring-2 ring-accent/30 shadow-md' 
                      : 'border-border-line hover:border-accent'
                  }`}
                >
                  
                  {/* Top image panel */}
                  <div className="relative aspect-video bg-primary/5 border-b border-border-line flex items-center justify-center overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/75 to-transparent pointer-events-none" />
                    
                    {/* Category Label */}
                    <span className="absolute top-3 left-3 bg-card-bg/95 backdrop-blur-sm border border-border-line px-2.5 py-1 rounded-full font-sans text-[9px] font-bold uppercase text-primary">
                      {project.category}
                    </span>

                    {/* Quick View & Case Study overlays */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <button
                        id={`gallery-quick-overlay-${project.id}`}
                        onClick={() => setQuickViewProject(project)}
                        className="bg-card-bg/95 border border-border-line px-2.5 py-1.5 rounded-lg font-sans text-[10px] font-bold text-primary flex items-center gap-1 hover:bg-primary/5 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span>Quick View</span>
                      </button>
                      <button
                        id={`gallery-case-overlay-${project.id}`}
                        onClick={() => openCaseStudy(project)}
                        className="bg-card-bg/95 border border-border-line px-2.5 py-1.5 rounded-lg font-sans text-[10px] font-bold text-primary flex items-center gap-1 hover:bg-primary/5 cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Case Spec</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 sm:p-6 space-y-4 flex-grow flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-base sm:text-lg text-primary leading-tight">
                        {project.title}
                      </h4>
                      <p className="font-sans text-xs text-text-dark/75 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Problems & Objectives summary badges */}
                      <div className="space-y-2 bg-primary/[0.01] p-3 rounded-lg border border-border-line/40">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="font-sans text-[11px] text-text-dark/70 leading-relaxed">
                            <strong>Problem:</strong> {project.problem}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 pt-1.5 border-t border-border-line/50">
                          <Target className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="font-sans text-[11px] text-text-dark/70 leading-relaxed">
                            <strong>Objective:</strong> {project.objective}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border-line/60">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map(t => (
                          <span key={t} className="font-sans text-[9px] sm:text-[10px] font-bold text-primary bg-primary/5 border border-border-line px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs font-sans">
                        <button
                          id={`gallery-study-btn-${project.id}`}
                          onClick={() => openCaseStudy(project)}
                          className="font-bold text-primary hover:text-accent flex items-center gap-1 cursor-pointer"
                        >
                          <span>Analyze Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button
                            id={`gallery-share-btn-${project.id}`}
                            onClick={() => handleShareProject(project)}
                            className="p-1.5 border border-border-line text-text-dark/70 hover:bg-primary/5 rounded flex items-center justify-center cursor-pointer transition-all"
                            title={copiedProjectId === project.id ? "Copied!" : "Copy / Share Link"}
                          >
                            {copiedProjectId === project.id ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5 text-accent" />
                            )}
                          </button>
                          <button 
                            id={`gallery-quick-btn-${project.id}`}
                            onClick={() => setQuickViewProject(project)}
                            className="p-1.5 border border-border-line text-text-dark/70 hover:bg-primary/5 rounded flex items-center justify-center cursor-pointer"
                            title="Quick View Summary"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                          </button>
                          <a 
                            id={`gallery-code-link-${project.id}`}
                            href={project.github} 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={() => trackEvent('click_github', project.id)}
                            className="p-1.5 border border-border-line text-text-dark/70 hover:bg-primary/5 rounded"
                            title="Source Code"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                          <a 
                            id={`gallery-demo-link-${project.id}`}
                            href={project.demo} 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={() => trackEvent('click_demo', project.id)}
                            className="p-1.5 bg-primary text-secondary hover:opacity-95 rounded flex items-center justify-center"
                            title="Launch Live App"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>

                </TiltCard>
              );
            })}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-20 space-y-3 bg-primary/[0.01] border border-border-dashed border-border-line rounded-2xl">
              <HelpCircle className="w-8 h-8 text-text-dark/35 mx-auto" />
              <h4 className="font-display font-bold text-sm text-primary">No matching projects found</h4>
              <p className="font-sans text-xs text-text-dark/50">Adjust search queries or filter categories to widen results.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. CASE STUDY SYSTEM MODAL OVERLAY */}
      <AnimatePresence>
        {activeCaseStudy && (
          <motion.div 
            id="case-study-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              id="case-study-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card-bg border border-border-line rounded-3xl w-full max-w-3xl overflow-hidden shadow-xl max-h-[85vh] flex flex-col"
            >
              
              {/* Modal Header */}
              <div className="p-6 bg-primary text-bg-light flex justify-between items-center border-b border-border-line">
                <div className="space-y-1 text-left">
                  <span className="font-mono text-[9px] font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">
                    CASE STUDY DEEP DIVE
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-secondary">
                    {activeCaseStudy.title}
                  </h3>
                </div>
                <button
                  id="close-case-study-btn"
                  onClick={() => setActiveCaseStudy(null)}
                  className="p-2 text-secondary hover:bg-bg-light/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Close case study modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-grow text-left">
                
                {/* Visual Image */}
                <div className="h-48 rounded-xl overflow-hidden relative">
                  <img src={activeCaseStudy.image} alt={activeCaseStudy.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                </div>

                {/* Section grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs sm:text-sm">
                  
                  {/* Problem & Objectives */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">The Problem</strong>
                      <p className="text-text-dark/80 leading-relaxed bg-red-500/[0.01] border border-red-500/10 p-3 rounded-lg italic">
                        "{activeCaseStudy.problem}"
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Objective</strong>
                      <p className="text-text-dark/80 leading-relaxed bg-accent/[0.01] border border-accent/10 p-3 rounded-lg">
                        {activeCaseStudy.objective}
                      </p>
                    </div>
                  </div>

                  {/* Research & Solution */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Research & Planning</strong>
                      <p className="text-text-dark/80 leading-relaxed bg-primary/[0.01] border border-border-line p-3 rounded-lg leading-relaxed">
                        {activeCaseStudy.research}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Solution Approach</strong>
                      <p className="text-text-dark/80 leading-relaxed bg-primary/[0.01] border border-border-line p-3 rounded-lg">
                        {activeCaseStudy.solution}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Technical Stack */}
                <div className="space-y-2 font-sans pt-2 border-t border-border-line/60">
                  <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Technology Stack Applied</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCaseStudy.technologies.map(t => (
                      <span key={t} className="font-sans text-[10px] font-bold text-primary bg-primary/5 border border-border-line px-2.5 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results & Outcome */}
                <div className="space-y-2 bg-primary/5 border border-border-line p-4 rounded-xl font-sans">
                  <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Results & Outturn</strong>
                  <p className="text-text-dark/80 text-xs sm:text-sm leading-relaxed font-semibold">
                    {activeCaseStudy.results}
                  </p>
                </div>

                {/* Lessons Learned */}
                <div className="space-y-2 font-sans pb-4">
                  <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Lessons Learned</strong>
                  <p className="text-text-dark/80 text-xs sm:text-sm leading-relaxed bg-primary/[0.01] border border-border-line p-3 rounded-lg">
                    {activeCaseStudy.keyLearnings}
                  </p>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-primary/5 border-t border-border-line flex justify-end gap-2.5">
                <a
                  href={activeCaseStudy.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 border border-border-line rounded-lg font-sans text-xs font-bold text-text-dark hover:bg-primary/5 text-center"
                >
                  GitHub Source
                </a>
                <a
                  href={activeCaseStudy.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-primary text-secondary rounded-lg font-sans text-xs font-bold hover:bg-primary/95 text-center"
                >
                  Launch Live Demo
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}

        {/* QUICK VIEW MODAL OVERLAY */}
        {quickViewProject && (
          <motion.div 
            id="quick-view-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              id="quick-view-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card-bg border border-border-line rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
            >
              
              {/* Modal Header */}
              <div className="p-5 bg-primary text-bg-light flex justify-between items-center border-b border-border-line">
                <div className="space-y-1 text-left">
                  <span className="font-mono text-[9px] font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">
                    QUICK PROJECT PREVIEW
                  </span>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-secondary leading-tight">
                    {quickViewProject.title}
                  </h3>
                </div>
                <button
                  id="close-quick-view-btn"
                  onClick={() => setQuickViewProject(null)}
                  className="p-2 text-secondary hover:bg-bg-light/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Close quick view modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-grow text-left animate-fade-in">
                
                {/* Visual Banner */}
                <div className="h-40 rounded-xl overflow-hidden relative bg-primary/5 border border-border-line/40">
                  <img src={quickViewProject.image} alt={quickViewProject.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-xs border border-border-line/20 px-2.5 py-1 rounded-full font-sans text-[9px] font-bold uppercase text-bg-light">
                    {quickViewProject.category}
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-text-dark/85 leading-relaxed bg-primary/[0.01] border border-border-line/40 p-3.5 rounded-xl italic">
                  "{quickViewProject.description}"
                </p>

                {/* Key Metrics / Info Row */}
                <div className="grid grid-cols-2 gap-3 font-sans text-xs sm:text-sm">
                  <div className="space-y-1 bg-primary/[0.01] border border-border-line/50 p-3 rounded-lg">
                    <strong className="text-primary block font-bold text-[10px] uppercase tracking-wider">Problem Statement</strong>
                    <p className="text-text-dark/75 text-[11px] leading-relaxed line-clamp-3">
                      {quickViewProject.problem}
                    </p>
                  </div>
                  <div className="space-y-1 bg-primary/[0.01] border border-border-line/50 p-3 rounded-lg">
                    <strong className="text-accent block font-bold text-[10px] uppercase tracking-wider">Project Goal</strong>
                    <p className="text-text-dark/75 text-[11px] leading-relaxed line-clamp-3">
                      {quickViewProject.objective}
                    </p>
                  </div>
                </div>

                {/* Key Features */}
                {quickViewProject.features && quickViewProject.features.length > 0 && (
                  <div className="space-y-2 font-sans">
                    <strong className="text-primary block font-bold text-[10px] uppercase tracking-wider">Core Deliverables</strong>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {quickViewProject.features.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-text-dark/80 text-[11px] leading-tight">
                          <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Stack Applied */}
                <div className="space-y-2 font-sans pt-1">
                  <strong className="text-primary block font-bold text-[10px] uppercase tracking-wider">Technologies Used</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProject.technologies.map(t => (
                      <span key={t} className="font-sans text-[9px] sm:text-[10px] font-bold text-primary bg-primary/5 border border-border-line px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-primary/5 border-t border-border-line flex flex-wrap gap-2 justify-between items-center">
                <button
                  id="quick-view-deep-dive-btn"
                  onClick={() => {
                    const proj = quickViewProject;
                    setQuickViewProject(null);
                    setTimeout(() => setActiveCaseStudy(proj), 150);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-primary hover:text-accent border border-primary/20 rounded-lg font-sans transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Deep Case Study</span>
                </button>
                <div className="flex gap-2">
                  <a
                    id="quick-view-source-btn"
                    href={quickViewProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 border border-border-line rounded-lg font-sans text-xs font-bold text-text-dark hover:bg-primary/5 text-center flex items-center gap-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </a>
                  <a
                    id="quick-view-demo-btn"
                    href={quickViewProject.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-primary text-secondary rounded-lg font-sans text-xs font-bold hover:bg-primary/95 text-center flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Demo</span>
                  </a>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Typed from 'typed.js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, Laptop, Sparkles, BarChart3, Database, TrendingUp, HelpCircle,
  ArrowRight, ArrowUpRight, Github, Linkedin, FileText, CheckCircle2, 
  Calendar, Award, BookOpen, GitBranch, ChevronDown, Download, Check, Star, ExternalLink, GraduationCap, Quote
} from 'lucide-react';
import { PageId, Project, BlogItem } from '../types';
import { 
  services, 
  processSteps, 
  skillCategories, 
  projects, 
  timelineItems, 
  certifications, 
  faqItems, 
  currentlyLearning 
} from '../data';
import { blogService } from '../services/blogService';
import { useLanguage } from '../lib/LanguageContext';
import { getCMSTestimonials } from '../lib/cms';
import { trackEvent } from '../lib/analytics';
import { generateResumePDF } from '../utils/pdfGenerator';
// @ts-ignore
import profileImg from '../assets/images/portfolio_og_image_1783623042913.jpg';

interface HomeViewProps {
  setActivePage: (page: PageId) => void;
  setSelectedProjectId: (id: string | null) => void;
}

export default function HomeView({ setActivePage, setSelectedProjectId }: HomeViewProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [copiedResume, setCopiedResume] = useState(false);
  const { language, t } = useLanguage();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(true);

  const typedRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedRef.current) return;

    const typed = new Typed(typedRef.current, {
      strings: [
        '<i>Frontend Development</i>.',
        '& <i>Data Analytics.</i>',
        '<i>I have recently completed my studies at ISBM University.</i>'
      ],
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1800,
      startDelay: 400,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      contentType: 'html'
    });

    return () => {
      typed.destroy();
    };
  }, []);

  useEffect(() => {
    async function loadTestimonials() {
      const activeTestimonials = await getCMSTestimonials();
      setTestimonials(activeTestimonials);
    }
    loadTestimonials();

    async function loadRecentBlogs() {
      try {
        setLoadingBlogs(true);
        const recentBlogs = await blogService.getRecentBlogs();
        setBlogs(recentBlogs);
      } catch (err) {
        console.error('Error loading blogs:', err);
      } finally {
        setLoadingBlogs(false);
      }
    }
    loadRecentBlogs();
  }, []);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActivePage('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Safe helper to render icons statically
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return <Layout className="w-6 h-6 text-primary" />;
      case 'Laptop': return <Laptop className="w-6 h-6 text-primary" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-primary" />;
      case 'BarChart3': return <BarChart3 className="w-6 h-6 text-primary" />;
      case 'Database': return <Database className="w-6 h-6 text-primary" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-primary" />;
      default: return <HelpCircle className="w-6 h-6 text-primary" />;
    }
  };

  const triggerDownloadResume = () => {
    trackEvent('download_resume', 'home_resume_btn');
    generateResumePDF();
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 3000);
  };

  // Filter projects to only show featured ones
  const featuredProjects = projects.filter(p => p.isFeatured).slice(0, 4);

  // GitHub mock contribution grid data generator
  const contributionWeeks = 18;
  const daysPerWeek = 7;
  const generateMockContributions = () => {
    const grid = [];
    const colors = ['bg-primary/10', 'bg-accent/20', 'bg-accent/40', 'bg-accent/75', 'bg-primary'];
    for (let i = 0; i < contributionWeeks * daysPerWeek; i++) {
      // Create a deterministic but realistic looking scatter of values
      const level = Math.abs(Math.sin(i * 0.15) * 2) + (i % 5 === 0 ? 2 : 0) - (i % 7 === 0 ? 1 : 0);
      const index = Math.min(Math.max(Math.floor(level), 0), 4);
      grid.push(colors[index]);
    }
    return grid;
  };
  const contributionGrid = generateMockContributions();

  return (
    <div id="home-view" className="space-y-24 md:space-y-36 pb-24">
      
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative pt-0 lg:pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Availability Badge */}
            <motion.div 
              id="hero-availability-badge" 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
              className="inline-flex items-center space-x-2.5 bg-accent-light px-4 py-2 rounded-full border border-accent/20"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                Available for Internship & Freelance Opportunities
              </span>
            </motion.div>

            <motion.h1 
              id="hero-title" 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight tracking-tight"
            >
              Honest Engineering. <br/>
              <span className="text-accent">Analytical Precision.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-sans text-lg sm:text-xl md:text-2xl text-text-dark/95 font-bold"
            >
              Hi, I am <strong className="text-primary font-extrabold font-display">Sumit Kumar</strong>.
            </motion.p>

            {/* Typed.js Typing Animation Container */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-display text-lg sm:text-xl md:text-2xl text-accent font-extrabold min-h-[3.5rem] sm:min-h-[2.5rem] flex items-center justify-center lg:justify-start tracking-tight leading-snug"
            >
              <span ref={typedRef} />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-sans text-sm sm:text-base text-text-dark/80 max-w-2xl leading-relaxed"
            >
              I am a BCA Graduate (2026) specializing in Frontend Development, Responsive UI Systems, and Data Analytics. I construct high-performance, responsive interfaces with clean modular structures paired with modern, data-driven analytical reports.
            </motion.p>

            {/* Direct CTAs */}
            <div className="flex flex-wrap gap-3.5 pt-2 justify-center lg:justify-start">
              <button
                id="hero-view-projects-btn"
                onClick={() => handleNavClick('projects')}
                className="bg-primary text-secondary px-6 py-3.5 rounded-lg font-sans text-xs font-bold shadow-md transition-all duration-300 hover:bg-primary/95 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center space-x-2"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="hero-contact-btn"
                onClick={() => handleNavClick('contact')}
                className="bg-transparent border-2 border-primary/25 text-primary hover:border-primary/80 hover:bg-primary/5 px-6 py-3 rounded-lg font-sans text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Contact Me
              </button>

              <button
                id="hero-download-resume-btn"
                onClick={triggerDownloadResume}
                className="bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 px-6 py-3 rounded-lg font-sans text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
              >
                {copiedResume ? <Check className="w-4 h-4 text-accent" /> : <Download className="w-4 h-4 text-primary" />}
                <span>{copiedResume ? 'Downloaded PDF' : 'Download Resume'}</span>
              </button>
            </div>

            {/* Profile CTA Hub */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 pt-4 border-t border-border-line max-w-md w-full">
              <span className="font-sans text-xs font-bold text-text-dark/50 uppercase tracking-wider">Find Me On:</span>
              <a
                id="hero-github-link"
                href="https://github.com/w3s40"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('click_github', 'hero')}
                className="flex items-center space-x-1.5 font-sans text-xs font-bold text-primary hover:text-accent transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <span className="text-text-dark/20">|</span>
              <a
                id="hero-linkedin-link"
                href="https://www.linkedin.com/in/codewithw3s-undefined-058bb741b/?skipRedirect=true"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('click_linkedin', 'hero')}
                className="flex items-center space-x-1.5 font-sans text-xs font-bold text-primary hover:text-accent transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>

          </div>

          {/* Hero Image / Creative Layout */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl bg-primary/5 border border-border-line p-4 shadow-xl">
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-accent rounded-tl-lg" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-accent rounded-br-lg" />
              <div className="w-full h-full rounded-xl overflow-hidden bg-primary/10 relative">
                <img
                  src={profileImg}
                  alt="Sumit Kumar Professional Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-card-bg/95 backdrop-blur-sm border border-border-line p-4 rounded-lg shadow-md">
                  <span className="block font-display font-extrabold text-sm text-primary tracking-wide">
                    SUMIT KUMAR
                  </span>
                  <span className="block font-sans text-[11px] text-text-dark/85 mt-1 font-semibold">
                    BCA Graduate (2026) &bull; Dev & Analytics Specialist
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 2. TRUST BAR SECTION */}
      <section id="trust-bar-section" className="bg-card-bg rounded-2xl border border-border-line p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:divide-x md:divide-border-line">
          
          <div className="space-y-2 text-left sm:px-3 first:pl-0">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              <span className="font-display font-extrabold text-xs text-accent uppercase tracking-wider block">
                Education
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base text-primary">
              BCA Graduate 2026
            </h3>
            <p className="font-sans text-xs text-text-dark/75 leading-relaxed">
              Complete computer science and logical analytics qualification from ISBM University.
            </p>
          </div>

          <div className="space-y-2 text-left sm:px-6">
            <div className="flex items-center space-x-2">
              <Layout className="w-5 h-5 text-accent" />
              <span className="font-display font-extrabold text-xs text-accent uppercase tracking-wider block">
                Frontend
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base text-primary">
              Frontend Development
            </h3>
            <p className="font-sans text-xs text-text-dark/75 leading-relaxed">
              Engineering clean, highly modular, fluid structures in React, TypeScript, and Tailwind.
            </p>
          </div>

          <div className="space-y-2 text-left sm:px-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              <span className="font-display font-extrabold text-xs text-accent uppercase tracking-wider block">
                Data Science
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base text-primary">
              Data Analytics
            </h3>
            <p className="font-sans text-xs text-text-dark/75 leading-relaxed">
              Configuring robust database pipelines using advanced SQL, Microsoft Excel, and Power BI models.
            </p>
          </div>

          <div className="space-y-2 text-left sm:px-6 last:pr-0">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="font-display font-extrabold text-xs text-accent uppercase tracking-wider block">
                SEO Experience
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base text-primary">
              SEO Experience
            </h3>
            <p className="font-sans text-xs text-text-dark/75 leading-relaxed">
              Executing schema architectures, asset speed auditing, and driving performance rankings.
            </p>
          </div>

        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 3. SERVICES SECTION */}
      <section id="services-section" className="space-y-12 text-left">
        <div className="space-y-4 max-w-3xl">
          <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
            Core Competencies
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary tracking-tight">
            High-Grade Technical Services
          </h2>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed">
            I deliver conversion-focused and structured solutions across web development, custom telemetry dashboards, database engineering, and organic index optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-card-bg border border-border-line rounded-xl p-8 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center">
                  {getServiceIcon(service.iconName)}
                </div>
                <h3 className="font-display font-bold text-lg text-primary leading-snug">
                  {service.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-text-dark/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="pt-6 border-t border-border-line/40 mt-6">
                <button
                  id={`service-learn-more-${service.id}`}
                  onClick={() => handleNavClick('contact')}
                  className="font-sans text-xs font-bold text-primary hover:text-accent transition-colors flex items-center space-x-1"
                >
                  <span>Inquire about service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 4. TECH STACK SECTION (GRID DISPLAY WITH DETAILED LISTS) */}
      <section id="tech-stack-section" className="space-y-12 text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
            The Toolbelt
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Rigorous Stack Classification
          </h2>
          <p className="font-sans text-text-dark/80 text-sm leading-relaxed">
            Clean architectures built with standard, highly responsive modules and detailed enterprise query tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div 
              key={category.name} 
              className="bg-card-bg border border-border-line p-8 rounded-xl shadow-sm space-y-5"
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-border-line">
                <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-primary">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-extrabold text-sm text-primary uppercase tracking-wide">
                  {category.name}
                </h3>
              </div>
              
              <ul className="space-y-3">
                {category.items.map((skill) => (
                  <li key={skill} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm font-medium text-text-dark/85 leading-tight">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 5. CURRENTLY LEARNING SECTION */}
      <section id="currently-learning-section" className="bg-primary/5 border border-border-line rounded-2xl p-8 md:p-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
              Continuous Upskilling
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
              Currently Learning
            </h2>
            <p className="font-sans text-xs sm:text-sm text-text-dark/80 leading-relaxed">
              I am actively expanding my skillset in advanced React compilers, strict typing systems, and relational server architectures to refine the solutions I build.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentlyLearning.map((item, index) => (
              <div 
                key={index} 
                className="bg-card-bg border border-border-line p-6 rounded-xl shadow-xs space-y-2 hover:border-accent/30 transition-all duration-300"
              >
                <div className="inline-flex items-center space-x-1.5 bg-primary/5 px-2.5 py-1 rounded text-primary font-sans text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Module {index + 1}</span>
                </div>
                <h3 className="font-display font-bold text-sm text-primary">{item.name}</h3>
                <p className="font-sans text-xs text-text-dark/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 6. FEATURED PROJECTS SECTION */}
      <section id="featured-projects-section" className="space-y-12 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-4 max-w-2xl">
            <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
              Case Studies
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary tracking-tight">
              Featured Case Work
            </h2>
            <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed">
              An exhaustive analysis of architectural hurdles, objective maps, and direct performance results.
            </p>
          </div>
          <button
            id="all-projects-anchor"
            onClick={() => handleNavClick('projects')}
            className="group font-sans text-xs sm:text-sm font-bold text-primary flex items-center space-x-1.5 border-b border-primary/20 pb-1 hover:border-primary transition-all duration-200 cursor-pointer"
          >
            <span>Explore All Projects & Audits</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              id={`featured-project-${project.id}`}
              className="group bg-card-bg border border-border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="aspect-[16:10] w-full bg-primary/5 overflow-hidden relative border-b border-border-line/60">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute top-4 left-4 bg-primary text-secondary font-sans text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                  {project.category === 'analytics' ? 'Data Analytics' : project.category === 'seo' ? 'SEO Audit' : 'Frontend'}
                </div>
              </div>

              {/* Contents */}
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-xl text-primary group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-text-dark/75 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="font-sans text-[10px] sm:text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-line flex items-center justify-between gap-4">
                  <button
                    id={`featured-case-study-btn-${project.id}`}
                    onClick={() => handleProjectClick(project.id)}
                    className="font-sans text-xs font-bold text-primary hover:text-accent transition-colors flex items-center space-x-1"
                  >
                    <span>Analyze Case Study Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <a
                      id={`featured-project-gh-link-${project.id}`}
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg border border-border-line text-text-dark hover:bg-primary/5 transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      id={`featured-project-demo-link-${project.id}`}
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-primary text-secondary hover:bg-primary/95 transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 7. EXPERIENCE TIMELINE */}
      <section id="experience-timeline-section" className="space-y-12 text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
            The Journey
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Academic & Experience Timeline
          </h2>
          <p className="font-sans text-text-dark/80 text-sm leading-relaxed">
            A chronological roadmap documenting my growth from fundamental algorithmic frameworks to technical search marketing and modern client engineering.
          </p>
        </div>

        <div className="relative border-l-2 border-primary/10 ml-4 md:ml-6 space-y-10 py-2">
          {timelineItems.map((item) => (
            <div key={item.id} className="relative pl-8 md:pl-10 group">
              {/* Left timeline dot indicator */}
              <div className="absolute -left-2.5 top-1.5 w-4 h-4 rounded-full border-2 border-accent bg-card-bg group-hover:bg-accent transition-all duration-300" />
              
              <div className="space-y-1.5 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-extrabold text-xs text-accent bg-primary/5 px-2.5 py-1 rounded">
                    {item.year}
                  </span>
                  <span className="font-sans text-[10px] uppercase font-bold text-text-dark/50">
                    {item.category === 'education' ? 'academic' : item.category === 'seo' ? 'SEO focus' : 'practical engineering'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-primary">
                  {item.title}
                </h3>
                <h4 className="font-sans text-xs font-semibold text-text-dark/60">
                  {item.subtitle}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-text-dark/75 leading-relaxed max-w-3xl">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 8. CERTIFICATIONS SECTION */}
      <section id="certifications-section" className="space-y-12 text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
            Quality Assurance
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Certifications & Qualifications
          </h2>
          <p className="font-sans text-text-dark/80 text-sm leading-relaxed">
            Professional certifications and targeted learning milestones validated by academic and industrial platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div 
              key={cert.id} 
              className={`bg-card-bg border rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4 ${
                cert.category === 'future' ? 'border-dashed border-primary/20 bg-primary/2' : 'border-border-line'
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center">
                  <Award className={`w-5 h-5 ${cert.category === 'future' ? 'text-primary/50' : 'text-accent'}`} />
                </div>
                <h3 className="font-display font-bold text-sm text-primary leading-snug">
                  {cert.title}
                </h3>
                <p className="font-sans text-[11px] text-text-dark/60 font-medium">
                  Issued by: {cert.issuer}
                </p>
              </div>
              <div className="pt-3 border-t border-border-line/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-dark/40">
                <span>{cert.date}</span>
                <span className="text-accent">{cert.category === 'future' ? 'In Progress' : 'Verified'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 9. INTERACTIVE GITHUB WIDGET */}
      <section id="github-section" className="bg-card-bg border border-border-line rounded-2xl p-8 md:p-12 text-left space-y-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
              Open Source Track
            </span>
            <h2 className="font-display font-extrabold text-2xl text-primary tracking-tight">
              GitHub Metrics & Activity
            </h2>
            <p className="font-sans text-xs text-text-dark/85 leading-relaxed max-w-xl">
              I practice continuous integration and document my development journey publicly. Below is a representation of my commit rhythms and open repository contributions.
            </p>
          </div>
          <a
            id="github-profile-redirect"
            href="https://github.com/w3s40"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 bg-primary text-secondary px-5 py-3 rounded-lg font-sans text-xs font-bold shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <Github className="w-4 h-4" />
            <span>Visit @w3s40</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mock Contribution Chart Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-text-dark/50">
            <span>Recent Contributions</span>
            <div className="flex items-center space-x-1.5">
              <span>Less</span>
              <span className="w-2.5 h-2.5 bg-primary/10 rounded-sm" />
              <span className="w-2.5 h-2.5 bg-accent/20 rounded-sm" />
              <span className="w-2.5 h-2.5 bg-accent/40 rounded-sm" />
              <span className="w-2.5 h-2.5 bg-accent/75 rounded-sm" />
              <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
              <span>More</span>
            </div>
          </div>

          <div className="border border-border-line/65 p-4 rounded-xl bg-primary/2 overflow-x-auto">
            <div className="min-w-[620px] flex flex-col gap-1.5">
              {/* Represent days in columns or grid */}
              <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                {contributionGrid.map((bgClass, idx) => (
                  <div 
                    key={idx} 
                    className={`w-3 h-3 rounded-xs ${bgClass} transition-colors duration-300 hover:ring-1 hover:ring-primary/40`} 
                    title={`Day ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Repositories showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="border border-border-line p-5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-extrabold text-accent uppercase tracking-wide">React System</span>
              <Star className="w-4 h-4 text-accent" />
            </div>
            <h4 className="font-display font-bold text-sm text-primary">weather-analytics</h4>
            <p className="font-sans text-xs text-text-dark/70 leading-relaxed">Meteorological cache controller hook and rendering dashboards.</p>
            <div className="flex items-center space-x-3 text-[10px] text-text-dark/50 font-semibold pt-1">
              <span>TypeScript</span>
              <span>&bull;</span>
              <span>12 Stars</span>
            </div>
          </div>

          <div className="border border-border-line p-5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-extrabold text-accent uppercase tracking-wide">Optimization</span>
              <Star className="w-4 h-4 text-accent" />
            </div>
            <h4 className="font-display font-bold text-sm text-primary">seo-audit-engine</h4>
            <p className="font-sans text-xs text-text-dark/70 leading-relaxed">Structural audits mapping redirects, JSON-LD, and Core Vitals.</p>
            <div className="flex items-center space-x-3 text-[10px] text-text-dark/50 font-semibold pt-1">
              <span>HTML / SEO</span>
              <span>&bull;</span>
              <span>8 Stars</span>
            </div>
          </div>

          <div className="border border-border-line p-5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-extrabold text-accent uppercase tracking-wide">Analytics</span>
              <Star className="w-4 h-4 text-accent" />
            </div>
            <h4 className="font-display font-bold text-sm text-primary">financial-ledger</h4>
            <p className="font-sans text-xs text-text-dark/70 leading-relaxed">Dynamic mathematical selectors and CSV spreadsheet exporter blocks.</p>
            <div className="flex items-center space-x-3 text-[10px] text-text-dark/50 font-semibold pt-1">
              <span>React / Recharts</span>
              <span>&bull;</span>
              <span>15 Stars</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 10. METHODICAL WORKFLOW SECTION */}
      <section id="process-section" className="space-y-12 text-left">
        <div className="space-y-4 max-w-3xl">
          <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
            The Method
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary tracking-tight">
            Methodical Delivery Process
          </h2>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed">
            I adhere to a structured, agency-level developmental pipeline to ensure that all projects deliver high-quality performance and precise metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.step}
              id={`process-step-card-${step.step}`}
              className="bg-card-bg border border-border-line rounded-xl p-6 flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                <div className="font-display font-extrabold text-2xl text-accent/25">
                  {String(step.step).padStart(2, '0')}
                </div>
                <h3 className="font-display font-bold text-sm text-primary">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-text-dark/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 11. BLOG SECTION */}
      <section id="blog-section" className="space-y-12 text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
            Written Analysis
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Engineering & Analytics Blog
          </h2>
          <p className="font-sans text-text-dark/80 text-sm leading-relaxed">
            Previews of technical reviews covering frontend rendering speeds, SQL query optimization, and structured search patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loadingBlogs ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div 
                key={`blog-skeleton-${idx}`}
                className="bg-card-bg border border-border-line rounded-xl p-6 flex flex-col justify-between space-y-5 animate-pulse"
              >
                <div className="space-y-3.5">
                  <div className="h-4 bg-primary/10 rounded w-1/4"></div>
                  <div className="h-6 bg-primary/10 rounded w-3/4 mt-2"></div>
                  <div className="space-y-2 mt-2">
                    <div className="h-3.5 bg-primary/5 rounded w-full"></div>
                    <div className="h-3.5 bg-primary/5 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border-line/40 flex items-center justify-between">
                  <div className="h-3 bg-primary/10 rounded w-1/5"></div>
                  <div className="h-3 bg-primary/10 rounded w-1/5"></div>
                </div>
              </div>
            ))
          ) : (
            blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-card-bg border border-border-line rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="inline-flex items-center space-x-1 bg-accent/10 px-2.5 py-1 rounded text-accent font-sans text-[10px] font-bold">
                    <span>{blog.category}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-primary leading-snug">
                    {blog.title}
                  </h3>
                  <p className="font-sans text-xs text-text-dark/75 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-border-line/40 flex items-center justify-between text-[10px] text-text-dark/50 font-semibold">
                  <span>{blog.date}</span>
                  <span>{blog.readTime}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {testimonials.length > 0 ? (
        <>
          <hr className="border-t border-border-line" />
          <section id="testimonials-section" className="space-y-12 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
              {t('testimonialsTitle') || 'Client Feedback'}
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
              Professional Endorsements
            </h2>
            <p className="font-sans text-text-dark/80 text-sm leading-relaxed">
              Real reviews and feedback shared by clients, project leads, and industry professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test) => (
              <div 
                key={test.id}
                className="bg-card-bg border border-border-line rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-accent hover:shadow-xs transition-all duration-300 relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Quote className="w-8 h-8 text-accent/30" />
                    {test.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-text-dark/85 leading-relaxed italic">
                    "{test.content}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-border-line/45">
                  {test.avatar && (
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-border-line"
                    />
                  )}
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-primary">
                      {test.name}
                    </h4>
                    <p className="font-sans text-[10px] text-text-dark/50 font-medium">
                      {test.role} {test.company ? `@ ${test.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
          <hr className="border-t border-border-line" />
        </>
      ) : (
        <hr className="border-t border-border-line" />
      )}

      {/* 12. FAQ SECTION */}
      <section id="faq-section" className="space-y-12 text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
            Clarifications
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-text-dark/80 text-sm leading-relaxed">
            Quick, honest answers to common technical, collaborative, and toolset configurations.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-card-bg border border-border-line rounded-xl overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  id={`faq-btn-${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-display font-bold text-sm md:text-base text-primary hover:bg-primary/2 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-content-${faq.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="border-t border-border-line/45"
                    >
                      <div className="px-6 py-5 font-sans text-xs sm:text-sm text-text-dark/80 leading-relaxed bg-primary/1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="border-t border-border-line" />

      {/* 13. CALL TO ACTION SECTION */}
      <section id="cta-section" className="bg-primary rounded-2xl p-8 md:p-16 text-center text-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-secondary/10 rounded-tl-xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-secondary/10 rounded-br-xl" />
        
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="font-display font-extrabold text-xs text-secondary uppercase tracking-widest block">
            Let's Collaborate
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-secondary tracking-tight leading-none">
            Let's Build Something Great Together
          </h2>
          <p className="font-sans text-xs sm:text-sm text-secondary/80 leading-relaxed max-w-xl mx-auto">
            I am currently seeking structural internships, freelance contracts, and collaborative partnerships to address challenging technical problems.
          </p>
          <div className="pt-4">
            <button
              id="cta-contact-redirect-btn"
              onClick={() => handleNavClick('contact')}
              className="inline-flex items-center space-x-2 bg-secondary text-primary px-8 py-4 rounded-xl font-sans text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Initiate a Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

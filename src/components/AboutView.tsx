/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, GraduationCap, Compass, Sparkles, Code2, LineChart, Cpu, Search, Download, Printer } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../lib/analytics';
import { generateResumePDF } from '../utils/pdfGenerator';

interface SvgSkillBarProps {
  name: string;
  percentage: number;
  category: string;
  index: number;
  key?: any;
  onClick?: () => void;
}

function SvgSkillBar({ name, percentage, category, index, onClick }: SvgSkillBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="space-y-1 cursor-pointer group select-none relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-baseline text-xs font-semibold relative">
        <span className="text-primary font-display font-extrabold tracking-tight transition-colors duration-200 group-hover:text-accent">
          {name}
        </span>
        <span className="text-accent font-mono font-bold">{percentage}%</span>
        
        {/* Click-to-filter Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute -top-9 left-0 bg-primary text-secondary text-[10px] font-sans font-bold px-2.5 py-1 rounded-md shadow-md pointer-events-none z-10 whitespace-nowrap"
            >
              Click to filter projects
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-primary rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative w-full h-7 overflow-visible">
        <svg 
          viewBox="0 0 400 24" 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(1, 62, 55, 0.3)" />
              <stop offset="100%" stopColor="var(--accent, #cf513d)" />
            </linearGradient>
            <filter id={`glow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="var(--accent, #cf513d)" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Bar Background Track */}
          <rect 
            x="0" 
            y="6" 
            width="400" 
            height="10" 
            rx="5" 
            ry="5" 
            fill="rgba(1, 62, 55, 0.04)" 
            stroke="rgba(1, 62, 55, 0.08)" 
            strokeWidth="1"
          />

          {/* Ticks representation at 25%, 50%, 75% */}
          {[100, 200, 300].map((tickX, tickIdx) => (
            <line
              key={tickIdx}
              x1={tickX}
              y1="6"
              x2={tickX}
              y2="16"
              stroke="rgba(1, 62, 55, 0.12)"
              strokeWidth="1"
              strokeDasharray="2 1"
            />
          ))}

          {/* Animated Active Skill Fill */}
          <motion.rect
            x="0"
            y="6"
            height="10"
            rx="5"
            ry="5"
            fill={`url(#grad-${index})`}
            initial={{ width: 0 }}
            whileInView={{ width: (percentage / 100) * 400 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.12, ease: [0.25, 1, 0.5, 1] }}
          />

          {/* Glowing dot at the current percentage position */}
          <motion.circle
            cy="11"
            r="4.5"
            fill="#ffffff"
            stroke="var(--accent, #cf513d)"
            strokeWidth="2.5"
            filter={`url(#glow-${index})`}
            initial={{ cx: 0 }}
            whileInView={{ cx: (percentage / 100) * 400 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.12, ease: [0.25, 1, 0.5, 1] }}
          />

          {/* Interactive Highlight Border */}
          <rect
            x="0"
            y="6"
            width="400"
            height="10"
            rx="5"
            ry="5"
            fill="none"
            stroke="var(--accent, #cf513d)"
            strokeWidth="1.5"
            style={{ opacity: isHovered ? 0.8 : 0, transition: 'opacity 0.2s ease-in-out' }}
          />
        </svg>
      </div>

      <span className="block text-[9px] text-text-dark/40 font-bold uppercase tracking-wider">
        {category}
      </span>
    </motion.div>
  );
}

interface AboutViewProps {
  onSkillClick?: (skillName: string) => void;
}

export default function AboutView({ onSkillClick }: AboutViewProps) {
  const highlights = [
    {
      title: 'Frontend Development',
      description: 'Translating Figma layups and visual mockups into compliant, type-safe, and semantic web structures using React and modern CSS compilers.',
      icon: Code2,
    },
    {
      title: 'Web Engineering',
      description: 'Building clean, standard-compliant applications that prioritize client-side loading speeds and clear modular state routing.',
      icon: Cpu,
    },
    {
      title: 'SEO & Core Web Vitals',
      description: 'Configuring precise meta structures, semantic page headings, and layout performance elements to boost organic search engine visibility.',
      icon: Search,
    },
    {
      title: 'Data Analytics & Reporting',
      description: 'Aggregating raw metrics, modeling transactional patterns in SQL, and creating interactive charts that empower executive teams to make informed decisions.',
      icon: LineChart,
    },
  ];

  const careerGoals = [
    {
      label: 'Build Practical Digital Products',
      detail: 'Focusing on building usable, highly intuitive tools that solve day-to-day problems for startups and local businesses.',
    },
    {
      label: 'Help Businesses Grow through Data',
      detail: 'Utilizing data modeling to expose business bottlenecks, visualize growth trends, and optimize conversion pathways.',
    },
    {
      label: 'Continuous Technical Mastery',
      detail: 'Consistently updating my skills, exploring backend ecosystems, and studying advanced serverless paradigms.',
    },
  ];

  return (
    <div id="about-view" className="space-y-16 md:space-y-24 pb-24 text-left">
      
      {/* 1. PROFESSIONAL BIOGRAPHY */}
      <section id="about-intro-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
              Professional Biography
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-primary tracking-tight leading-tight">
              About Sumit Kumar
            </h1>
          </div>
          
          <p className="font-sans text-base text-text-dark/85 leading-relaxed">
            I am a motivated Frontend Developer and Data Analytics Professional dedicated to building practical, data-driven digital solutions. Graduating with a Bachelor of Computer Applications (BCA) in 2026, my academic journey provided a rigorous foundation in software paradigms, database engines, and structured analytics.
          </p>
          <p className="font-sans text-base text-text-dark/85 leading-relaxed">
            Rather than separating developer mechanics from business metrics, I focus on the synergy between the two. When I build a website, I optimize its layouts for search-engine indexing (SEO). When I design a commercial database, I render its query logs into visual charts to unlock strategic value.
          </p>
          
          {/* Highlight stat block */}
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="border border-primary/10 rounded-xl p-4 bg-primary/5">
              <span className="font-display font-extrabold text-2xl text-primary block">2026</span>
              <span className="font-sans text-xs text-text-dark/60 font-semibold uppercase tracking-wider">
                BCA GRADUATION
              </span>
            </div>
            <div className="border border-primary/10 rounded-xl p-4 bg-primary/5">
              <span className="font-display font-extrabold text-2xl text-primary block">Dual Focus</span>
              <span className="font-sans text-xs text-text-dark/60 font-semibold uppercase tracking-wider">
                DEVELOPMENT & ANALYTICS
              </span>
            </div>
          </div>
        </div>

        {/* Card sidebar representation */}
        <div className="lg:col-span-5">
          <div className="bg-primary text-bg-light rounded-2xl p-8 relative overflow-hidden shadow-lg space-y-6">
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-bg-light/10 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-bg-light/10 rounded-br-2xl" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-primary">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-secondary">
                Educational Foundation
              </h3>
            </div>

            <div className="space-y-4 font-sans text-sm border-t border-bg-light/10 pt-4 leading-relaxed text-bg-light/90">
              <div>
                <span className="block font-bold text-xs text-secondary uppercase tracking-widest">DEGREE</span>
                <p className="font-semibold text-base">Bachelor of Computer Applications (BCA)</p>
              </div>
              <div>
                <span className="block font-bold text-xs text-secondary uppercase tracking-widest">INSTITUTION</span>
                <p className="font-semibold text-base">ISBM University</p>
              </div>
              <div>
                <span className="block font-bold text-xs text-secondary uppercase tracking-widest">GRADUATED YEAR</span>
                <p className="font-semibold text-base">Class of 2026</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 2. EXPERIENCE HIGHLIGHTS */}
      <section id="about-highlights-section" className="space-y-10">
        <div className="space-y-3">
          <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
            Capabilities Summary
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Core Competencies & Scope
          </h2>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed max-w-2xl">
            A precise outline of my engineering focus, showing where I bring the most structural and analytical value to business teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-bg-light border border-primary/10 rounded-xl p-8 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300 flex items-start space-x-5"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="font-display font-bold text-lg text-primary leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-text-dark/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CAREER GOALS */}
      <section id="about-goals-section" className="bg-primary/5 rounded-2xl border border-primary/10 p-8 md:p-12 space-y-10">
        <div className="space-y-3">
          <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
            The Vision
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Strategic Professional Trajectory
          </h2>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed max-w-2xl">
            My engineering goals are anchored in utility and business results. Here are the core pillars that guide my technical and analytical path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {careerGoals.map((goal, idx) => (
            <div key={idx} className="space-y-3 text-left">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-display font-bold text-xs text-primary">
                0{idx + 1}
              </div>
              <h3 className="font-display font-bold text-base text-primary leading-snug">
                {goal.label}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-text-dark/70 leading-relaxed">
                {goal.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3.5. TECHNICAL PROFICIENCY ANALYTICS */}
      <section id="about-proficiency-analytics-section" className="space-y-10 animate-fade-in">
        <div className="space-y-3">
          <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
            Competency Metrics
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Technical Proficiency & Skill Distributions
          </h2>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed max-w-2xl">
            A visual overview of my technical capabilities. The radar chart illustrates my skill focus across major dimensions, while the progress meters show specific implementation mastery levels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card-bg border border-border-line p-6 sm:p-8 rounded-2xl">
          {/* Progress Meters Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h3 className="font-display font-bold text-lg text-primary">
              Implementation Mastery
            </h3>
            <div className="space-y-4">
              {[
                { name: 'React.js & TypeScript', percentage: 90, category: 'Frontend Development Systems' },
                { name: 'Tailwind CSS & Adaptive UI', percentage: 95, category: 'Frontend Development Systems' },
                { name: 'SQL Query Tuning & Schema Modeling', percentage: 80, category: 'Data Analytics & Databases' },
                { name: 'Excel Advanced Analysis & Models', percentage: 88, category: 'Data Analytics & Databases' },
                { name: 'Git & Automated Workflows', percentage: 85, category: 'Development Tools' },
              ].map((skill, idx) => (
                <SvgSkillBar
                  key={idx}
                  index={idx}
                  name={skill.name}
                  percentage={skill.percentage}
                  category={skill.category}
                  onClick={() => onSkillClick?.(skill.name)}
                />
              ))}
            </div>
          </div>

          {/* Radar Chart Column */}
          <div className="lg:col-span-6 h-[320px] sm:h-[360px] flex flex-col items-center justify-center relative bg-primary/2 rounded-xl p-4 border border-border-line/40">
            <h3 className="font-display font-bold text-sm text-primary absolute top-4 left-4 uppercase tracking-widest">
              Core Competency Grid
            </h3>
            <div className="w-full h-full pt-8">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="65%"
                  data={[
                    { subject: 'Frontend UI', A: 92, fullMark: 100 },
                    { subject: 'State & Logic', A: 85, fullMark: 100 },
                    { subject: 'Data Analytics', A: 88, fullMark: 100 },
                    { subject: 'SQL & Database', A: 82, fullMark: 100 },
                    { subject: 'Tooling & CI/CD', A: 84, fullMark: 100 },
                    { subject: 'Performance', A: 86, fullMark: 100 },
                  ]}
                >
                  <PolarGrid stroke="rgba(1, 62, 55, 0.15)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'var(--primary)', fontSize: 9, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: 'var(--text-dark)', fontSize: 8 }}
                    stroke="rgba(1, 62, 55, 0.15)"
                  />
                  <Radar
                    name="Skill Proficiency"
                    dataKey="A"
                    stroke="var(--accent)"
                    fill="var(--accent)"
                    fillOpacity={0.25}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card-bg border border-border-line px-3 py-1.5 rounded-lg shadow-md text-[11px] font-sans text-left">
                            <span className="font-bold text-primary block">{payload[0].payload.subject}</span>
                            <span className="text-accent font-extrabold">{payload[0].value}% Proficiency</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECHNOLOGY SHOWCASE */}
      <section id="about-tech-showcase-section" className="space-y-10">
        <div className="space-y-3">
          <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
            Infrastructure Stack
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Detailed Technology Showcase
          </h2>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed max-w-2xl">
            A meticulous breakdown of my technical stack, mapping out my usage areas and related projects for every technology.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Frontend Category */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xs text-accent uppercase tracking-widest border-b border-border-line pb-2">
              Frontend Development Systems
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: 'HTML', desc: 'Standard markup structures for clean page layouts and SEO crawling.', usage: 'Semantic tagging, web forms, structured indexing schema.', projects: 'SEO Performance, Technical Audits' },
                { name: 'CSS', desc: 'Custom style systems and layouts using Flexbox, CSS Grid, and responsive viewports.', usage: 'Responsive layout mechanics, custom animations, accessibility compliance.', projects: 'Premium Portfolio, Task Planner' },
                { name: 'JavaScript', desc: 'Asynchronous event triggers, dynamic memory caches, and custom math structures.', usage: 'DOM event bindings, async REST API fetch, caching hooks.', projects: 'Weather Analytics, Financial Ledger' },
                { name: 'React', desc: 'Modular component-based UI engineering, custom hooks, and state optimization.', usage: 'State management, page-transition effects, interactive dashboards.', projects: 'All core projects' },
              ].map((tech) => (
                <motion.div 
                  key={tech.name} 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    trackEvent('view_project', tech.name);
                    onSkillClick?.(tech.name);
                  }}
                  className="bg-card-bg border border-border-line p-5 rounded-xl space-y-3 hover:border-accent/40 hover:shadow-md transition-all duration-300 cursor-pointer relative group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-display font-bold text-sm text-primary group-hover:text-accent transition-colors">{tech.name}</strong>
                    <span className="font-sans text-[9px] font-bold uppercase text-accent bg-accent/10 px-2 py-0.5 rounded">FRONTEND</span>
                  </div>
                  <p className="font-sans text-[11px] text-text-dark/75 leading-relaxed">{tech.desc}</p>
                  <div className="pt-2 border-t border-border-line/60 space-y-1">
                    <span className="block font-sans text-[9px] text-text-dark/40 font-bold uppercase">USAGE AREA</span>
                    <span className="block font-sans text-[10px] text-text-dark/80 font-medium leading-relaxed">{tech.usage}</span>
                  </div>
                  {/* Click-to-filter Tooltip */}
                  <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] font-sans font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded pointer-events-none">
                    Click to filter
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Analytics Category */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xs text-accent uppercase tracking-widest border-b border-border-line pb-2">
              Data Analytics & Relational Databases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: 'Excel', desc: 'Deep metrics exploration, aggregate calculations, and spreadsheet models.', usage: 'Pivot tables, analytical reports, solver regressions.', projects: 'Conversion Funnel Modeling' },
                { name: 'SQL', desc: 'Database querying, structure normalization, and custom pipeline reports.', usage: 'JOIN querying, index performance tuning, schema architecture.', projects: 'Leads Pipeline, Database Audits' },
                { name: 'Power BI', desc: 'Interactive corporate telemetry panels and dashboard reporting.', usage: 'KPI tracking, metrics analytics dashboards.', projects: 'Interactive Financial Ledger' },
                { name: 'Google Analytics', desc: 'Crawl optimization and acquisition channel performance logs.', usage: 'Traffic behavior tracking, conversion funnel modeling.', projects: 'Crawl Audits, Portfolio Tracking' },
              ].map((tech) => (
                <motion.div 
                  key={tech.name} 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    trackEvent('view_project', tech.name);
                    onSkillClick?.(tech.name);
                  }}
                  className="bg-card-bg border border-border-line p-5 rounded-xl space-y-3 hover:border-accent/40 hover:shadow-md transition-all duration-300 cursor-pointer relative group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-display font-bold text-sm text-primary group-hover:text-accent transition-colors">{tech.name}</strong>
                    <span className="font-sans text-[9px] font-bold uppercase text-accent bg-accent/10 px-2 py-0.5 rounded">ANALYTICS</span>
                  </div>
                  <p className="font-sans text-[11px] text-text-dark/75 leading-relaxed">{tech.desc}</p>
                  <div className="pt-2 border-t border-border-line/60 space-y-1">
                    <span className="block font-sans text-[9px] text-text-dark/40 font-bold uppercase">USAGE AREA</span>
                    <span className="block font-sans text-[10px] text-text-dark/80 font-medium leading-relaxed">{tech.usage}</span>
                  </div>
                  {/* Click-to-filter Tooltip */}
                  <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] font-sans font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded pointer-events-none">
                    Click to filter
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools Category */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xs text-accent uppercase tracking-widest border-b border-border-line pb-2">
              Development Tools & Workspace
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: 'Git', desc: 'Distributed version control for code repository safety and auditing.', usage: 'Branch management, commit integrity tracking.', projects: 'All source control' },
                { name: 'GitHub', desc: 'Collaboration repository hubs and static build pipeline workflows.', usage: 'Continuous workflows, public release deployments.', projects: 'Portfolios, Repositories' },
                { name: 'Firebase', desc: 'Cloud storage, serverless auth gates, and real-time databases.', usage: 'Firestore write/read logs, OAuth, hosting services.', projects: 'Portfolio Contacts' },
                { name: 'VS Code', desc: 'Modern customized local development IDE with lint constraints.', usage: 'Code editing, style auditing, workspace tooling.', projects: 'Development environment' },
              ].map((tech) => (
                <motion.div 
                  key={tech.name} 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    trackEvent('view_project', tech.name);
                    onSkillClick?.(tech.name);
                  }}
                  className="bg-card-bg border border-border-line p-5 rounded-xl space-y-3 hover:border-accent/40 hover:shadow-md transition-all duration-300 cursor-pointer relative group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-display font-bold text-sm text-primary group-hover:text-accent transition-colors">{tech.name}</strong>
                    <span className="font-sans text-[9px] font-bold uppercase text-accent bg-accent/10 px-2 py-0.5 rounded">TOOLS</span>
                  </div>
                  <p className="font-sans text-[11px] text-text-dark/75 leading-relaxed">{tech.desc}</p>
                  <div className="pt-2 border-t border-border-line/60 space-y-1">
                    <span className="block font-sans text-[9px] text-text-dark/40 font-bold uppercase">USAGE AREA</span>
                    <span className="block font-sans text-[10px] text-text-dark/80 font-medium leading-relaxed">{tech.usage}</span>
                  </div>
                  {/* Click-to-filter Tooltip */}
                  <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] font-sans font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded pointer-events-none">
                    Click to filter
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. RESUME CENTER */}
      <section id="about-resume-center-section" className="space-y-10">
        <div className="space-y-3">
          <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
            Digital Credentials
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Resume Center & Preview
          </h2>
          <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed max-w-2xl">
            Review my professional qualifications, experience summaries, and educational background inside this live printable preview worksheet.
          </p>
        </div>

        {/* Live Resume Sheet Mockup */}
        <div className="bg-card-bg border border-border-line rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 max-w-4xl mx-auto border-t-4 border-t-primary">
          
          {/* Resume Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-border-line/70 pb-6 gap-4">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-2xl text-primary">SUMIT KUMAR</h3>
              <p className="font-sans text-xs sm:text-sm text-accent font-bold uppercase tracking-wider">
                Frontend Developer & Business Data Analyst
              </p>
            </div>
            <div className="font-sans text-xs text-text-dark/70 space-y-1 text-left sm:text-right font-medium">
              <p>Email: codewithw3s@gmail.com</p>
              <p>Location: Chhattisgarh, India</p>
              <p>GitHub: github.com/w3s40</p>
            </div>
          </div>

          {/* Education Summary */}
          <div className="space-y-3 text-left">
            <h4 className="font-display font-bold text-xs text-primary uppercase tracking-widest border-l-2 border-accent pl-2">
              Education
            </h4>
            <div className="font-sans text-xs sm:text-sm">
              <div className="flex justify-between font-bold text-primary">
                <span>Bachelor of Computer Applications (BCA)</span>
                <span className="text-text-dark/50">Graduation Class of 2026</span>
              </div>
              <p className="text-text-dark/70 text-[11px] sm:text-xs">ISBM University • Core focus on relational databases, software logic, and data structures.</p>
            </div>
          </div>

          {/* Experience Summary */}
          <div className="space-y-4 text-left">
            <h4 className="font-display font-bold text-xs text-primary uppercase tracking-widest border-l-2 border-accent pl-2">
              Experience Summary
            </h4>
            
            <div className="space-y-3 font-sans text-xs sm:text-sm">
              <div>
                <div className="flex justify-between font-bold text-primary">
                  <span>Freelance Web UI Developer & Data Analyst</span>
                  <span className="text-text-dark/50">2024 - Present</span>
                </div>
                <p className="text-text-dark/60 text-[11px] sm:text-xs italic">Contract Consultant</p>
                <ul className="list-disc pl-5 mt-1 text-[11px] sm:text-xs text-text-dark/85 space-y-1 leading-relaxed">
                  <li>Building responsive frontend React portfolios and custom dashboard telemetry with zero-render redundancies.</li>
                  <li>Drafting high-efficiency SQL query metrics and Power BI data models to help startups log user leads pipelines.</li>
                  <li>Optimizing Core Web Vitals, JSON-LD schemas, and heading semantic metadata, increasing organic user indexing by 15%.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between font-bold text-primary">
                  <span>Academic Software Projects</span>
                  <span className="text-text-dark/50">2023 - 2026</span>
                </div>
                <p className="text-text-dark/60 text-[11px] sm:text-xs italic">ISBM University BCA Projects</p>
                <ul className="list-disc pl-5 mt-1 text-[11px] sm:text-xs text-text-dark/85 space-y-1 leading-relaxed">
                  <li>Developed asynchronous meteorological visualization apps in React mapping humidity trends with Recharts.</li>
                  <li>Coded offline-capable planning dashboards using local persistence storage matrices to reduce task organization fatigue.</li>
                </ul>
              </div>
            </div>
          </div>          {/* Skills Summary */}
          <div className="space-y-3 text-left">
            <h4 className="font-display font-bold text-xs text-primary uppercase tracking-widest border-l-2 border-accent pl-2">
              Skills Summary (Interactive)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans text-xs sm:text-sm pt-1">
              <div className="space-y-2">
                <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Frontend</strong>
                <div className="flex flex-wrap gap-1.5">
                  {['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS', 'Motion', 'Web Accessibility'].map((skill) => (
                    <div key={skill} className="relative group">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          trackEvent('view_project', skill);
                          onSkillClick?.(skill);
                        }}
                        className="px-2 py-0.5 text-[10px] font-sans font-semibold rounded bg-primary/5 hover:bg-accent/15 border border-primary/10 hover:border-accent/30 text-text-dark/85 hover:text-primary transition-all duration-200 cursor-pointer"
                      >
                        {skill}
                      </motion.button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[9px] font-bold text-secondary bg-primary rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                        Click to filter projects
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Analytics & Database</strong>
                <div className="flex flex-wrap gap-1.5">
                  {['SQL', 'PostgreSQL', 'Excel', 'Power BI', 'Data Visualization', 'Recharts'].map((skill) => (
                    <div key={skill} className="relative group">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          trackEvent('view_project', skill);
                          onSkillClick?.(skill);
                        }}
                        className="px-2 py-0.5 text-[10px] font-sans font-semibold rounded bg-primary/5 hover:bg-accent/15 border border-primary/10 hover:border-accent/30 text-text-dark/85 hover:text-primary transition-all duration-200 cursor-pointer"
                      >
                        {skill}
                      </motion.button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[9px] font-bold text-secondary bg-primary rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                        Click to filter projects
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <strong className="text-primary block font-bold text-[11px] uppercase tracking-wider">Tools & Workspaces</strong>
                <div className="flex flex-wrap gap-1.5">
                  {['Git', 'GitHub', 'Firebase', 'VS Code', 'Lighthouse', 'Search Console'].map((skill) => (
                    <div key={skill} className="relative group">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          trackEvent('view_project', skill);
                          onSkillClick?.(skill);
                        }}
                        className="px-2 py-0.5 text-[10px] font-sans font-semibold rounded bg-primary/5 hover:bg-accent/15 border border-primary/10 hover:border-accent/30 text-text-dark/85 hover:text-primary transition-all duration-200 cursor-pointer"
                      >
                        {skill}
                      </motion.button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[9px] font-bold text-secondary bg-primary rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                        Click to filter projects
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Download Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="resume-center-download-btn"
            onClick={() => {
              trackEvent('download_resume', 'about_resume_btn');
              generateResumePDF();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 font-sans text-xs sm:text-sm font-bold px-6 py-3 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Styled PDF</span>
          </button>

          <button
            id="resume-center-print-btn"
            onClick={() => {
              trackEvent('download_resume', 'about_print_btn');
              window.print();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary text-secondary hover:bg-primary/95 font-sans text-xs sm:text-sm font-bold px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

      </section>

    </div>
  );
}

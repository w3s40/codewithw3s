/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { blogItems as staticBlogItems } from '../data';
import { getCMSBlogs, EnhancedBlogItem } from '../lib/cms';

export default function BlogView() {
  const [blogsList, setBlogsList] = useState<EnhancedBlogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Frontend Development' | 'JavaScript' | 'React' | 'Data Analytics' | 'SEO Optimization'>('All');
  const [readingArticleId, setReadingArticleId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const dynamicBlogs = await getCMSBlogs();
        // Only filter private drafts for anonymous visitors
        const publicBlogs = dynamicBlogs.filter(b => !b.isDraft);
        setBlogsList(publicBlogs.length > 0 ? publicBlogs : staticBlogItems.map(item => ({
          ...item,
          content: `### Introduction\nThis is a placeholder content loaded as a fallback for the article "${item.title}".\n\n### Detailed Analysis\nWriting clean production systems requires understanding state optimization and zero-render bottlenecks.`,
          isDraft: false,
          seoTitle: item.title,
          seoKeywords: 'React, SEO, Performance, Developer',
          featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
        })));
      } catch (err) {
        console.error('Error loading blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const categories = [
    'All',
    'Frontend Development',
    'JavaScript',
    'React',
    'Data Analytics',
    'SEO Optimization',
  ];

  const filteredBlogs = blogsList.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getArticleContent = (id: string) => {
    const matched = blogsList.find(b => b.id === id);
    return matched?.content || "Detailed article content is being compiled. Please return shortly.";
  };

  const activeArticle = blogsList.find(b => b.id === readingArticleId);

  return (
    <div id="blog-system-view" className="space-y-16 pb-24 text-left">
      
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
          Technical Logs & Articles
        </span>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
          Engineering & Analytics Blog
        </h1>
        <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed">
          Sharing structured research notes, coding optimizations, database query analyses, and professional development milestones.
        </p>
      </div>

      {/* Main Blog Core */}
      {!readingArticleId ? (
        <div className="space-y-10">
          
          {/* Controls Bar: Search + Category Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-border-line pb-8">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <input
                id="blog-search-bar"
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-line bg-card-bg font-sans text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <Search className="w-4 h-4 text-text-dark/40 absolute left-3.5 top-3.5" />
            </div>

            {/* Category Filter Pills */}
            <div className="md:col-span-8 flex flex-wrap gap-1.5 justify-start md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`blog-category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-3.5 py-1.5 rounded-full font-sans text-[11px] font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary text-secondary'
                      : 'bg-primary/5 text-primary hover:bg-primary/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Articles list grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div 
                  key={`blog-skeleton-${idx}`}
                  className="bg-card-bg border border-border-line rounded-2xl p-6 space-y-5 flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-3">
                    <div className="h-4 bg-primary/10 rounded w-1/4"></div>
                    <div className="h-6 bg-primary/10 rounded w-3/4 mt-2"></div>
                    <div className="space-y-2 mt-2">
                      <div className="h-3.5 bg-primary/5 rounded w-full"></div>
                      <div className="h-3.5 bg-primary/5 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border-line/60 flex items-center justify-between">
                    <div className="h-3.5 bg-primary/10 rounded w-1/3"></div>
                    <div className="h-3.5 bg-primary/10 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  id={`blog-card-${blog.id}`}
                  className="bg-card-bg border border-border-line rounded-2xl p-6 space-y-5 flex flex-col justify-between hover:border-accent hover:shadow-xs transition-all duration-300"
                >
                  <div className="space-y-3">
                    <span className="font-display font-extrabold text-[10px] text-accent uppercase tracking-wider block">
                      {blog.category}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-primary leading-snug">
                      {blog.title}
                    </h3>
                    <p className="font-sans text-xs text-text-dark/70 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border-line/60 flex items-center justify-between text-[11px] font-sans text-text-dark/50 font-semibold">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime}
                      </span>
                    </div>

                    <button
                      id={`read-article-btn-${blog.id}`}
                      onClick={() => setReadingArticleId(blog.id)}
                      className="flex items-center gap-1 font-bold text-primary hover:text-accent transition-all cursor-pointer"
                    >
                      <span>Read article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-16 space-y-2 bg-primary/[0.01] border border-border-dashed border-border-line rounded-2xl">
                <BookOpen className="w-8 h-8 text-text-dark/35 mx-auto" />
                <h4 className="font-display font-bold text-sm text-primary">No articles found</h4>
                <p className="font-sans text-xs text-text-dark/50">Try broadening your keywords or resetting filters.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Reading Single Article Core */
        <div className="max-w-3xl space-y-8">
          
          {/* Back button */}
          <button
            id="back-to-blog-grid-btn"
            onClick={() => setReadingArticleId(null)}
            className="inline-flex items-center space-x-2 text-primary hover:text-accent font-sans text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to article index</span>
          </button>

          {/* Article Header block */}
          <div className="space-y-4 pb-6 border-b border-border-line">
            <span className="font-display font-extrabold text-xs text-accent uppercase tracking-widest block">
              {activeArticle?.category}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary tracking-tight leading-tight">
              {activeArticle?.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-text-dark/60 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {activeArticle?.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activeArticle?.readTime}
              </span>
            </div>
          </div>

          {/* Markdown Simulated Text Block */}
          <div className="prose max-w-none text-text-dark/85 font-sans text-sm sm:text-base leading-relaxed space-y-6">
            {getArticleContent(readingArticleId).split('\n\n').map((paragraph, idx) => {
              if (paragraph.trim().startsWith('###')) {
                return (
                  <h4 key={idx} className="font-display font-extrabold text-lg sm:text-xl text-primary mt-8 mb-4">
                    {paragraph.replace('###', '').trim()}
                  </h4>
                );
              }
              if (paragraph.trim().startsWith('##')) {
                return (
                  <h3 key={idx} className="font-display font-extrabold text-xl sm:text-2xl text-primary mt-10 mb-4">
                    {paragraph.replace('##', '').trim()}
                  </h3>
                );
              }
              if (paragraph.trim().startsWith('*')) {
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
                    {paragraph.split('\n').map((li, lIdx) => (
                      <li key={lIdx} className="text-text-dark/80">
                        {li.replace('*', '').trim()}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.trim().startsWith('`')) {
                return (
                  <pre key={idx} className="p-4 bg-primary/[0.02] border border-border-line rounded-lg font-mono text-xs overflow-x-auto text-primary leading-relaxed my-4">
                    <code>{paragraph.replace(/`/g, '').trim()}</code>
                  </pre>
                );
              }
              return (
                <p key={idx} className="leading-relaxed text-text-dark/80">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Article Footer section */}
          <div className="pt-8 border-t border-border-line flex justify-between">
            <button
              id="back-to-index-footer-btn"
              onClick={() => setReadingArticleId(null)}
              className="font-sans text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer"
            >
              ← Back to articles
            </button>
            <span className="font-sans text-xs text-text-dark/40 font-semibold uppercase">WRITTEN BY SUMIT KUMAR</span>
          </div>

        </div>
      )}

    </div>
  );
}

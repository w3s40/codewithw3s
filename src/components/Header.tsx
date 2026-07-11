/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sun, Moon, Github, Linkedin, Globe2, Printer, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface HeaderProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Header({ activePage, setActivePage, theme, toggleTheme }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { language, setLanguage, t } = useLanguage();
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);

  const handleShare = async () => {
    const shareData = {
      title: "Sumit Kumar's Portfolio",
      text: "Check out Sumit Kumar's professional portfolio - Frontend & Analytics Developer!",
      url: window.location.href || window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.info('Native share error, falling back to copy:', err);
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href || window.location.origin);
      setShareTooltip('Link Copied!');
      setTimeout(() => setShareTooltip(null), 2500);
    } catch (err) {
      console.error('Failed to copy share link:', err);
      setShareTooltip('Failed to copy');
      setTimeout(() => setShareTooltip(null), 2500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: t('home') },
    { id: 'projects', label: t('projects') },
    { id: 'analytics', label: t('analytics') },
    { id: 'blog', label: t('blog') },
    { id: 'about', label: t('about') },
    { id: 'contact', label: t('contact') },
  ];

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header
      id="portfolio-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card-bg/95 backdrop-blur-md border-b border-border-line py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Scroll Progress Indicator */}
      <div 
        className="absolute bottom-0 left-0 h-[3px] bg-accent transition-all duration-100 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo / Signature */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex items-center group cursor-pointer"
        >
          <div className="px-3 h-10 rounded-lg bg-primary flex items-center justify-center text-secondary font-mono font-extrabold text-xs tracking-tight transition-transform duration-300 group-hover:scale-105">
            CodeWithW3S
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-md font-sans text-xs lg:text-sm font-bold transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-dark/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Quick Links & Mode Controls */}
        <div className="hidden md:flex items-center space-x-4">
          
          {/* Language Toggle */}
          <button
            id="language-toggle-desktop"
            onClick={toggleLanguage}
            className="p-2.5 rounded-lg border border-border-line text-text-dark hover:bg-primary/5 transition-colors cursor-pointer flex items-center gap-1.5 font-sans text-xs font-bold"
            aria-label="Toggle language"
          >
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'en' ? 'हिं' : 'EN'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-desktop"
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-border-line text-text-dark hover:bg-primary/5 transition-colors cursor-pointer overflow-hidden"
            aria-label="Toggle visual theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Share Button (Web Share API with Clipboard Fallback) */}
          <div className="relative">
            <button
              id="header-share-btn-desktop"
              onClick={handleShare}
              className="p-2.5 rounded-lg border border-border-line text-text-dark hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center relative"
              aria-label="Share Portfolio"
              title="Share Portfolio"
            >
              <Share2 className="w-4 h-4 text-primary" />
            </button>
            <AnimatePresence>
              {shareTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded bg-primary text-secondary text-[11px] font-sans font-bold whitespace-nowrap shadow-md z-50 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  {shareTooltip}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="https://github.com/w3s40"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg border border-border-line text-text-dark hover:bg-primary/5 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4 text-text-dark/70" />
          </a>

          <a
            href="https://www.linkedin.com/in/codewithw3s-undefined-058bb741b/?skipRedirect=true"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg border border-border-line text-text-dark hover:bg-primary/5 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4 text-text-dark/70" />
          </a>

          <button
            id="header-download-resume-btn"
            onClick={() => {
              window.print();
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 border border-border-line text-text-dark hover:bg-primary/5 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-primary" />
            <span>{t('downloadResume')}</span>
          </button>

          <button
            id="header-cta-btn"
            onClick={() => handleNavClick('contact')}
            className="group flex items-center space-x-2 bg-primary text-secondary px-5 py-2.5 rounded-lg font-sans text-xs font-bold transition-all duration-300 hover:bg-primary/95 hover:shadow-md cursor-pointer"
          >
            <span>{t('letsConnect')}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile menu controls */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Language Toggle for mobile */}
          <button
            id="language-toggle-mobile"
            onClick={toggleLanguage}
            className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center gap-1 font-sans text-xs font-bold"
            aria-label="Toggle language"
          >
            <Globe2 className="w-4 h-4" />
            <span>{language === 'en' ? 'हिं' : 'EN'}</span>
          </button>

          {/* Theme Toggle Button for mobile view */}
          <button
            id="theme-toggle-mobile"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-colors cursor-pointer overflow-hidden"
            aria-label="Toggle visual theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Mobile Share Button */}
          <div className="relative flex items-center justify-center">
            <button
              id="header-share-btn-mobile"
              onClick={handleShare}
              className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Share Portfolio"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {shareTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute top-full mt-2 right-0 px-2.5 py-1.5 rounded bg-primary text-secondary text-[11px] font-sans font-bold whitespace-nowrap shadow-md z-50 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  {shareTooltip}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-border-line bg-card-bg overflow-hidden shadow-inner"
          >
            <div className="px-6 py-6 space-y-3">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-sans text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-primary text-secondary'
                        : 'text-text-dark/85 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              
              <div className="pt-4 border-t border-border-line flex justify-around">
                <a
                  href="https://github.com/w3s40"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-text-dark/70 hover:text-primary py-2 font-sans text-xs font-semibold"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/codewithw3s-undefined-058bb741b/?skipRedirect=true"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-text-dark/70 hover:text-primary py-2 font-sans text-xs font-semibold"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="mobile-header-download-resume-btn"
                  onClick={() => {
                    window.print();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center flex items-center justify-center space-x-2 border border-border-line text-text-dark hover:bg-primary/5 py-3.5 rounded-lg font-sans text-sm font-bold transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-primary" />
                  <span>{t('downloadResume')}</span>
                </button>

                <button
                  id="mobile-header-cta-btn"
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-center flex items-center justify-center space-x-2 bg-primary text-secondary py-3.5 rounded-lg font-sans text-sm font-bold transition-all duration-200 cursor-pointer"
                >
                  <span>{t('letsConnect')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

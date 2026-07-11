/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, ArrowUp } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ProjectsView from './components/ProjectsView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AnalyticsView from './components/AnalyticsView';
import BlogView from './components/BlogView';
import ThankYouView from './components/ThankYouView';
import NotFoundView from './components/NotFoundView';
import PrintResume from './components/PrintResume';
import { PageId } from './types';
import { trackEvent } from './lib/analytics';
import { useSEO } from './hooks/useSEO';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  useSEO(activePage);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [projectFilterKeyword, setProjectFilterKeyword] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [navProgress, setNavProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Simulated page navigation progress bar for visual feedback
  useEffect(() => {
    setIsNavigating(true);
    setNavProgress(15);

    const timer1 = setTimeout(() => setNavProgress(45), 100);
    const timer2 = setTimeout(() => setNavProgress(75), 250);
    const timer3 = setTimeout(() => setNavProgress(100), 450);
    const timer4 = setTimeout(() => {
      setIsNavigating(false);
      setNavProgress(0);
    }, 650);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [activePage]);

  // Handle scroll progress and scroll-to-top visibility tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }

      // Show scroll-to-top button once past the initial viewport height
      if (window.scrollY > window.innerHeight) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Trigger site analytics visit on mount
  useEffect(() => {
    trackEvent('visit');
  }, []);

  // Load and apply theme on mounting or switching
  useEffect(() => {
    const savedTheme = localStorage.getItem('sumit_portfolio_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to light as specified by agency visual rules
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Keyboard navigation support with Arrow keys and designated hotkeys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key events if user is typing in an input or textarea
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const primaryPages: PageId[] = ['home', 'projects', 'about', 'contact'];
      const currentIndex = primaryPages.indexOf(activePage);

      if (event.key === 'ArrowRight') {
        if (currentIndex !== -1) {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % primaryPages.length;
          const targetPage = primaryPages[nextIndex];
          setActivePage(targetPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setToastMessage(`Switched to ${targetPage.charAt(0).toUpperCase() + targetPage.slice(1)} page (→ Key)`);
          setShowToast(true);
        }
      } else if (event.key === 'ArrowLeft') {
        if (currentIndex !== -1) {
          event.preventDefault();
          const prevIndex = (currentIndex - 1 + primaryPages.length) % primaryPages.length;
          const targetPage = primaryPages[prevIndex];
          setActivePage(targetPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setToastMessage(`Switched to ${targetPage.charAt(0).toUpperCase() + targetPage.slice(1)} page (← Key)`);
          setShowToast(true);
        }
      } else if (['1', '2', '3', '4'].includes(event.key)) {
        event.preventDefault();
        const numToPageMap: Record<string, PageId> = {
          '1': 'home',
          '2': 'projects',
          '3': 'about',
          '4': 'contact'
        };
        const targetPage = numToPageMap[event.key];
        setActivePage(targetPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setToastMessage(`Switched to ${targetPage.charAt(0).toUpperCase() + targetPage.slice(1)} page (Hotkey ${event.key})`);
        setShowToast(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('sumit_portfolio_theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSkillClick = (skillName: string) => {
    let keyword = '';
    if (skillName.includes('React') || skillName.includes('TypeScript')) {
      keyword = 'React';
    } else if (skillName.includes('Tailwind')) {
      keyword = 'Tailwind';
    } else if (skillName.includes('SQL') || skillName.includes('Schema')) {
      keyword = 'SQL';
    } else if (skillName.includes('Excel')) {
      keyword = 'Excel';
    } else if (skillName.includes('Git')) {
      keyword = 'Git';
    } else {
      keyword = skillName;
    }
    
    setProjectFilterKeyword(keyword);
    setActivePage('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setToastMessage(`Switched to Projects page. Applied filter for: "${keyword}"`);
    setShowToast(true);
  };

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomeView
            setActivePage={setActivePage}
            setSelectedProjectId={setSelectedProjectId}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            initialFilterKeyword={projectFilterKeyword}
            setInitialFilterKeyword={setProjectFilterKeyword}
          />
        );
      case 'about':
        return <AboutView onSkillClick={handleSkillClick} />;
      case 'contact':
        return (
          <ContactView 
            onFormSubmit={() => {
              setToastMessage('Your inquiry has been successfully sent! I will review it and get back to you soon.');
              setShowToast(true);
              setActivePage('thankyou');
            }} 
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'blog':
        return <BlogView />;
      case 'thankyou':
        return <ThankYouView setActivePage={setActivePage} />;
      case '404':
        return <NotFoundView setActivePage={setActivePage} />;
      default:
        return <NotFoundView setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-light text-text-dark font-sans selection:bg-primary selection:text-secondary antialiased overflow-x-hidden transition-colors duration-300">
      
      {/* Top Page Navigation Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
        <div 
          className="h-full bg-accent shadow-[0_1px_8px_rgba(207,81,61,0.5)]"
          style={{ 
            width: `${navProgress}%`,
            opacity: isNavigating ? 1 : 0,
            transition: isNavigating ? 'width 150ms ease-out, opacity 150ms ease-out' : 'opacity 200ms ease-in-out'
          }}
        />
      </div>

      {/* 1. Header Navigation with Theme controls */}
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* 2. Main content block - with page transitions */}
      <main className="flex-grow pt-20 lg:pt-24 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 relative pb-16">
        {/* Subtle Scroll Progress Bar at the top of the main container */}
        <div className="absolute top-16 lg:top-20 left-6 sm:left-8 lg:left-12 right-6 sm:right-8 lg:right-12 h-1 bg-border-line/20 dark:bg-border-line/10 rounded-full overflow-hidden z-10">
          <div 
            className="h-full bg-accent transition-all duration-100 ease-out rounded-full" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer Section */}
      <Footer setActivePage={setActivePage} />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-card-bg border border-border-line rounded-xl shadow-lg p-4 flex items-start space-x-3.5 backdrop-blur-sm"
          >
            <div className="flex-shrink-0 bg-accent/10 dark:bg-accent/20 p-1.5 rounded-lg text-accent">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-grow space-y-1">
              <h4 className="font-display font-bold text-xs sm:text-sm text-primary">
                Submission Successful
              </h4>
              <p className="font-sans text-xs text-text-dark/80 leading-relaxed">
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="flex-shrink-0 text-text-dark/40 hover:text-text-dark/85 p-1 rounded-lg hover:bg-border-line/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 bg-accent hover:bg-accent/95 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center border border-accent/20"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Printable clean PDF resume container (rendered on print viewports only) */}
      <PrintResume />
      
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Linkedin, Github, Mail, ArrowUp, Twitter, Instagram, MessageCircle, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { PageId } from '../types';
import Newsletter from './Newsletter';

interface FooterProps {
  setActivePage: (page: PageId) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href || window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const url = encodeURIComponent(window.location.href || window.location.origin);
    const text = encodeURIComponent("Check out Sumit Kumar's professional portfolio - Frontend & Analytics Developer!");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href || window.location.origin);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyStatus('Failed');
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Framer Motion Animation Variants for Sequential Fade-in Staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 110,
        damping: 16,
      },
    },
  };

  return (
    <footer id="portfolio-footer" className="bg-primary text-bg-light pt-20 pb-12 overflow-hidden border-t border-bg-light/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Row 1: Premium 4-Column Grid with Sequential Scroll Entrance Animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 lg:gap-x-12 pb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          {/* Column 1: Logo & Designation */}
          <motion.div className="lg:col-span-4 space-y-5 text-left" variants={columnVariants}>
            <button
              id="footer-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
            >
              <div className="px-3 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-mono font-extrabold text-xs tracking-tight transition-transform duration-200 group-hover:scale-105">
                CodeWithW3S
              </div>
              <div>
                <span className="block font-display font-extrabold text-bg-light text-base tracking-tight leading-none">
                  Sumit Kumar
                </span>
                <span className="block font-sans text-xs text-secondary/80 tracking-wider font-semibold mt-1">
                  Frontend & Analytics Professional
                </span>
              </div>
            </button>
            <p className="font-sans text-sm text-bg-light/70 max-w-sm leading-relaxed">
              Developing performant frontend systems, elegant user interfaces, and robust business analytics platforms for modern brands.
            </p>
          </motion.div>

          {/* Column 2: Navigation Links */}
          <motion.div className="lg:col-span-2 space-y-4 text-left" variants={columnVariants}>
            <h3 className="font-display font-bold text-xs text-secondary tracking-widest uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {(['home', 'projects', 'about', 'contact'] as PageId[]).map((page) => (
                <li key={page}>
                  <button
                    id={`footer-nav-link-${page}`}
                    onClick={() => handleNavClick(page)}
                    className="font-sans text-sm text-bg-light/70 hover:text-secondary transition-colors duration-200 cursor-pointer capitalize text-left hover:pl-1 transition-all"
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact Info Only */}
          <motion.div className="lg:col-span-3 space-y-4 text-left" variants={columnVariants}>
            <h3 className="font-display font-bold text-xs text-secondary tracking-widest uppercase">
              Contact
            </h3>
            <p className="font-sans text-sm text-bg-light/70 leading-relaxed">
              Available for internship opportunities, freelance consultations, and collaborative roles.
            </p>
            <div className="space-y-3 pt-1">
              <a
                id="footer-contact-email"
                href="mailto:codewithw3s@gmail.com"
                className="flex items-center gap-2.5 font-sans text-sm text-bg-light/70 hover:text-secondary transition-colors duration-200 group"
              >
                <Mail className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform duration-200" />
                <span>codewithw3s@gmail.com</span>
              </a>
              <a
                id="footer-contact-whatsapp"
                href="https://wa.me/codewithw3s"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 font-sans text-sm text-bg-light/70 hover:text-secondary transition-colors duration-200 group"
              >
                <MessageCircle className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform duration-200" />
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div className="lg:col-span-3 text-left" variants={columnVariants}>
            <Newsletter />
          </motion.div>

        </motion.div>

        {/* Row 2: Centered Social Media & Sharing Icons */}
        <div className="py-10 border-t border-bg-light/10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Centered Social Profile Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="font-display font-bold text-[10px] tracking-widest text-secondary/80 uppercase">
              Connect Online
            </span>
            <div className="flex items-center gap-3">
              <a
                id="footer-soc-linkedin"
                href="https://www.linkedin.com/in/codewithw3s-undefined-058bb741b/?skipRedirect=true"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-bg-light/15 bg-bg-light/5 flex items-center justify-center text-bg-light hover:text-primary hover:bg-secondary hover:border-secondary transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a
                id="footer-soc-github"
                href="https://github.com/w3s40"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-bg-light/15 bg-bg-light/5 flex items-center justify-center text-bg-light hover:text-primary hover:bg-secondary hover:border-secondary transition-all duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <Github className="w-4.5 h-4.5" />
              </a>
              <a
                id="footer-soc-twitter"
                href="https://twitter.com/harry9446"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-bg-light/15 bg-bg-light/5 flex items-center justify-center text-bg-light hover:text-primary hover:bg-secondary hover:border-secondary transition-all duration-300 hover:scale-110"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a
                id="footer-soc-instagram"
                href="https://www.instagram.com/harry.analytics?igsh=MWlhYW16eGt0Y2U3bw=="
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-bg-light/15 bg-bg-light/5 flex items-center justify-center text-bg-light hover:text-primary hover:bg-secondary hover:border-secondary transition-all duration-300 hover:scale-110"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Centered Sharing Tools */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="font-display font-bold text-[10px] tracking-widest text-secondary/80 uppercase">
              Share Portfolio
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                id="footer-share-linkedin"
                onClick={shareLinkedIn}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-light/5 hover:bg-bg-light/10 border border-bg-light/10 text-bg-light hover:text-secondary transition-all duration-200 cursor-pointer text-xs font-semibold"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>
              <button
                id="footer-share-twitter"
                onClick={shareTwitter}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-light/5 hover:bg-bg-light/10 border border-bg-light/10 text-bg-light hover:text-secondary transition-all duration-200 cursor-pointer text-xs font-semibold"
                title="Share on Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter</span>
              </button>
              <button
                id="footer-share-copy"
                onClick={copyLinkToClipboard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-light/5 hover:bg-bg-light/10 border border-bg-light/10 text-bg-light hover:text-secondary transition-all duration-200 cursor-pointer text-xs font-semibold min-w-[100px] justify-center"
                title="Copy link to clipboard"
              >
                {copyStatus ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="border-t border-bg-light/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-bg-light/40 text-center sm:text-left">
            &copy; {currentYear} Sumit Kumar. All rights reserved. Designed to specifications.
          </p>
          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="group flex items-center space-x-2 bg-bg-light/5 hover:bg-bg-light/10 border border-bg-light/10 text-bg-light px-4 py-2 rounded-lg font-sans text-xs font-semibold transition-all duration-200 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}

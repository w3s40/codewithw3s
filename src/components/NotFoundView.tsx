/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, Home, ArrowRight } from 'lucide-react';
import { PageId } from '../types';

interface NotFoundViewProps {
  setActivePage: (page: PageId) => void;
}

export default function NotFoundView({ setActivePage }: NotFoundViewProps) {
  return (
    <div id="not-found-view" className="max-w-xl mx-auto py-20 text-center space-y-8 flex flex-col items-center">
      
      <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center text-red-500 animate-pulse">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="font-mono text-[11px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded">
          ERROR CODE: 404
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
          Page Not Found
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-dark/75 leading-relaxed max-w-md mx-auto">
          The structural router was unable to resolve the requested coordinates. The path may have changed or the resource has been relocated.
        </p>
      </div>

      {/* Dynamic Navigation Help links */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        <button
          onClick={() => { setActivePage('projects'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="p-3 bg-card-bg border border-border-line rounded-lg font-sans text-xs font-bold text-primary hover:border-accent transition-all cursor-pointer"
        >
          View Projects
        </button>
        <button
          onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="p-3 bg-card-bg border border-border-line rounded-lg font-sans text-xs font-bold text-primary hover:border-accent transition-all cursor-pointer"
        >
          Contact Gateway
        </button>
      </div>

      {/* Return Home */}
      <button
        id="not-found-home-btn"
        onClick={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="group inline-flex items-center space-x-2 bg-primary text-secondary px-6 py-3 rounded-lg font-sans text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span>Return To Homepage</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>

    </div>
  );
}

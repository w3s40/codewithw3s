/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CheckCircle2, Home, ArrowRight, Mail, MapPin } from 'lucide-react';
import { PageId } from '../types';
import confetti from 'canvas-confetti';

interface ThankYouViewProps {
  setActivePage: (page: PageId) => void;
}

export default function ThankYouView({ setActivePage }: ThankYouViewProps) {
  useEffect(() => {
    // Beautiful corner side-burst confetti streams on mount
    const duration = 1.2 * 1000;
    const end = Date.now() + duration;
    const colors = ['#013e37', '#cf513d', '#ffffff', '#ffd700', '#2dd4bf'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);
  return (
    <div id="thank-you-view" className="max-w-xl mx-auto py-16 text-center space-y-8 flex flex-col items-center">
      
      {/* Visual Circle */}
      <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center text-accent animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
          Transmission Logged
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-dark/75 leading-relaxed max-w-md mx-auto">
          Thank you for initiating communication! Your project details and contact credentials have been saved to our Firebase Cloud Firestore database.
        </p>
      </div>

      {/* Direct support grid */}
      <div className="w-full bg-card-bg border border-border-line rounded-xl p-5 space-y-4 text-left">
        <h3 className="font-display font-bold text-xs text-primary uppercase tracking-wider text-center">
          Inquiry Specifications
        </h3>
        
        <div className="space-y-2 text-xs font-sans">
          <div className="flex justify-between py-1.5 border-b border-border-line/50">
            <span className="text-text-dark/40 font-bold uppercase">Average response time</span>
            <span className="text-primary font-bold">&lt; 12 Hours</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border-line/50">
            <span className="text-text-dark/40 font-bold uppercase">Inbox Destination</span>
            <span className="text-primary font-bold">codewithw3s@gmail.com</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-text-dark/40 font-bold uppercase">Sourcing Location</span>
            <span className="text-primary font-bold">Chhattisgarh, India (Remote Ready)</span>
          </div>
        </div>
      </div>

      {/* Home Button */}
      <button
        id="thank-you-home-btn"
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

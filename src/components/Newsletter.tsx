/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { trackEvent } from '../lib/analytics';
import confetti from 'canvas-confetti';

enum OperationType {
  CREATE = 'create',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please provide your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email structure.');
      return;
    }

    setIsSubmitting(true);

    try {
      const subscribersPath = 'subscribers';
      await addDoc(collection(db, subscribersPath), {
        email: trimmedEmail,
        createdAt: serverTimestamp(),
      });

      trackEvent('subscribe_newsletter', trimmedEmail);

      // Trigger standard beautiful confetti for interactive delight
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#013e37', '#cf513d', '#ffffff', '#ffd700']
      });

      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Newsletter submission failure:', err);
      setErrorMsg('Failed to subscribe. Please try again later.');
      handleFirestoreError(err, OperationType.WRITE, 'subscribers');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="newsletter-subscription-container" className="space-y-4">
      <h3 className="font-display font-semibold text-sm text-secondary tracking-wider uppercase">
        Newsletter
      </h3>
      <p className="font-sans text-sm text-bg-light/70 max-w-sm leading-relaxed">
        Subscribe to receive insights on technical SEO strategies, modern React codebases, and performance-driven web engineering.
      </p>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="newsletter-success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start space-x-3 bg-secondary/10 border border-secondary/30 p-4 rounded-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-xs text-secondary uppercase tracking-wider">
                Subscription Confirmed!
              </h4>
              <p className="font-sans text-xs text-bg-light/80 leading-relaxed">
                Thank you for subscribing! You have successfully joined my analytical insights feed.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="newsletter-form"
            id="newsletter-email-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-bg-light/40">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="newsletter-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                disabled={isSubmitting}
                placeholder="Enter your email address"
                className="w-full bg-bg-light/5 text-bg-light placeholder-bg-light/40 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-bg-light/15 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all duration-200"
                required
              />
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center space-x-2 text-red-400 text-xs mt-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <button
              id="newsletter-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/95 text-primary disabled:opacity-50 font-sans text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Subscribe Now</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

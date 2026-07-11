/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, Send, CheckCircle2, AlertCircle, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { trackEvent } from '../lib/analytics';
import confetti from 'canvas-confetti';

interface ContactViewProps {
  onFormSubmit?: () => void;
}

export default function ContactView({ onFormSubmit }: ContactViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Frontend Development',
    budget: '$1,000 - $3,000',
    message: '',
  });

  // Restore draft from localStorage on initial mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('contact_form_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (e) {
      console.error('Failed to restore contact form draft', e);
    }
  }, []);

  // Save draft to localStorage when form data changes
  useEffect(() => {
    try {
      if (formData.name || formData.email || formData.message) {
        localStorage.setItem('contact_form_draft', JSON.stringify(formData));
      }
    } catch (e) {
      console.error('Failed to save contact form draft', e);
    }
  }, [formData]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const projectTypes = [
    'Frontend Development',
    'Responsive Website Development',
    'Dashboard Development',
    'Data Analysis',
    'SEO Optimization',
    'Other Consulting',
  ];

  const budgetOptions = [
    'Less than $1,000',
    '$1,000 - $3,000',
    '$3,000 - $5,000',
    '$5,000+',
    'Internship / Academic Partnership',
    'Full-Time / Venture Hiring',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Your name is required to initialize communication.';
    }
    if (!formData.email.trim()) {
      errors.email = 'An email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email structure.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please input your project or inquiry details.';
    } else if (formData.message.trim().length < 15) {
      errors.message = 'Inquiry details should be at least 15 characters to allow rigorous assessment.';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save directly to Firebase Firestore
      await addDoc(collection(db, 'leads'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        projectType: formData.projectType,
        budget: formData.budget,
        message: formData.message.trim(),
        createdAt: serverTimestamp()
      });

      trackEvent('submit_contact', formData.projectType);

      // Trigger high-fidelity celebration confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#013e37', '#cf513d', '#ffffff', '#ffd700', '#2dd4bf']
      });

      console.log(`[Notification System] Simulated Email Dispatched: A new inquiry has been logged from ${formData.name} <${formData.email}> regarding ${formData.projectType}.`);

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form and clear storage draft
      setFormData({
        name: '',
        email: '',
        projectType: 'Frontend Development',
        budget: '$1,000 - $3,000',
        message: '',
      });
      try {
        localStorage.removeItem('contact_form_draft');
      } catch (e) {
        console.error('Failed to clear contact form draft', e);
      }

      // Call success callback to navigate to thank you page
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (err) {
      console.error("Firestore submission failed: ", err);
      setFormErrors({
        submit: 'Failed to synchronize with Cloud Database. Please check your connectivity and try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-view" className="space-y-16 md:space-y-24 pb-24 text-left">
      
      {/* Page Heading */}
      <div className="space-y-4 max-w-3xl">
        <span className="font-display font-extrabold text-sm text-accent uppercase tracking-widest block">
          Inquiry Gateway
        </span>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
          Let's Build Something Great
        </h1>
        <p className="font-sans text-text-dark/80 text-sm md:text-base leading-relaxed">
          Ready to discuss your project? Let's connect. I am available for internships, contract consulting, and professional developer opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Contact info grid - left side */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-display font-bold text-[11px] text-primary uppercase tracking-wider">
              Direct Contacts & Links
            </h3>
            <p className="font-sans text-xs sm:text-sm text-text-dark/70 leading-relaxed">
              If you prefer standard email, or want to review my live code repositories and social career logs directly, use the communication adapters below.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Email card */}
            <a
              id="contact-email-card"
              href="mailto:codewithw3s@gmail.com"
              className="flex items-center space-x-4 p-5 rounded-xl border border-border-line bg-card-bg hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <Mail className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-sans text-[10px] text-text-dark/50 font-bold uppercase tracking-wider">
                  EMAIL ADDRESS
                </span>
                <span className="block font-sans text-xs sm:text-sm font-semibold text-primary break-all">
                  codewithw3s@gmail.com
                </span>
              </div>
            </a>

            {/* LinkedIn card */}
            <a
              id="contact-linkedin-card"
              href="https://www.linkedin.com/in/codewithw3s-undefined-058bb741b/?skipRedirect=true"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-4 p-5 rounded-xl border border-border-line bg-card-bg hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <Linkedin className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-sans text-[10px] text-text-dark/50 font-bold uppercase tracking-wider">
                  LINKEDIN PROFILE
                </span>
                <span className="block font-sans text-xs sm:text-sm font-semibold text-primary break-all">
                  linkedin.com/in/codewithw3s-058bb741b
                </span>
              </div>
            </a>

            {/* GitHub card */}
            <a
              id="contact-github-card"
              href="https://github.com/w3s40"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-4 p-5 rounded-xl border border-border-line bg-card-bg hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <Github className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-sans text-[10px] text-text-dark/50 font-bold uppercase tracking-wider">
                  GITHUB REPOSITORIES
                </span>
                <span className="block font-sans text-xs sm:text-sm font-semibold text-primary break-all">
                  github.com/w3s40
                </span>
              </div>
            </a>

            {/* Instagram card */}
            <a
              id="contact-instagram-card"
              href="https://www.instagram.com/harry.analytics?igsh=MWlhYW16eGt0Y2U3bw=="
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-4 p-5 rounded-xl border border-border-line bg-card-bg hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <Instagram className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-sans text-[10px] text-text-dark/50 font-bold uppercase tracking-wider">
                  INSTAGRAM
                </span>
                <span className="block font-sans text-xs sm:text-sm font-semibold text-primary break-all">
                  @harry.analytics
                </span>
              </div>
            </a>

            {/* WhatsApp card */}
            <a
              id="contact-whatsapp-card"
              href="https://wa.me/codewithw3s"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-4 p-5 rounded-xl border border-border-line bg-card-bg hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <MessageCircle className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-sans text-[10px] text-text-dark/50 font-bold uppercase tracking-wider">
                  WHATSAPP ID
                </span>
                <span className="block font-sans text-xs sm:text-sm font-semibold text-primary break-all">
                  codewithw3s
                </span>
              </div>
            </a>

          </div>

          {/* Business Hours / Availability block */}
          <div className="border-t border-border-line pt-6">
            <span className="block font-sans text-xs text-accent font-extrabold tracking-wider uppercase mb-1">
              CURRENT STATUS
            </span>
            <p className="font-sans text-xs sm:text-sm text-text-dark/70 leading-relaxed">
              Actively monitoring inbox queries. Average response window: <strong>&lt; 12 hours</strong>. Ready to collaborate internationally.
            </p>
          </div>

        </div>

        {/* Contact Form Section - right side */}
        <div className="lg:col-span-7 bg-card-bg border border-border-line rounded-2xl p-8 md:p-10 shadow-sm">
          
          <AnimatePresence mode="wait">
            {!submitSuccess ? (
              <motion.form
                key="contact-form"
                id="contact-submission-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-xl text-primary">
                    Initiate Project Assessment
                  </h3>
                  <p className="font-sans text-xs text-text-dark/60">
                    Fill in the metrics below to dispatch an automated memo summarizing your technical constraints.
                  </p>
                </div>

                {/* Name field */}
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="block font-sans text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">
                    Your Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Johnathan Doe"
                    className={`w-full px-4 py-3 rounded-lg border bg-card-bg font-sans text-xs sm:text-sm focus:outline-none focus:ring-1 transition-all ${
                      formErrors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-border-line focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {formErrors.name && (
                    <span className="text-red-500 font-sans text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.name}
                    </span>
                  )}
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="block font-sans text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E.g., john@company.com"
                    className={`w-full px-4 py-3 rounded-lg border bg-card-bg font-sans text-xs sm:text-sm focus:outline-none focus:ring-1 transition-all ${
                      formErrors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-border-line focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-red-500 font-sans text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.email}
                    </span>
                  )}
                </div>

                {/* Project Type field */}
                <div className="space-y-1.5">
                  <label htmlFor="project-type-input" className="block font-sans text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">
                    Project Type
                  </label>
                  <select
                    id="project-type-input"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-line bg-card-bg font-sans text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget field (NEW SPECIFICATION) */}
                <div className="space-y-1.5" id="budget-field-container">
                  <label htmlFor="budget-input" className="block font-sans text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">
                    Project Budget / Collaboration Range
                  </label>
                  <select
                    id="budget-input"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border-line bg-card-bg font-sans text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  >
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label htmlFor="message-input" className="block font-sans text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">
                    Message Details
                  </label>
                  <textarea
                    id="message-input"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Briefly detail your performance needs, data dimensions, or timeline parameters..."
                    className={`w-full px-4 py-3 rounded-lg border bg-card-bg font-sans text-xs sm:text-sm focus:outline-none focus:ring-1 transition-all resize-none ${
                      formErrors.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-border-line focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {formErrors.message && (
                    <span className="text-red-500 font-sans text-[11px] font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-primary text-secondary py-3.5 rounded-lg font-sans text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Memo...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Assessment</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="submit-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 space-y-6 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center text-accent">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-2xl text-primary">
                    Transmission Dispatched
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-text-dark/80 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out! Your inquiry has been logged successfully. Sumit Kumar will assess your technical requirements and respond within 12 hours.
                  </p>
                </div>
                <button
                  id="reset-contact-form-btn"
                  onClick={() => setSubmitSuccess(false)}
                  className="font-sans text-xs font-bold text-primary hover:text-accent transition-all cursor-pointer border-b border-primary/30"
                >
                  Send another transmission
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}

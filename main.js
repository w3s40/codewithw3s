// // Portfolio Mobile-First JavaScript - Fixed and Optimized

// class PortfolioApp {
//     constructor() {
//         this.init();
//         this.setupEventListeners();
//         this.startAnimations();
//     }

//     init() {
//         // Initialize components
//         this.initTheme();
//         this.initMobileMenu();
//         this.initLoadingScreen();
//         this.initNavigation();
//         this.initTypingEffect();
//         this.initScrollEffects();
//         this.initTestimonials();
//         this.initCursor();
//         this.initTouchHandling();
//     }

//     initTheme() {
//         this.themeToggle = document.getElementById('themeToggle');
//         const savedTheme = localStorage.getItem('portfolio-theme');
        
//         if (savedTheme) {
//             document.body.setAttribute('data-theme', savedTheme);
//             this.updateThemeIcon(savedTheme);
//         }
        
//         // Ensure theme toggle button exists and has click handler
//         if (this.themeToggle) {
//             this.themeToggle.addEventListener('click', () => {
//                 this.toggleTheme();
//             });
//         }
//     }

//     updateThemeIcon(theme) {
//         if (!this.themeToggle) return;
        
//         const icon = this.themeToggle.querySelector('i');
//         if (icon) {
//             if (theme === 'light') {
//                 icon.className = 'fas fa-sun';
//             } else {
//                 icon.className = 'fas fa-moon';
//             }
//         }
//     }

//     initMobileMenu() {
//         this.mobileMenuOpen = false;
//         this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
//         this.navLinks = document.getElementById('navLinks');
//         this.navbar = document.getElementById('navbar');
        
//         // Ensure mobile menu toggle button exists and has click handler
//         if (this.mobileMenuToggle) {
//             this.mobileMenuToggle.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 this.toggleMobileMenu();
//             });
//         }
        
//         // Close menu when clicking outside
//         document.addEventListener('click', (e) => {
//             if (this.mobileMenuOpen && 
//                 this.navLinks && 
//                 this.mobileMenuToggle &&
//                 !this.navLinks.contains(e.target) && 
//                 !this.mobileMenuToggle.contains(e.target)) {
//                 this.closeMobileMenu();
//             }
//         });

//         // Close menu on escape key
//         document.addEventListener('keydown', (e) => {
//             if (e.key === 'Escape' && this.mobileMenuOpen) {
//                 this.closeMobileMenu();
//             }
//         });
//     }

//     initLoadingScreen() {
//         window.addEventListener('load', () => {
//             const loadingScreen = document.getElementById('loadingScreen');
//             setTimeout(() => {
//                 loadingScreen.classList.add('fade-out');
//                 setTimeout(() => {
//                     loadingScreen.style.display = 'none';
//                 }, 500);
//             }, 1000);
//         });
//     }

//     initNavigation() {
//         this.sections = document.querySelectorAll('section[id]');
//         this.navLinksAll = document.querySelectorAll('.nav-link');
        
//         // Smooth scrolling
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const targetId = anchor.getAttribute('href');
//                 const target = document.querySelector(targetId);
                
//                 if (target) {
//                     const navHeight = this.navbar.offsetHeight;
//                     const targetPosition = target.offsetTop - navHeight - 20;
                    
//                     window.scrollTo({
//                         top: targetPosition,
//                         behavior: 'smooth'
//                     });
                    
//                     // Close mobile menu if open
//                     this.closeMobileMenu();
//                 }
//             });
//         });
//     }

//     // initTypingEffect() {
//     //     this.typewriterText = document.getElementById('typed-text');
//     //     if (!this.typewriterText) return;

//     //     this.texts = [
//     //         'Frontend Developer',
//     //         'UI/UX Designer', 
//     //         'React Developer',
//     //         'JavaScript Expert',
//     //         'Web Designer',
//     //         'Problem Solver'
//     //     ];
//     //     this.textIndex = 0;
//     //     this.charIndex = 0;
//     //     this.isDeleting = false;
//     //     this.typingSpeed = 100;
        
//     //     setTimeout(() => this.typeWriter(), 2000);
//     // }

//     initScrollEffects() {
//         // Throttle scroll events for performance
//         let scrollTimeout;
//         window.addEventListener('scroll', () => {
//             if (scrollTimeout) {
//                 clearTimeout(scrollTimeout);
//             }
//             scrollTimeout = setTimeout(() => {
//                 this.handleScroll();
//             }, 10);
//         });

//         // Intersection Observer for animations
//         this.setupIntersectionObserver();
//     }

//     initTestimonials() {
//         this.testimonialCards = document.querySelectorAll('.testimonial-card');
//         this.testimonialDots = document.querySelectorAll('.testimonial-dot');
//         this.currentTestimonial = 0;
        
//         // Auto-rotate testimonials
//         this.startTestimonialRotation();
//     }

//     initCursor() {
//         this.cursor = document.getElementById('cursor');
//         if (!this.cursor || window.innerWidth <= 768) return;

//         document.addEventListener('mousemove', (e) => {
//             this.cursor.style.left = e.clientX + 'px';
//             this.cursor.style.top = e.clientY + 'px';
//         });

//         // Hide cursor when leaving window
//         document.addEventListener('mouseleave', () => {
//             this.cursor.style.opacity = '0';
//         });

//         document.addEventListener('mouseenter', () => {
//             this.cursor.style.opacity = '1';
//         });
//     }

//     initTouchHandling() {
//         // Handle touch events for better mobile experience
//         let touchStartX = 0;
//         let touchStartY = 0;

//         document.addEventListener('touchstart', (e) => {
//             touchStartX = e.touches[0].clientX;
//             touchStartY = e.touches[0].clientY;
//         }, { passive: true });

//         document.addEventListener('touchmove', (e) => {
//             if (!touchStartX || !touchStartY) return;

//             const touchEndX = e.touches[0].clientX;
//             const touchEndY = e.touches[0].clientY;
//             const diffX = touchStartX - touchEndX;
//             const diffY = touchStartY - touchEndY;

//             // Handle swipe gestures for mobile menu
//             if (Math.abs(diffX) > Math.abs(diffY)) {
//                 if (diffX > 50 && this.mobileMenuOpen) {
//                     this.closeMobileMenu();
//                 }
//             }
//         }, { passive: true });
//     }

//     setupEventListeners() {
//         // Close mobile menu on link click
//         this.navLinks?.addEventListener('click', (e) => {
//             if (e.target.classList.contains('nav-link')) {
//                 this.closeMobileMenu();
//             }
//         });

//         // Testimonial navigation
//         this.testimonialDots.forEach((dot, index) => {
//             dot.addEventListener('click', () => {
//                 this.showTestimonial(index);
//             });
//         });

//         // Project card interactions
//         this.setupProjectInteractions();

//         // Contact form handling
//         this.setupContactInteractions();

//         // Resize handling
//         window.addEventListener('resize', () => {
//             this.handleResize();
//         });

//         // Keyboard navigation
//         document.addEventListener('keydown', (e) => {
//             this.handleKeyboard(e);
//         });
//     }

//     startAnimations() {
//         // Start floating animations
//         this.startFloatingAnimation();
        
//         // Start skill animations
//         this.animateSkills();
//     }

//     // Mobile Menu Methods
//     toggleMobileMenu() {
//         if (!this.navLinks || !this.mobileMenuToggle) {
//             console.warn('Mobile menu elements not found');
//             return;
//         }
        
//         if (this.mobileMenuOpen) {
//             this.closeMobileMenu();
//         } else {
//             this.openMobileMenu();
//         }
//     }

//     openMobileMenu() {
//         if (!this.navLinks || !this.mobileMenuToggle) return;
        
//         this.navLinks.classList.add('show');
//         this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
//         const icon = this.mobileMenuToggle.querySelector('i');
//         if (icon) {
//             icon.className = 'fas fa-times';
//         }
        
//         this.mobileMenuOpen = true;
        
//         // Prevent body scroll when menu is open
//         document.body.style.overflow = 'hidden';
        
//         // Focus first menu item for accessibility
//         const firstLink = this.navLinks.querySelector('.nav-link');
//         if (firstLink) {
//             setTimeout(() => firstLink.focus(), 100);
//         }
        
//         console.log('Mobile menu opened');
//     }

//     closeMobileMenu() {
//         if (!this.navLinks || !this.mobileMenuToggle) return;
        
//         this.navLinks.classList.remove('show');
//         this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
//         const icon = this.mobileMenuToggle.querySelector('i');
//         if (icon) {
//             icon.className = 'fas fa-bars';
//         }
        
//         this.mobileMenuOpen = false;
        
//         // Restore body scroll
//         document.body.style.overflow = '';
        
//         console.log('Mobile menu closed');
//     }

//     // Theme Methods
//     toggleTheme() {
//         if (!this.themeToggle) {
//             console.warn('Theme toggle button not found');
//             return;
//         }
        
//         const currentTheme = document.body.getAttribute('data-theme');
//         const newTheme = currentTheme === 'light' ? '' : 'light';
        
//         document.body.setAttribute('data-theme', newTheme);
//         localStorage.setItem('portfolio-theme', newTheme);
//         this.updateThemeIcon(newTheme);
        
//         // Add smooth transition effect
//         document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
//         setTimeout(() => {
//             document.body.style.transition = '';
//         }, 300);

//         // Announce theme change for accessibility
//         this.announceThemeChange(newTheme);
        
//         console.log('Theme toggled to:', newTheme || 'dark');
//     }

//     announceThemeChange(theme) {
//         const announcement = theme === 'light' ? 'Light theme activated' : 'Dark theme activated';
//         const liveRegion = document.getElementById('live-region');
//         if (liveRegion) {
//             liveRegion.textContent = announcement;
//         }
//     }

//     // Typing Effect
//     typeWriter() {
//         if (!this.typewriterText) return;

//         const currentText = this.texts[this.textIndex];
        
//         if (this.isDeleting) {
//             this.typewriterText.textContent = currentText.substring(0, this.charIndex - 1);
//             this.charIndex--;
//         } else {
//             this.typewriterText.textContent = currentText.substring(0, this.charIndex + 1);
//             this.charIndex++;
//         }

//         let typeSpeed = this.isDeleting ? 50 : this.typingSpeed;

//         if (!this.isDeleting && this.charIndex === currentText.length) {
//             typeSpeed = 2000;
//             this.isDeleting = true;
//         } else if (this.isDeleting && this.charIndex === 0) {
//             this.isDeleting = false;
//             this.textIndex = (this.textIndex + 1) % this.texts.length;
//             typeSpeed = 500;
//         }

//         setTimeout(() => this.typeWriter(), typeSpeed);
//     }

//     // Scroll Effects
//     handleScroll() {
//         this.updateActiveNavigation();
//         this.updateNavbarBackground();
//     }

//     updateActiveNavigation() {
//         let current = '';
//         this.sections.forEach(section => {
//             const sectionTop = section.offsetTop;
//             const sectionHeight = section.clientHeight;
//             if (window.scrollY >= (sectionTop - 200)) {
//                 current = section.getAttribute('id');
//             }
//         });

//         this.navLinksAll.forEach(link => {
//             link.classList.remove('active');
//             if (link.getAttribute('href').substring(1) === current) {
//                 link.classList.add('active');
//             }
//         });
//     }

//     updateNavbarBackground() {
//         if (window.scrollY > 50) {
//             this.navbar.style.background = 'rgba(26, 26, 26, 0.95)';
//             this.navbar.style.backdropFilter = 'blur(10px)';
//         } else {
//             this.navbar.style.background = 'rgba(26, 26, 26, 0.8)';
//             this.navbar.style.backdropFilter = 'blur(20px)';
//         }
//     }

//     setupIntersectionObserver() {
//         const options = {
//             threshold: 0.1,
//             rootMargin: '0px 0px -50px 0px'
//         };

//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('animate-in');
                    
//                     // Trigger specific animations based on element type
//                     if (entry.target.classList.contains('skill-item')) {
//                         this.animateSkillItem(entry.target);
//                     }
                    
//                     if (entry.target.classList.contains('project-card')) {
//                         this.animateProjectCard(entry.target);
//                     }
//                 }
//             });
//         }, options);

//         // Observe all sections and cards
//         document.querySelectorAll('section, .project-card, .skill-item, .contact-item, .certification-card, .timeline-item').forEach(el => {
//             observer.observe(el);
//         });
//     }

//     // Testimonial Methods
//     showTestimonial(index) {
//         // Hide all testimonials
//         this.testimonialCards.forEach(card => {
//             card.classList.remove('active');
//             card.hidden = true;
//         });

//         // Show selected testimonial
//         if (this.testimonialCards[index]) {
//             this.testimonialCards[index].classList.add('active');
//             this.testimonialCards[index].hidden = false;
//         }

//         // Update dots
//         this.testimonialDots.forEach((dot, i) => {
//             dot.classList.toggle('active', i === index);
//             dot.setAttribute('aria-selected', i === index);
//         });

//         this.currentTestimonial = index;
//     }

//     startTestimonialRotation() {
//         setInterval(() => {
//             const nextIndex = (this.currentTestimonial + 1) % this.testimonialCards.length;
//             this.showTestimonial(nextIndex);
//         }, 5000);
//     }

//     // Project Interactions
//     setupProjectInteractions() {
//         const projectCards = document.querySelectorAll('.project-card');
        
//         projectCards.forEach(card => {
//             // Add hover effect for desktop
//             card.addEventListener('mouseenter', () => {
//                 if (window.innerWidth > 768) {
//                     this.animateProjectHover(card, true);
//                 }
//             });

//             card.addEventListener('mouseleave', () => {
//                 if (window.innerWidth > 768) {
//                     this.animateProjectHover(card, false);
//                 }
//             });

//             // Add touch feedback for mobile
//             card.addEventListener('touchstart', () => {
//                 card.style.transform = 'scale(0.98)';
//             });

//             card.addEventListener('touchend', () => {
//                 card.style.transform = '';
//             });
//         });
//     }

//     animateProjectHover(card, isHover) {
//         const iframe = card.querySelector('.project-preview');
//         if (isHover) {
//             iframe.style.transform = 'scale(1.05)';
//         } else {
//             iframe.style.transform = 'scale(1)';
//         }
//     }

//     animateProjectCard(card) {
//         card.style.opacity = '0';
//         card.style.transform = 'translateY(30px)';
        
//         setTimeout(() => {
//             card.style.transition = 'all 0.6s ease';
//             card.style.opacity = '1';
//             card.style.transform = 'translateY(0)';
//         }, 100);
//     }

//     // Contact Interactions
//     setupContactInteractions() {
//         const contactItems = document.querySelectorAll('.contact-item');
        
//         contactItems.forEach(item => {
//             item.addEventListener('click', () => {
//                 const link = item.querySelector('.contact-link');
//                 if (link) {
//                     this.animateContactClick(item);
//                     setTimeout(() => {
//                         if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
//                             window.location.href = link.href;
//                         } else {
//                             window.open(link.href, '_blank', 'noopener,noreferrer');
//                         }
//                     }, 200);
//                 }
//             });
//         });

//         // Social media interactions
//         const socialCards = document.querySelectorAll('.social-card');
//         socialCards.forEach(card => {
//             card.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.animateSocialClick(card);
                
//                 setTimeout(() => {
//                     window.open(card.href, '_blank', 'noopener,noreferrer');
//                 }, 300);
//             });
//         });
//     }

//     animateContactClick(item) {
//         item.style.transform = 'scale(0.95)';
//         setTimeout(() => {
//             item.style.transform = '';
//         }, 150);
//     }

//     animateSocialClick(card) {
//         card.style.transform = 'scale(0.9) rotate(5deg)';
//         setTimeout(() => {
//             card.style.transform = '';
//         }, 200);
//     }

//     // Animation Methods
//     startFloatingAnimation() {
//         const floatingElements = document.querySelectorAll('.about-image-wrapper, .hero-image img');
        
//         floatingElements.forEach((element, index) => {
//             let position = index * 0.5;
//             const animate = () => {
//                 position += 0.01;
//                 element.style.transform = `translateY(${Math.sin(position) * 10}px)`;
//                 requestAnimationFrame(animate);
//             };
//             animate();
//         });
//     }

//     animateSkills() {
//         const skillItems = document.querySelectorAll('.skill-item');
//         skillItems.forEach((item, index) => {
//             item.style.opacity = '0';
//             item.style.transform = 'translateY(20px)';
            
//             setTimeout(() => {
//                 item.style.transition = 'all 0.6s ease';
//                 item.style.opacity = '1';
//                 item.style.transform = 'translateY(0)';
//             }, index * 100);
//         });
//     }

//     animateSkillItem(item) {
//         item.style.opacity = '0';
//         item.style.transform = 'scale(0.8)';
        
//         setTimeout(() => {
//             item.style.transition = 'all 0.5s ease';
//             item.style.opacity = '1';
//             item.style.transform = 'scale(1)';
//         }, 100);
//     }

//     // Utility Methods
//     handleResize() {
//         // Close mobile menu on resize to desktop
//         if (window.innerWidth > 768 && this.mobileMenuOpen) {
//             this.closeMobileMenu();
//         }

//         // Update cursor visibility
//         if (this.cursor) {
//             this.cursor.style.display = window.innerWidth > 768 ? 'block' : 'none';
//         }
//     }

//     handleKeyboard(e) {
//         // Handle keyboard navigation
//         switch(e.key) {
//             case 'Escape':
//                 if (this.mobileMenuOpen) {
//                     this.closeMobileMenu();
//                 }
//                 break;
//             case 'Tab':
//                 // Ensure proper tab navigation in mobile menu
//                 if (this.mobileMenuOpen) {
//                     this.handleTabNavigation(e);
//                 }
//                 break;
//             case 'ArrowLeft':
//                 if (e.target.classList.contains('testimonial-dot')) {
//                     e.preventDefault();
//                     const prevIndex = this.currentTestimonial > 0 ? this.currentTestimonial - 1 : this.testimonialCards.length - 1;
//                     this.showTestimonial(prevIndex);
//                 }
//                 break;
//             case 'ArrowRight':
//                 if (e.target.classList.contains('testimonial-dot')) {
//                     e.preventDefault();
//                     const nextIndex = (this.currentTestimonial + 1) % this.testimonialCards.length;
//                     this.showTestimonial(nextIndex);
//                 }
//                 break;
//         }
//     }

//     handleTabNavigation(e) {
//         const focusableElements = this.navLinks.querySelectorAll('a, button');
//         const firstElement = focusableElements[0];
//         const lastElement = focusableElements[focusableElements.length - 1];

//         if (e.shiftKey) {
//             if (document.activeElement === firstElement) {
//                 e.preventDefault();
//                 lastElement.focus();
//             }
//         } else {
//             if (document.activeElement === lastElement) {
//                 e.preventDefault();
//                 firstElement.focus();
//             }
//         }
//     }

//     // Performance Monitoring
//     measurePerformance() {
//         if ('performance' in window) {
//             window.addEventListener('load', () => {
//                 setTimeout(() => {
//                     const perfData = performance.getEntriesByType('navigation')[0];
//                     console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
//                 }, 0);
//             });
//         }
//     }

//     // Accessibility Features
//     initAccessibility() {
//         // Add skip link functionality
//         const skipLink = document.querySelector('.skip-link');
//         if (skipLink) {
//             skipLink.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const target = document.querySelector('#main');
//                 if (target) {
//                     target.focus();
//                     target.scrollIntoView({ behavior: 'smooth' });
//                 }
//             });
//         }

//         // Add ARIA live region for dynamic content
//         if (!document.getElementById('live-region')) {
//             const liveRegion = document.createElement('div');
//             liveRegion.setAttribute('aria-live', 'polite');
//             liveRegion.setAttribute('aria-atomic', 'true');
//             liveRegion.className = 'sr-only';
//             liveRegion.id = 'live-region';
//             document.body.appendChild(liveRegion);
//         }
//     }

//     // Error Handling
//     handleErrors() {
//         window.addEventListener('error', (e) => {
//             console.error('JavaScript Error:', e.error);
            
//             // Graceful degradation
//             if (e.error.message.includes('animation')) {
//                 console.warn('Disabling animations due to error');
//                 document.body.classList.add('no-animations');
//             }
//         });

//         // Handle unhandled promise rejections
//         window.addEventListener('unhandledrejection', (e) => {
//             console.error('Unhandled Promise Rejection:', e.reason);
//         });
//     }
// }

// // Form Validation and Submission
// class ContactForm {
//     constructor() {
//         this.form = document.getElementById('contact-form');
//         if (this.form) {
//             this.setupFormValidation();
//         }
//     }

//     setupFormValidation() {
//         this.form.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.validateAndSubmit();
//         });

//         // Real-time validation
//         const inputs = this.form.querySelectorAll('input, textarea');
//         inputs.forEach(input => {
//             input.addEventListener('blur', () => {
//                 this.validateField(input);
//             });
//         });
//     }

//     validateField(field) {
//         const value = field.value.trim();
//         let isValid = true;
//         let message = '';

//         switch(field.type) {
//             case 'email':
//                 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                 isValid = emailRegex.test(value);
//                 message = isValid ? '' : 'Please enter a valid email address';
//                 break;
//             case 'tel':
//                 const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//                 isValid = phoneRegex.test(value.replace(/\s/g, ''));
//                 message = isValid ? '' : 'Please enter a valid phone number';
//                 break;
//             default:
//                 isValid = value.length >= 2;
//                 message = isValid ? '' : 'This field is required';
//         }

//         this.showFieldValidation(field, isValid, message);
//         return isValid;
//     }

//     showFieldValidation(field, isValid, message) {
//         const errorElement = field.nextElementSibling;
        
//         if (isValid) {
//             field.classList.remove('error');
//             if (errorElement && errorElement.classList.contains('error-message')) {
//                 errorElement.remove();
//             }
//         } else {
//             field.classList.add('error');
//             if (!errorElement || !errorElement.classList.contains('error-message')) {
//                 const errorDiv = document.createElement('div');
//                 errorDiv.className = 'error-message';
//                 errorDiv.textContent = message;
//                 field.parentNode.insertBefore(errorDiv, field.nextSibling);
//             }
//         }
//     }

//     validateAndSubmit() {
//         const inputs = this.form.querySelectorAll('input[required], textarea[required]');
//         let isFormValid = true;

//         inputs.forEach(input => {
//             if (!this.validateField(input)) {
//                 isFormValid = false;
//             }
//         });

//         if (isFormValid) {
//             this.submitForm();
//         } else {
//             this.showFormError('Please correct the errors above');
//         }
//     }

//     submitForm() {
//         const formData = new FormData(this.form);
        
//         // Simulate form submission
//         this.showSubmissionStatus('Sending message...');
        
//         setTimeout(() => {
//             this.showSubmissionStatus('Message sent successfully!', 'success');
//             this.form.reset();
//         }, 2000);
//     }

//     showFormError(message) {
//         const errorDiv = document.createElement('div');
//         errorDiv.className = 'form-error';
//         errorDiv.textContent = message;
//         this.form.appendChild(errorDiv);
        
//         setTimeout(() => errorDiv.remove(), 5000);
//     }

//     showSubmissionStatus(message, type = 'info') {
//         const statusDiv = document.createElement('div');
//         statusDiv.className = `form-status ${type}`;
//         statusDiv.textContent = message;
//         this.form.appendChild(statusDiv);
        
//         if (type === 'success') {
//             setTimeout(() => statusDiv.remove(), 5000);
//         }
//     }
// }

// // Initialize everything when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM loaded, initializing portfolio...');
    
//     // Debug: Check if elements exist
//     const themeToggle = document.getElementById('themeToggle');
//     const mobileToggle = document.getElementById('mobileMenuToggle');
//     const navLinks = document.getElementById('navLinks');
    
//     console.log('Theme toggle found:', !!themeToggle);
//     console.log('Mobile toggle found:', !!mobileToggle);
//     console.log('Nav links found:', !!navLinks);
    
//     // Initialize main portfolio app
//     const portfolio = new PortfolioApp();
    
//     // Initialize contact form
//     const contactForm = new ContactForm();
    
//     // Performance monitoring
//     portfolio.measurePerformance();
    
//     // Initialize accessibility features
//     portfolio.initAccessibility();
    
//     // Set up error handling
//     portfolio.handleErrors();
    
//     // Add direct event listeners as backup
//     if (themeToggle) {
//         themeToggle.addEventListener('click', function(e) {
//             console.log('Theme toggle clicked directly');
//             e.preventDefault();
//             const currentTheme = document.body.getAttribute('data-theme');
//             const newTheme = currentTheme === 'light' ? '' : 'light';
//             document.body.setAttribute('data-theme', newTheme);
//             localStorage.setItem('portfolio-theme', newTheme);
            
//             const icon = this.querySelector('i');
//             if (icon) {
//                 icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
//             }
//         });
//     }
    
//     if (mobileToggle && navLinks) {
//         let menuOpen = false;
//         mobileToggle.addEventListener('click', function(e) {
//             console.log('Mobile toggle clicked directly');
//             e.preventDefault();
//             e.stopPropagation();
            
//             menuOpen = !menuOpen;
            
//             if (menuOpen) {
//                 navLinks.classList.add('show');
//                 this.setAttribute('aria-expanded', 'true');
//                 const icon = this.querySelector('i');
//                 if (icon) icon.className = 'fas fa-times';
//                 document.body.style.overflow = 'hidden';
//             } else {
//                 navLinks.classList.remove('show');
//                 this.setAttribute('aria-expanded', 'false');
//                 const icon = this.querySelector('i');
//                 if (icon) icon.className = 'fas fa-bars';
//                 document.body.style.overflow = '';
//             }
//         });
        
//         // Close menu when clicking nav links
//         navLinks.addEventListener('click', function(e) {
//             if (e.target.classList.contains('nav-link')) {
//                 menuOpen = false;
//                 navLinks.classList.remove('show');
//                 mobileToggle.setAttribute('aria-expanded', 'false');
//                 const icon = mobileToggle.querySelector('i');
//                 if (icon) icon.className = 'fas fa-bars';
//                 document.body.style.overflow = '';
//             }
//         });
//     }
    
//     console.log('Portfolio initialized successfully');
// });

// // // Initialize Typed.js if available
// // document.addEventListener('DOMContentLoaded', () => {
// //     if (typeof Typed !== 'undefined') {
// //         const typedElement = document.getElementById('typed-text');
// //         if (typedElement) {
// //             new Typed('#typed-text', {
// //                 strings: [
// //                     'Frontend Developer',
// //                     'UI/UX Designer'
// //                     'React Developer',
// //                     'JavaScript Expert',
// //                     'Web Designer',
// //                     'Problem Solver'
// //                 ],
// //                 typeSpeed: 0,
// //                 backSpeed: 0,
// //                 backDelay: 50,
// //                 loop: true,
// //                 showCursor: false
// //             });
// //         }
// //     }
// // });

// // Service Worker Registration (for PWA capabilities)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then((registration) => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch((registrationError) => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

// // Export for potential module usage
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = { PortfolioApp, ContactForm };
// }

//   const testimonials = document.querySelectorAll('.testimonial-card');
//   let current = 0;

//   function showTestimonial(index) {
//     testimonials.forEach((card, i) => {
//       card.hidden = i !== index;
//       card.classList.toggle('active', i === index);
//     });
//   }

//   function nextTestimonial() {
//     current = (current + 1) % testimonials.length;
//     showTestimonial(current);
//   }

//   // Initial display
//   showTestimonial(current);

//   // Change testimonial every 5 seconds
//   setInterval(nextTestimonial, 5000);















// Cleaned and Fixed Portfolio JavaScript

class PortfolioApp {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.startAnimations();
  }

  init() {
    this.initTheme();
    this.initMobileMenu();
    this.initLoadingScreen();
    this.initNavigation();
    this.initScrollEffects();
    this.initTestimonials();
    this.initCursor();
    this.initTouchHandling();
  }

  initTheme() {
    this.themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme) {
      document.body.setAttribute("data-theme", savedTheme);
      this.updateThemeIcon(savedTheme);
    }
    this.themeToggle?.addEventListener("click", () => this.toggleTheme());
  }

  toggleTheme() {
    const current = document.body.getAttribute("data-theme");
    const newTheme = current === "light" ? "" : "light";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    const icon = this.themeToggle?.querySelector("i");
    if (icon) icon.className = theme === "light" ? "fas fa-sun" : "fas fa-moon";
  }

  initMobileMenu() {
    this.mobileMenuOpen = false;
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.navLinks = document.getElementById("navLinks");
    this.navbar = document.getElementById("navbar");

    this.mobileMenuToggle?.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    document.addEventListener("click", (e) => {
      if (
        this.mobileMenuOpen &&
        !this.navLinks.contains(e.target) &&
        !this.mobileMenuToggle.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
  }

  openMobileMenu() {
    this.navLinks.classList.add("show");
    this.mobileMenuToggle.setAttribute("aria-expanded", "true");
    this.mobileMenuToggle.querySelector("i").className = "fas fa-times";
    this.mobileMenuOpen = true;
    document.body.style.overflow = "hidden";
  }

  closeMobileMenu() {
    this.navLinks.classList.remove("show");
    this.mobileMenuToggle.setAttribute("aria-expanded", "false");
    this.mobileMenuToggle.querySelector("i").className = "fas fa-bars";
    this.mobileMenuOpen = false;
    document.body.style.overflow = "";
  }

  initLoadingScreen() {
    window.addEventListener("load", () => {
      const loadingScreen = document.getElementById("loadingScreen");
      loadingScreen?.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 1500);
    });
  }

  initNavigation() {
    this.sections = document.querySelectorAll("section[id]");
    this.navLinksAll = document.querySelectorAll(".nav-link");
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          const navHeight = this.navbar.offsetHeight;
          const offsetTop = target.offsetTop - navHeight - 20;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
          this.closeMobileMenu();
        }
      });
    });
  }

  initCursor() {
    this.cursor = document.getElementById("cursor");
    if (!this.cursor) return;
    document.addEventListener("mousemove", (e) => {
      this.cursor.style.left = `${e.clientX}px`;
      this.cursor.style.top = `${e.clientY}px`;
    });
    document.addEventListener("mouseleave", () => {
      this.cursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      this.cursor.style.opacity = "1";
    });
  }

  initScrollEffects() {
    window.addEventListener("scroll", () => this.handleScroll());
  }

  handleScroll() {
    this.updateActiveNavigation();
    this.updateNavbarBackground();
  }

  updateActiveNavigation() {
    let current = "";
    this.sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.getAttribute("id");
      }
    });
    this.navLinksAll.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  }

  updateNavbarBackground() {
    this.navbar.style.background =
      window.scrollY > 50
        ? "rgba(26,26,26,0.95)"
        : "rgba(26,26,26,0.8)";
    this.navbar.style.backdropFilter = "blur(10px)";
  }

  initTouchHandling() {
    let touchStartX = 0;
    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });
    document.addEventListener("touchmove", (e) => {
      const dx = touchStartX - e.touches[0].clientX;
      if (dx > 50 && this.mobileMenuOpen) this.closeMobileMenu();
    });
  }

  initTestimonials() {
    const testimonials = document.querySelectorAll(".testimonial-card");
    let index = 0;
    function show(i) {
      testimonials.forEach((el, j) => {
        el.hidden = i !== j;
        el.classList.toggle("active", i === j);
      });
    }
    show(index);
    setInterval(() => show((index = (index + 1) % testimonials.length)), 5000);
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.handleResize());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.mobileMenuOpen) this.closeMobileMenu();
    });
  }
  
  handleResize() {
    if (window.innerWidth > 768 && this.mobileMenuOpen) this.closeMobileMenu();
    if (this.cursor) this.cursor.style.display = window.innerWidth > 768 ? "block" : "none";
  }

  startAnimations() {
    // Add animation triggers if needed
  }
}

document.addEventListener("DOMContentLoaded", () => new PortfolioApp());

  window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(0, 0, 0, 0.6)'; // or any fallback color
  } else {
    navbar.style.background = 'transparent';
  }
});


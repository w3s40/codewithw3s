import React from 'react';

export default function PrintResume() {
  return (
    <div className="print-only w-full max-w-4xl mx-auto p-4 sm:p-8 bg-white text-black font-sans">
      {/* Header Section */}
      <div className="border-b pb-5 mb-5 border-slate-300 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">Sumit Kumar</h1>
          <p className="text-sm font-semibold text-teal-700 tracking-wider uppercase mt-1">
            Technical SEO Specialist & Frontend Developer
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 font-medium">
            <span>Address: RZF2, Sitapuri, New Delhi - 110045</span>
            <span>•</span>
            <span>Phone: +91 7491923798</span>
            <span>•</span>
            <span>Email: sumithakur4095@gmail.com</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 mt-1 font-medium">
            <span>GitHub: github.com/harry9446</span>
            <span>•</span>
            <span>LinkedIn: linkedin.com/in/sumit-kumar-4095st</span>
          </div>
        </div>

        {/* Print-friendly QR Code linking to Live Portfolio */}
        <div className="flex flex-col items-center flex-shrink-0 text-center border border-teal-100 p-2 rounded-lg bg-teal-50/20">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin || 'https://w3s40.github.io')}&color=0f766e`}
            alt="Live Portfolio QR Code"
            className="w-16 h-16"
            referrerPolicy="no-referrer"
          />
          <span className="text-[8px] font-mono font-bold text-teal-800 mt-1 uppercase tracking-wider">Scan Live Site</span>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-teal-800 tracking-wider uppercase border-b pb-1 mb-2 border-slate-200">
          Professional Profile
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          Bachelor of Computer Applications (BCA) student with robust knowledge of Technical SEO, website optimization, keyword research, on-page SEO, Google Search Console, Google Analytics, Core Web Vitals, and technical website audits. Skilled in frontend development using HTML5, CSS3, JavaScript, React.js, and Tailwind CSS with a focus on responsive and performance-optimized user interfaces. Also familiar with SQL, PostgreSQL, Microsoft Excel, Power BI, and dashboard development for data analysis and business reporting.
        </p>
      </div>

      {/* Skills Matrix */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-teal-800 tracking-wider uppercase border-b pb-1 mb-2 border-slate-200">
          Core Skills & Competencies
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-950 mb-1">Search Engine Optimization (SEO)</h3>
            <p className="text-slate-600 leading-normal">
              Technical SEO, On-Page SEO, Off-Page SEO, Keyword Research, Content Optimization, Competitor Analysis, Technical Audits, Google Search Console, Google Analytics, Google Tag Manager, Schema Markup, Core Web Vitals, XML Sitemap, Robots.txt, Website Speed Optimization, Local SEO, Link Building, SEO Reporting
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 mb-1">Frontend Development</h3>
            <p className="text-slate-600 leading-normal">
              HTML5, CSS3, JavaScript (ES6+), React.js, React Hooks, Tailwind CSS, Responsive Design, Motion Animations, Accessibility (WCAG)
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 mb-1">Data Analytics & DBs</h3>
            <p className="text-slate-600 leading-normal">
              SQL, PostgreSQL, Microsoft Excel (Pivot Tables, Advanced Formulas), Power BI Dashboards, Data Visualization, Recharts
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 mb-1">Tools & Platforms</h3>
            <p className="text-slate-600 leading-normal">
              Git, GitHub, Firebase, Visual Studio Code, Lighthouse Audits, Chrome DevTools
            </p>
          </div>
        </div>
      </div>

      {/* Selected Technical Projects */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-teal-800 tracking-wider uppercase border-b pb-1 mb-2 border-slate-200">
          Key Portfolio Projects
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
              <span>SEO Crawler & Technical Audit Engine</span>
              <span className="text-slate-500 font-normal text-[11px]">HTML5, SEO Semantics, JSON-LD Schema, Lighthouse, Search Console</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-normal">
              Developed an automated technical website auditor designed to identify heading layout issues, broken sitemaps, robots.txt crawl directives, and missing schema metadata. Implemented dynamic audit pipelines resulting in improved page crawling and faster diagnostics verification.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
              <span>Interactive Weather & Analytics Dashboard</span>
              <span className="text-slate-500 font-normal text-[11px]">React.js, Tailwind CSS, Recharts, Local Caching, REST API</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-normal">
              Designed a responsive frontend analytics display using React.js and Tailwind CSS. Built a lightweight caching layer utilizing state hooks to eliminate redundant meteorological API calls, dropping switch latency by 95% while mapping high-fidelity charts.
            </p>
          </div>
        </div>
      </div>

      {/* Education & Credentials */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <h2 className="text-sm font-bold text-teal-800 tracking-wider uppercase border-b pb-1 mb-2 border-slate-200">
            Education
          </h2>
          <div className="text-xs">
            <h3 className="font-bold text-slate-900">Bachelor of Computer Applications (BCA)</h3>
            <p className="text-teal-700 font-medium">ISBM University • Expected Graduation: 2026</p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Comprehensive study of database administration, software architecture, SQL, relational data structures, and computer logic.
            </p>
          </div>
          <div className="text-xs mt-3">
            <h3 className="font-bold text-slate-900">Personal Details</h3>
            <p className="text-slate-600 mt-0.5"><strong className="text-slate-800">Languages:</strong> English, Hindi</p>
            <p className="text-slate-600 mt-0.5"><strong className="text-slate-800">Soft Skills:</strong> Problem Solving, Communication, Team Collaboration, Time Management, Critical Thinking, Adaptability, Continuous Learning</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-teal-800 tracking-wider uppercase border-b pb-1 mb-2 border-slate-200">
            Certifications
          </h2>
          <ul className="text-xs space-y-1.5 text-slate-700">
            <li>
              <strong className="text-slate-900 font-bold">LetsUpgrade</strong> <span className="text-slate-500 font-medium">| Frontend React Development</span>
            </li>
            <li>
              <strong className="text-slate-900 font-bold">GeeksforGeeks</strong> <span className="text-slate-500 font-medium">| Data Structures & Algorithms</span>
            </li>
            <li>
              <strong className="text-slate-900 font-bold">HubSpot Academy</strong> <span className="text-slate-500 font-medium">| Inbound Marketing & Technical SEO</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer stamp */}
      <div className="text-center text-[10px] text-slate-400 mt-8 border-t pt-3">
        Generated dynamically from Portfolio Database. View interactive site at github.com/harry9446
      </div>
    </div>
  );
}

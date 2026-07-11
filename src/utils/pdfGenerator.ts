import { jsPDF } from 'jspdf';

export function generateResumePDF() {
  // Create a standard A4 portrait PDF (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [1, 62, 55]; // Teal Brand (#013E37)
  const secondaryColor = [30, 41, 59]; // Slate Slate-800
  const lightGray = [100, 116, 139]; // Slate-500
  const dividerColor = [226, 232, 240]; // Border-line (#E2E8F0)

  let y = 15; // starting y margin

  // Helper to draw horizontal line divider
  const drawDivider = (currentY: number) => {
    doc.setDrawColor(dividerColor[0], dividerColor[1], dividerColor[2]);
    doc.setLineWidth(0.3);
    doc.line(15, currentY, 195, currentY);
  };

  // Helper to render wrapped paragraphs nicely
  const renderTextParagraph = (text: string, currentY: number, fontSize: number, leading: number, color: number[], isBold: boolean = false): number => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    
    const splitText = doc.splitTextToSize(text, 180); // 210 - 15 - 15 margins
    doc.text(splitText, 15, currentY);
    return currentY + (splitText.length * leading);
  };

  // ==================== HEADER SECTION ====================
  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SUMIT KUMAR', 15, y);
  y += 6;

  // Title / Sub-heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('TECHNICAL SEO SPECIALIST & FRONTEND DEVELOPER', 15, y);
  y += 5;

  // Contact Info & Address
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Address: RZF2, Sitapuri, New Delhi - 110045  |  Phone: +91 7491923798  |  Email: sumithakur4095@gmail.com', 15, y);
  y += 4.5;
  doc.text('GitHub: github.com/harry9446  |  LinkedIn: linkedin.com/in/sumit-kumar-4095st', 15, y);
  y += 6;

  drawDivider(y);
  y += 6;

  // ==================== PROFESSIONAL SUMMARY ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('PROFESSIONAL SUMMARY', 15, y);
  y += 4.5;

  const summaryText = 'Bachelor of Computer Applications (BCA) student with robust knowledge of Technical SEO, website optimization, keyword research, on-page SEO, Google Search Console, Google Analytics, Core Web Vitals, and technical website audits. Skilled in frontend development using HTML5, CSS3, JavaScript, React.js, and Tailwind CSS with a focus on responsive and performance-optimized user interfaces. Also familiar with SQL, PostgreSQL, Microsoft Excel, Power BI, and dashboard development for data analysis and business reporting.';
  y = renderTextParagraph(summaryText, y, 8.5, 4.0, secondaryColor);
  y += 3.5;

  drawDivider(y);
  y += 6;

  // ==================== TECHNICAL SKILLS ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TECHNICAL SKILLS', 15, y);
  y += 5;

  const skillsData = [
    { label: 'Search Engine Optimization (SEO):', skills: 'Technical SEO, On-Page SEO, Off-Page SEO, Keyword Research, Content Optimization, Competitor Analysis, Technical Audits, Google Search Console, Google Analytics, Google Tag Manager, Schema Markup, Core Web Vitals, XML Sitemap, Robots.txt, Website Speed Optimization, Local SEO, Link Building, SEO Reporting' },
    { label: 'Frontend Development:', skills: 'HTML5, CSS3, JavaScript (ES6+), React.js, React Hooks, Tailwind CSS, Responsive Design, Motion Animations, Accessibility (WCAG)' },
    { label: 'Data Analytics & DBs:', skills: 'SQL, PostgreSQL, Microsoft Excel (Pivot Tables, Advanced Formulas), Power BI Dashboards, Data Visualization, Recharts' },
    { label: 'Tools & Platforms:', skills: 'Git, GitHub, Firebase, Visual Studio Code, Lighthouse Audits, Chrome DevTools' }
  ];

  skillsData.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(item.label, 15, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    const indent = doc.getTextWidth(item.label) + 2;
    const splitSkills = doc.splitTextToSize(item.skills, 180 - indent);
    doc.text(splitSkills, 15 + indent, y);
    y += (splitSkills.length * 3.8) + 1;
  });

  y += 2.5;
  drawDivider(y);
  y += 6;

  // ==================== KEY PORTFOLIO PROJECTS ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('KEY PORTFOLIO PROJECTS', 15, y);
  y += 5;

  // Project 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('SEO Crawler & Technical Audit Engine', 15, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('Technologies: HTML5, SEO Semantics, JSON-LD Schema, Lighthouse, Search Console', 195 - doc.getTextWidth('Technologies: HTML5, SEO Semantics, JSON-LD Schema, Lighthouse, Search Console'), y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const p1Text = 'Developed an automated technical website auditor designed to identify heading layout issues, broken sitemaps, robots.txt crawl directives, and missing schema metadata. Implemented dynamic audit pipelines resulting in improved page crawling and faster diagnostics verification.';
  y = renderTextParagraph(p1Text, y, 8, 3.6, secondaryColor);
  y += 3;

  // Project 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Interactive Weather & Analytics Dashboard', 15, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('Technologies: React.js, Tailwind CSS, Recharts, Local Caching, REST API', 195 - doc.getTextWidth('Technologies: React.js, Tailwind CSS, Recharts, Local Caching, REST API'), y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const p2Text = 'Designed a responsive frontend analytics display using React.js and Tailwind CSS. Built a lightweight caching layer utilizing state hooks to eliminate redundant meteorological API calls, dropping switch latency by 95% while mapping high-fidelity charts.';
  y = renderTextParagraph(p2Text, y, 8, 3.6, secondaryColor);
  y += 3.5;

  drawDivider(y);
  y += 6;

  // ==================== EDUCATION, CERTIFICATIONS & DETAILS ====================
  // Render column-wise Grid
  const gridY = y;

  // Column Left: Education & Languages
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('EDUCATION', 15, gridY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Bachelor of Computer Applications (BCA)', 15, gridY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('ISBM University  |  Expected Graduation: 2026', 15, gridY + 9);

  // Languages & Soft Skills below Education
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Languages:', 15, gridY + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('English, Hindi', 35, gridY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Soft Skills:', 15, gridY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  const softSkillsText = 'Problem Solving, Communication, Team Collaboration, Time Management, Critical Thinking, Adaptability, Continuous Learning';
  const splitSoftSkills = doc.splitTextToSize(softSkillsText, 80);
  doc.text(splitSoftSkills, 15, gridY + 24);


  // Column Right: Certifications
  const rightColX = 110;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('CERTIFICATIONS', rightColX, gridY);

  const certsList = [
    '• LetsUpgrade - Frontend React Development',
    '• GeeksforGeeks - Data Structures & Algorithms',
    '• HubSpot - Inbound Marketing & Technical SEO'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  certsList.forEach((c, idx) => {
    doc.text(c, rightColX, gridY + 5 + (idx * 5));
  });

  // Footer stamp
  doc.setDrawColor(dividerColor[0], dividerColor[1], dividerColor[2]);
  doc.line(15, 280, 195, 280);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('Generated dynamically from Sumit Kumar\'s portfolio. View interactive resume at github.com/harry9446', 15, 285);

  // Save the PDF
  doc.save('Sumit_Kumar_Resume.pdf');
}

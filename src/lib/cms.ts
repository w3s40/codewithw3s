/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './firebase';
import { 
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, 
  query, orderBy, setDoc, serverTimestamp 
} from 'firebase/firestore';
import { Project, Certification, BlogItem, TimelineItem, Testimonial, ResumeVersion } from '../types';
import * as staticData from '../data';

// Generic Fetcher with Fallback to staticData
export async function getCMSProjects(): Promise<Project[]> {
  try {
    const q = collection(db, 'projects');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('[CMS Engine] Firestore projects empty, returning static data.');
      return staticData.projects;
    }
    const projectsList: Project[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      projectsList.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        overview: data.overview || '',
        problem: data.problem || '',
        objective: data.objective || '',
        research: data.research || '',
        solution: data.solution || '',
        features: data.features || [],
        technologies: data.technologies || [],
        challenges: data.challenges || '',
        keyLearnings: data.keyLearnings || '',
        results: data.results || '',
        github: data.github || '',
        demo: data.demo || '',
        image: data.image || '',
        category: data.category || 'frontend',
        isFeatured: data.isFeatured || false
      });
    });
    return projectsList;
  } catch (err) {
    console.warn('[CMS Engine] Error loading Firestore projects, falling back:', err);
    return staticData.projects;
  }
}

export async function saveCMSProject(project: Partial<Project> & { id?: string }): Promise<void> {
  const colRef = collection(db, 'projects');
  if (project.id) {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, { ...project, updatedAt: serverTimestamp() }, { merge: true });
  } else {
    const docRef = doc(colRef);
    const newId = docRef.id;
    await setDoc(docRef, { ...project, id: newId, createdAt: serverTimestamp() });
  }
}

export async function deleteCMSProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id));
}

// BLOG CMS
export interface EnhancedBlogItem extends BlogItem {
  content: string;
  isDraft: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  featuredImage?: string;
}

export async function getCMSBlogs(): Promise<EnhancedBlogItem[]> {
  try {
    const q = collection(db, 'blog_posts');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('[CMS Engine] Firestore blog posts empty, returning static data.');
      return staticData.blogItems.map(item => ({
        ...item,
        content: `### Introduction\nThis is a placeholder content loaded as a fallback for the article "${item.title}".\n\n### Detailed Analysis\nWriting clean production systems requires understanding state optimization and zero-render bottlenecks.`,
        isDraft: false,
        seoTitle: item.title,
        seoKeywords: 'React, SEO, Performance, Developer',
        featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
      }));
    }
    const list: EnhancedBlogItem[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        title: data.title || '',
        excerpt: data.excerpt || '',
        category: data.category || 'Development',
        readTime: data.readTime || '5 min read',
        date: data.date || new Date().toLocaleDateString(),
        slug: data.slug || doc.id,
        content: data.content || '',
        isDraft: data.isDraft !== false,
        seoTitle: data.seoTitle || '',
        seoKeywords: data.seoKeywords || '',
        featuredImage: data.featuredImage || ''
      });
    });
    return list;
  } catch (err) {
    console.warn('[CMS Engine] Error loading Firestore blogs, returning static:', err);
    return staticData.blogItems.map(item => ({
      ...item,
      content: `### Introduction\nThis is a placeholder content.\n\n### Optimizations\nMastering relational databases is key.`,
      isDraft: false
    }));
  }
}

export async function saveCMSBlog(blog: Partial<EnhancedBlogItem> & { id?: string }): Promise<void> {
  const colRef = collection(db, 'blog_posts');
  if (blog.id) {
    const docRef = doc(db, 'blog_posts', blog.id);
    await setDoc(docRef, { ...blog, updatedAt: serverTimestamp() }, { merge: true });
  } else {
    const docRef = doc(colRef);
    const newId = docRef.id;
    await setDoc(docRef, { ...blog, id: newId, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), createdAt: serverTimestamp() });
  }
}

export async function deleteCMSBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, 'blog_posts', id));
}

// CERTIFICATIONS CMS
export async function getCMSCertifications(): Promise<Certification[]> {
  try {
    const q = collection(db, 'certifications');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return staticData.certifications;
    }
    const list: Certification[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        title: data.title || '',
        issuer: data.issuer || '',
        date: data.date || '',
        credentialUrl: data.credentialUrl || '',
        category: data.category || 'dev'
      });
    });
    return list;
  } catch (err) {
    return staticData.certifications;
  }
}

export async function saveCMSCertification(cert: Partial<Certification> & { id?: string }): Promise<void> {
  const colRef = collection(db, 'certifications');
  if (cert.id) {
    const docRef = doc(db, 'certifications', cert.id);
    await setDoc(docRef, { ...cert }, { merge: true });
  } else {
    const docRef = doc(colRef);
    const newId = docRef.id;
    await setDoc(docRef, { ...cert, id: newId });
  }
}

export async function deleteCMSCertification(id: string): Promise<void> {
  await deleteDoc(doc(db, 'certifications', id));
}

// TIMELINE CMS
export async function getCMSTimeline(): Promise<TimelineItem[]> {
  try {
    const q = collection(db, 'timeline');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return staticData.timelineItems;
    }
    const list: TimelineItem[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        year: data.year || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        category: data.category || 'journey'
      });
    });
    return list.sort((a, b) => b.year.localeCompare(a.year));
  } catch (err) {
    return staticData.timelineItems;
  }
}

export async function saveCMSTimeline(item: Partial<TimelineItem> & { id?: string }): Promise<void> {
  const colRef = collection(db, 'timeline');
  if (item.id) {
    const docRef = doc(db, 'timeline', item.id);
    await setDoc(docRef, { ...item }, { merge: true });
  } else {
    const docRef = doc(colRef);
    const newId = docRef.id;
    await setDoc(docRef, { ...item, id: newId });
  }
}

export async function deleteCMSTimeline(id: string): Promise<void> {
  await deleteDoc(doc(db, 'timeline', id));
}

// SKILLS CMS
export interface EnhancedSkillCategory {
  id?: string;
  name: string;
  items: string[];
}

export async function getCMSSkills(): Promise<EnhancedSkillCategory[]> {
  try {
    const q = collection(db, 'skills');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return staticData.skillCategories.map((sc, index) => ({ id: `sc-${index}`, ...sc }));
    }
    const list: EnhancedSkillCategory[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        name: data.name || '',
        items: data.items || []
      });
    });
    return list;
  } catch (err) {
    return staticData.skillCategories.map((sc, index) => ({ id: `sc-${index}`, ...sc }));
  }
}

export async function saveCMSSkill(skill: EnhancedSkillCategory): Promise<void> {
  if (skill.id && !skill.id.startsWith('sc-')) {
    const docRef = doc(db, 'skills', skill.id);
    await setDoc(docRef, { name: skill.name, items: skill.items }, { merge: true });
  } else {
    const docRef = doc(collection(db, 'skills'));
    await setDoc(docRef, { name: skill.name, items: skill.items });
  }
}

export async function deleteCMSSkill(id: string): Promise<void> {
  if (id.startsWith('sc-')) return; // Do not delete default static items in Firestore directly
  await deleteDoc(doc(db, 'skills', id));
}

// TESTIMONIALS (Shown only if real data exists)
export async function getCMSTestimonials(): Promise<Testimonial[]> {
  try {
    const q = collection(db, 'testimonials');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return []; // Must not return fake placeholders if empty
    }
    const list: Testimonial[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        clientName: data.clientName || '',
        companyName: data.companyName || '',
        role: data.role || '',
        feedback: data.feedback || '',
        rating: data.rating || 5,
        date: data.date || '',
        isApproved: data.isApproved !== false
      });
    });
    return list.filter(t => t.isApproved);
  } catch (err) {
    return [];
  }
}

export async function saveCMSTestimonial(test: Partial<Testimonial> & { id?: string }): Promise<void> {
  const colRef = collection(db, 'testimonials');
  if (test.id) {
    const docRef = doc(db, 'testimonials', test.id);
    await setDoc(docRef, { ...test }, { merge: true });
  } else {
    const docRef = doc(colRef);
    const newId = docRef.id;
    await setDoc(docRef, { ...test, id: newId, isApproved: true, date: new Date().toLocaleDateString() });
  }
}

export async function deleteCMSTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id));
}

// RESUME CENTER CMS
export async function getResumeVersions(): Promise<ResumeVersion[]> {
  try {
    const q = collection(db, 'resumes');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [
        {
          id: 'v1-default',
          version: '1.0.0 (Core)',
          fileName: 'Sumit_Kumar_Resume_BCA.pdf',
          url: '#print',
          uploadedAt: 'June 2026',
          isActive: true,
          downloadsCount: 14
        }
      ];
    }
    const list: ResumeVersion[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        version: data.version || '',
        fileName: data.fileName || '',
        url: data.url || '',
        uploadedAt: data.uploadedAt || '',
        isActive: data.isActive || false,
        downloadsCount: data.downloadsCount || 0
      });
    });
    return list;
  } catch (err) {
    return [
      {
        id: 'v1-default',
        version: '1.0.0 (Core)',
        fileName: 'Sumit_Kumar_Resume_BCA.pdf',
        url: '#print',
        uploadedAt: 'June 2026',
        isActive: true,
        downloadsCount: 14
      }
    ];
  }
}

export async function saveResumeVersion(res: Partial<ResumeVersion> & { id?: string }): Promise<void> {
  const colRef = collection(db, 'resumes');
  if (res.id) {
    const docRef = doc(db, 'resumes', res.id);
    await setDoc(docRef, { ...res }, { merge: true });
  } else {
    const docRef = doc(colRef);
    const newId = docRef.id;
    await setDoc(docRef, { ...res, id: newId, downloadsCount: 0, uploadedAt: new Date().toLocaleDateString() });
  }
}

export async function incrementResumeDownload(id: string): Promise<void> {
  try {
    if (id === 'v1-default') return;
    const docRef = doc(db, 'resumes', id);
    await updateDoc(docRef, {
      downloadsCount: (window as any).cmsResumeDownloads ? (window as any).cmsResumeDownloads + 1 : 1
    });
  } catch (err) {
    console.warn('Could not increment resume download:', err);
  }
}

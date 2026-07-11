import { BlogItem } from '../types';
import { blogItems } from '../data';

/**
 * Mock blog service simulating network requests.
 */
export const blogService = {
  /**
   * Fetches the 3 most recent blog items with a mock latency delay.
   */
  getRecentBlogs: async (): Promise<BlogItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sort by date or id descending to get the most recent ones.
        // Our static data has b1, b2, b3 which are already our 3 most recent.
        resolve(blogItems.slice(0, 3));
      }, 600); // 600ms latency simulation
    });
  }
};

// src/api/categoryService.js
import { apiClient } from './client';

export const categoryService = {
  /**
   * Fetches the full category hierarchy
   * @returns {Promise<Array>} Array of category objects with nested children
   */
  getCategories: async () => {
    const { data } = await apiClient.get('/categories');
    return data;
  }
};
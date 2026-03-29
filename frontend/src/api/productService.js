
import { apiClient } from './client';

export const productService = {
  getProducts: async (params = {}) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },
  
  getFeatured: async () => {
    const { data } = await apiClient.get('/products/featured');
    return data;
  },

  getTrending: async () => {
    const { data } = await apiClient.get('/products/trending');
    return data;
  },

  getProductById: async (id) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  }
};
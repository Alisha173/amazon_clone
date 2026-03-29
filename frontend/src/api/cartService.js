// src/api/cartService.js
import { apiClient } from './client';

export const cartService = {
  getCart: async () => {
    const { data } = await apiClient.get('/cart');
    return data;
  },

  addToCart: async (productId, quantity) => {
    // Map the camelCase React variable to the snake_case Express requirement
    const { data } = await apiClient.post('/cart/add', { 
      product_id: productId, 
      quantity 
    });
    return data;
  },

  updateCart: async (productId, quantity) => {
    // Map the camelCase React variable to the snake_case Express requirement
    const { data } = await apiClient.put('/cart/update', { 
      product_id: productId, 
      quantity 
    });
    return data;
  },

  removeFromCart: async (productId) => {
    const { data } = await apiClient.delete(`/cart/remove/${productId}`);
    return data;
  }
};
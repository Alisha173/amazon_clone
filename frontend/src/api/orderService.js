import { apiClient } from './client';

export const orderService = {
  createOrder: async (orderData) => {
    // FIX: Changed from '/orders/place' to '/orders' to match your backend route
    const { data } = await apiClient.post('/orders', orderData);
    return data;
  },
  
  getUserOrders: async () => {
    const { data } = await apiClient.get('/orders');
    return data;
  }
};
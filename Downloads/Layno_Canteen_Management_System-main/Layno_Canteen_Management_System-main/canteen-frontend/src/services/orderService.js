// ============================================================
// FILE: src/services/orderService.js
// PURPOSE: All order & report related API calls
// ============================================================
import api from './api';
export const orderService = {
  createOrder:          (data)       => api.post('/orders', data),
  getOrders:            (params)     => api.get('/orders', { params }),
  getOrder:             (id)         => api.get(`/orders/${id}`),
  updateOrderStatus:    (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancelOrder:          (id)         => api.post(`/orders/${id}/cancel`),
  getSalesReport:       (params)     => api.get('/reports', { params }),
  getSalesChart:        (params)     => api.get('/reports/sales', { params }),
  getTopItems:          ()           => api.get('/reports/top-items'),
  getCategoryBreakdown: ()           => api.get('/reports/category-breakdown'),
};
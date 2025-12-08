const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: any) => request('/auth/register', { method: 'POST', body: data }),
  registerArtisan: (userData: any, artisanData: any) =>
    request('/auth/register/artisan', { method: 'POST', body: { ...userData, ...artisanData } }),
  login: (data: { email: string; password: string }) =>
    request<{ access_token: string; refresh_token: string }>('/auth/login', { method: 'POST', body: data }),
  getMe: () => request('/auth/me'),
  refresh: (refreshToken: string) =>
    request('/auth/refresh', { method: 'POST', body: { refresh_token: refreshToken } }),
};

// Artisans API
export const artisansApi = {
  getAll: (params?: { city?: string; category?: string; search?: string; min_rating?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.min_rating) searchParams.append('min_rating', params.min_rating.toString());
    return request(`/artisans?${searchParams.toString()}`);
  },
  getById: (id: number) => request(`/artisans/${id}`),
  updateProfile: (data: any) => request('/artisans/me', { method: 'PUT', body: data }),
  addService: (data: any) => request('/artisans/me/services', { method: 'POST', body: data }),
  deleteService: (id: number) => request(`/artisans/me/services/${id}`, { method: 'DELETE' }),
  addPortfolio: (data: any) => request('/artisans/me/portfolio', { method: 'POST', body: data }),
  deletePortfolio: (id: number) => request(`/artisans/me/portfolio/${id}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingsApi = {
  create: (data: any) => request('/bookings', { method: 'POST', body: data }),
  getMyBookings: (status?: string) => {
    const params = status ? `?status_filter=${status}` : '';
    return request(`/bookings/my-bookings${params}`);
  },
  getArtisanBookings: (status?: string) => {
    const params = status ? `?status_filter=${status}` : '';
    return request(`/bookings/artisan-bookings${params}`);
  },
  getById: (id: number) => request(`/bookings/${id}`),
  accept: (id: number) => request(`/bookings/${id}/accept`, { method: 'POST' }),
  reject: (id: number) => request(`/bookings/${id}/reject`, { method: 'POST' }),
  complete: (id: number, finalPrice?: number) =>
    request(`/bookings/${id}/complete?final_price=${finalPrice || ''}`, { method: 'POST' }),
  cancel: (id: number) => request(`/bookings/${id}/cancel`, { method: 'POST' }),
};

// Reviews API
export const reviewsApi = {
  create: (data: any) => request('/reviews', { method: 'POST', body: data }),
  getArtisanReviews: (artisanId: number) => request(`/reviews/artisan/${artisanId}`),
  respond: (reviewId: number, response: string) =>
    request(`/reviews/${reviewId}/respond`, { method: 'POST', body: { artisan_response: response } }),
  getStats: (artisanId: number) => request(`/reviews/stats/${artisanId}`),
};

// Categories & Cities
export const getCategories = () => request('/categories');
export const getCities = () => request('/cities');

export default { authApi, artisansApi, bookingsApi, reviewsApi, getCategories, getCities };

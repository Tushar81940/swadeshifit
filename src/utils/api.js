const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) })
};

export const profileAPI = {
  getMe: () => request('/profile/me'),
  updateMe: (body) => request('/profile/me', { method: 'PUT', body: JSON.stringify(body) })
};

export const workoutsAPI = {
  logSession: (body) => request('/workouts/log', { method: 'POST', body: JSON.stringify(body) }),
  getHistory: () => request('/workouts/history'),
  getStats: () => request('/workouts/stats')
};

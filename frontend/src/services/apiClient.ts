const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
};

export type Task = {
  id: string;
  category: string | null;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_at: string | null;
  holiday_warning?: string;
  version: number;
  created_at: string;
  updated_at: string;
  access_role: 'owner' | 'viewer' | 'editor' | null;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type TaskShare = {
  id: string;
  task: string;
  recipient: string;
  shared_by: string;
  permission: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  responded_at: string | null;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results?: T[];
  items?: T[];
};

export type TaskPayload = {
  category?: string | null;
  title: string;
  description?: string;
  priority: string;
  due_at?: string | null;
};

export type TaskFilters = {
  status?: string;
  priority?: string;
  search?: string;
  category?: string;
  due_after?: string;
  due_before?: string;
  ordering?: string;
  page?: number;
};

function authToken() {
  return localStorage.getItem('access_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  const token = authToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(payload?.error?.message ?? `API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function normalizeList<T>(response: PaginatedResponse<T> | T[]) {
  if (Array.isArray(response)) {
    return { count: response.length, next: null, previous: null, items: response };
  }

  return {
    count: response.count ?? response.results?.length ?? response.items?.length ?? 0,
    next: response.next,
    previous: response.previous,
    items: response.results ?? response.items ?? [],
  };
}

export const apiClient = {
  health: () => request<{ status: string }>('/health/'),
  readiness: () => request<{ status: string; database: string }>('/readiness/'),
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => request<AuthResponse>('/auth/register/', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login/', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request<User>('/auth/me/'),
  logout: () => request<{ detail: string }>('/auth/logout/', { method: 'POST' }),
  requestPasswordReset: (email: string) =>
    request<{ detail: string; reset_url?: string }>('/auth/password/reset/request/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  confirmPasswordReset: (payload: {
    token: string;
    password: string;
    password_confirmation: string;
  }) => request<AuthResponse>('/auth/password/reset/confirm/', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  changePassword: (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => request<{ detail: string }>('/auth/password/change/', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  categories: async () => normalizeList(await request<PaginatedResponse<Category> | Category[]>('/categories/')),
  createCategory: (payload: { name: string; color: string }) =>
    request<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCategory: (id: string, payload: { name: string; color: string }) =>
    request<Category>(`/categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteCategory: (id: string) =>
    request<void>(`/categories/${id}/`, {
      method: 'DELETE',
    }),
  tasks: async (params: TaskFilters) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.priority) query.set('priority', params.priority);
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.due_after) query.set('due_after', params.due_after);
    if (params.due_before) query.set('due_before', params.due_before);
    if (params.ordering) query.set('ordering', params.ordering);
    if (params.page) query.set('page', String(params.page));
    const suffix = query.size ? `?${query.toString()}` : '';
    return normalizeList(await request<PaginatedResponse<Task> | Task[]>(`/tasks/${suffix}`));
  },
  createTask: (payload: TaskPayload) =>
    request<Task>('/tasks/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateTask: (id: string, payload: Partial<TaskPayload>) =>
    request<Task>(`/tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  completeTask: (id: string) => request<Task>(`/tasks/${id}/complete/`, { method: 'PATCH' }),
  reopenTask: (id: string) => request<Task>(`/tasks/${id}/reopen/`, { method: 'PATCH' }),
  deleteTask: (id: string) => request<void>(`/tasks/${id}/`, { method: 'DELETE' }),
  shares: async () => normalizeList(await request<PaginatedResponse<TaskShare> | TaskShare[]>('/shares/')),
  createShare: (taskId: string, payload: { recipient_email: string; permission: string }) =>
    request<TaskShare>(`/tasks/${taskId}/shares/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  decideShare: (shareId: string, status: 'accepted' | 'rejected') =>
    request<TaskShare>(`/shares/${shareId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

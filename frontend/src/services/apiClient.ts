const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_at: string | null;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: 'Bearer dev-token',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  health: () => request<{ status: string }>('/health/'),
  tasks: async (params: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    const suffix = query.size ? `?${query.toString()}` : '';
    const response = await request<{ results?: Task[]; items?: Task[] } | Task[]>(`/tasks/${suffix}`);
    if (Array.isArray(response)) return response;
    return response.results ?? response.items ?? [];
  },
};

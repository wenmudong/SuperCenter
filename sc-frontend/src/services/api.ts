// 后端 API 服务层
const API_BASE = "http://localhost:8000/api";

async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  projects: {
    list: () => request<any>("/projects"),
    get: (id: string) => request<any>(`/projects/${id}`),
  },
};

import { api } from "@/services/api";
import { Project } from "@/types";

export const projectsApi = {
  // 获取项目列表
  list: () => api.projects.list() as Promise<Project[]>,

  // 获取单个项目
  get: (id: string) => api.projects.get(id) as Promise<Project>,
};

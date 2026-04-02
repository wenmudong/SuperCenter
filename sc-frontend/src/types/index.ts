// 项目类型
export interface Project {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "PLANNING";
  coverUrl?: string;
  linkUrl?: string;
  category?: string;
}

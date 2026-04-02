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

// 用户类型
export type UserRole = "blogger" | "user" | "admin";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// 博客类型
export interface Blog {
  id: number;
  author_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface BlogListItem {
  id: number;
  title: string;
  author_id: number;
  author_username: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
}

// 评论类型
export interface Comment {
  id: number;
  blog_id: number;
  author_id: number;
  author_username: string;
  author_avatar: string | null;
  parent_id: number | null;
  depth: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentTree extends Comment {
  replies: CommentTree[];
}

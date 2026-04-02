"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { blogApi } from "@/services/api";
import type { BlogListItem } from "@/types";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    blogApi.list()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="blogs."
        description="My thoughts and writings."
      />

      {isLoading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : blogs.length === 0 ? (
        <>
          <EmptyState message="No blogs yet." />
          {user?.role === "blogger" && (
            <Link
              href="/blogs/new"
              className="mx-auto mt-6 flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white/30 p-8 text-center backdrop-blur-sm transition-colors hover:border-neutral-400 hover:bg-white/40"
            >
              <div className="mb-3 rounded-full bg-white/50 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-neutral-500">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </div>
              <span className="text-neutral-500">Write a new blog</span>
            </Link>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="block rounded-lg border border-neutral-200 bg-white/70 p-4 transition-colors hover:bg-white/90"
            >
              <h3 className="text-lg font-medium">{blog.title}</h3>
              {blog.subtitle && (
                <p className="mt-1 text-sm text-neutral-500">{blog.subtitle}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500">
                <span>{blog.author_username}</span>
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                <span>{blog.comment_count} comments</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { blogApi } from "@/services/api";
import type { BlogListItem } from "@/types";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <EmptyState message="No blogs yet." />
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="block rounded-lg border border-neutral-200 bg-white/70 p-4 transition-colors hover:bg-white/90"
            >
              <h3 className="text-lg font-medium">{blog.title}</h3>
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

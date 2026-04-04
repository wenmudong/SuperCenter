"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BlogCard from "@/components/BlogCard";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { blogApi } from "@/services/api";
import type { BlogListItem, BlogCategory } from "@/types";

const BLOG_CATEGORIES: { value: BlogCategory | 'ALL'; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "Tech", label: "Tech" },
  { value: "Emotion", label: "Emotion" },
  { value: "Diary", label: "Diary" },
  { value: "Question", label: "Question" },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "ALL">("ALL");
  const { user } = useAuth();

  useEffect(() => {
    blogApi.list()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // 筛选后的博客
  const filteredBlogs = selectedCategory === "ALL"
    ? blogs
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <>
      <div className="flex flex-col gap-4 px-2 pt-4 pb-8 md:gap-8">
        <div className="flex items-center justify-between">
          <h1 className="font-sans text-6xl font-extralight text-neutral-900 md:text-8xl">
            blogs.
          </h1>
          {user?.role === "blogger" && filteredBlogs.length > 0 && (
            <Link
              href="/blogs/new"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white/30 backdrop-blur-sm transition-colors hover:border-neutral-400 hover:bg-white/40 md:h-16 md:w-16"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-neutral-500">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </Link>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            {filteredBlogs.length} posts · Wenmudong&apos;s thoughts and writings.
          </p>
          <div className="flex gap-2">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : filteredBlogs.length === 0 ? (
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
        <div className="grid grid-cols-1 sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              wide={Math.random() < 0.25}
            />
          ))}
        </div>
      )}
    </>
  );
}

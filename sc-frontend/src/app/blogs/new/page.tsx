"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { blogApi } from "@/services/api";

// 动态导入 MD 编辑器，避免 SSR 问题
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function NewBlogPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "blogger")) {
      router.push("/blogs");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await blogApi.create(token, title.trim(), subtitle.trim() || null, content.trim());
      router.push("/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="New Blog."
        description="Write something interesting."
      />

      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded bg-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="mb-1 block text-sm text-neutral-600">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 font-sans focus:border-blue-500 focus:outline-none"
              placeholder="Blog title"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="mb-1 block text-sm text-neutral-600">
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 font-sans focus:border-blue-500 focus:outline-none"
              placeholder="Brief description (optional)"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-600">
              Content * (Markdown supported)
            </label>
            <div data-color-mode="light" className="rounded-lg border border-neutral-300">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={400}
                preview="edit"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded bg-neutral-900 px-6 py-2 text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSaving ? "Publishing..." : "Publish"}
            </button>
            <Link
              href="/blogs"
              className="rounded border border-neutral-300 px-6 py-2 text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

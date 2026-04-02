"use client";

import Link from "next/link";
import type { BlogListItem, BlogCategory } from "@/types";

interface BlogCardProps {
  blog: BlogListItem;
  linkUrl?: string;
  wide?: boolean;
}

const categoryConfig: Record<BlogCategory, { bg: string; text: string; label: string }> = {
  Tech: {
    bg: "bg-blue-400/40",
    text: "text-blue-900",
    label: "Tech",
  },
  Emotion: {
    bg: "bg-pink-400/40",
    text: "text-pink-900",
    label: "Emotion",
  },
  Diary: {
    bg: "bg-amber-400/40",
    text: "text-amber-900",
    label: "Diary",
  },
  Question: {
    bg: "bg-purple-400/40",
    text: "text-purple-900",
    label: "Question",
  },
};

export default function BlogCard({
  blog,
  linkUrl,
  wide = false,
}: BlogCardProps) {
  const href = linkUrl || `/blogs/${blog.id}`;
  const config = categoryConfig[blog.category] || categoryConfig.Diary;

  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`group px-1 pb-2 ${wide ? "sm:col-span-2" : ""}`}>
      <div
        className={`h-full w-full overflow-hidden rounded-lg bg-neutral-50 transition-colors focus-within:bg-neutral-100 hover:bg-neutral-100 ${wide ? "aspect-[2/1]" : "aspect-square"}`}
      >
        <div className="isolate flex h-full w-full flex-col justify-between">
          {/* 顶部：分类 + 外链 */}
          <div className="flex items-center justify-between pl-4 pr-2 pt-4 text-sm tracking-tight text-neutral-400">
            <span className={`inline-block rounded px-1.5 pt-0.5 pb-1 font-mono text-sm tracking-tight shadow-inset-skeuo ${config.bg} ${config.text}`}>
              {config.label}
            </span>
            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:ring-4 focus-visible:ring-blue-200 group-focus-within:bg-white group-focus-within:text-neutral-900 group-focus-within:shadow-skeuo cursor-alias group-hover:bg-white group-hover:text-neutral-900 group-hover:shadow-skeuo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            )}
          </div>

          {/* 内容区（可点击） */}
          <Link href={href} className="cursor-alias p-5">
            <h3 className="text-3xl font-light leading-tight">
              {blog.title}
            </h3>
            <span className="mt-2 mb-4 block text-sm tracking-tight text-neutral-400">
              {formattedDate}
            </span>
            {blog.subtitle && (
              <p className="leading-relaxed tracking-tight text-neutral-700 line-clamp-3 md:line-clamp-4">
                {blog.subtitle}
              </p>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

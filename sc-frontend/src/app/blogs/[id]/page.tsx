"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { blogApi, commentApi } from "@/services/api";
import type { Blog, CommentTree } from "@/types";

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = Number(params.id);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<CommentTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isNaN(blogId)) {
      router.push("/blogs");
      return;
    }

    Promise.all([
      blogApi.get(blogId),
      commentApi.list(blogId),
    ])
      .then(([blogData, commentsData]) => {
        setBlog(blogData);
        setComments(commentsData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [blogId, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newComment.trim()) return;

    try {
      await commentApi.create(token, blogId, newComment.trim());
      const updatedComments = await commentApi.list(blogId);
      setComments(updatedComments);
      setNewComment("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to post comment");
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!token || !replyContent.trim()) return;

    try {
      await commentApi.create(token, blogId, replyContent.trim(), parentId);
      const updatedComments = await commentApi.list(blogId);
      setComments(updatedComments);
      setReplyContent("");
      setReplyTo(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to post reply");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;
    if (!confirm("Delete this comment?")) return;

    try {
      await commentApi.delete(token, blogId, commentId);
      const updatedComments = await commentApi.list(blogId);
      setComments(updatedComments);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  const handleDeleteBlog = async () => {
    if (!token) return;
    if (!confirm("Delete this blog?")) return;

    try {
      await blogApi.delete(token, blogId);
      router.push("/blogs");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete blog");
    }
  };

  if (isLoading) {
    return <p className="text-neutral-500">Loading...</p>;
  }

  if (!blog) {
    return <p className="text-neutral-500">Blog not found</p>;
  }

  const renderComment = (comment: CommentTree, depth = 0) => (
    <div key={comment.id} className={`mt-4 ${depth > 0 ? "ml-8" : ""}`}>
      <div className="rounded-lg border border-neutral-200 bg-white/50 p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm">
            {comment.author_username.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-medium">{comment.author_username}</span>
            <span className="ml-2 text-sm text-neutral-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className="mt-2 text-neutral-700">{comment.content}</p>
        <div className="mt-2 flex gap-4">
          {user && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="text-sm text-blue-500 hover:underline"
            >
              Reply
            </button>
          )}
          {(user?.role === "blogger" || user?.id === comment.author_id) && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>

        {replyTo === comment.id && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSubmitReply(comment.id)}
            />
            <button
              onClick={() => handleSubmitReply(comment.id)}
              className="rounded bg-neutral-900 px-3 py-1 text-sm text-white"
            >
              Reply
            </button>
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
    </div>
  );

  return (
    <>
      <PageHeader
        title={blog.title}
        description={new Date(blog.created_at).toLocaleDateString()}
      />

      <div className="mx-auto max-w-3xl">
        {/* Blog Content */}
        <article className="rounded-lg border border-neutral-200 bg-white/70 p-6">
          <p className="whitespace-pre-wrap text-neutral-800">{blog.content}</p>

          {user?.role === "blogger" && (
            <div className="mt-6 border-t border-neutral-200 pt-4">
              <Link
                href={`/blogs/${blogId}/edit`}
                className="text-sm text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={handleDeleteBlog}
                className="ml-4 text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-medium">Comments</h2>

          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full rounded border border-neutral-300 p-3 font-sans"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 rounded bg-neutral-900 px-4 py-2 text-white"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="mb-6 text-neutral-500">
              <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link> to leave a comment
            </p>
          )}

          <div className="space-y-4">
            {comments.map((comment) => renderComment(comment))}
          </div>

          {comments.length === 0 && (
            <p className="text-neutral-400">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </>
  );
}

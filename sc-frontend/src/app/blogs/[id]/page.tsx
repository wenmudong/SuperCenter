"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
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
  const { showToast } = useToast();

  // 删除博客确认弹窗状态
  const [showDeleteBlogConfirm, setShowDeleteBlogConfirm] = useState(false);
  // 删除评论确认弹窗状态
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  // 展开/缩放的一级评论
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

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
      showToast("Comment posted successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to post comment", "error");
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
      showToast("Reply posted successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to post reply", "error");
    }
  };

  const handleDeleteComment = async () => {
    if (!token || !deletingCommentId) return;

    try {
      await commentApi.delete(token, blogId, deletingCommentId);
      const updatedComments = await commentApi.list(blogId);
      setComments(updatedComments);
      setShowDeleteCommentConfirm(false);
      setDeletingCommentId(null);
      showToast("Comment deleted successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete comment", "error");
    }
  };

  const handleDeleteBlog = async () => {
    if (!token) return;

    try {
      await blogApi.delete(token, blogId);
      setShowDeleteBlogConfirm(false);
      showToast("Blog deleted successfully", "success");
      router.push("/blogs");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete blog", "error");
    }
  };

  if (isLoading) {
    return <p className="text-neutral-500">Loading...</p>;
  }

  if (!blog) {
    return <p className="text-neutral-500">Blog not found</p>;
  }

  const renderNestedComment = (comment: CommentTree, isOwn: boolean) => (
    <div key={comment.id} className="mt-4">
      <div className={`rounded-lg border border-neutral-200 bg-white/50 p-4 ${isOwn ? "ml-8" : ""}`}>
        <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
          <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm">
            {comment.author_username.charAt(0).toUpperCase()}
          </div>
          <div className={isOwn ? "text-right" : ""}>
            <span className="font-medium">{comment.author_username}</span>
            <span className="ml-2 text-sm text-neutral-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className={`mt-2 text-neutral-700 ${isOwn ? "text-right" : ""}`}>{comment.content}</p>
        <div className={`mt-2 flex gap-4 ${isOwn ? "justify-end" : ""}`}>
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
              onClick={() => {
                setDeletingCommentId(comment.id);
                setShowDeleteCommentConfirm(true);
              }}
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

      {/* 二级及更深层级都显示为二级样式 */}
      {comment.replies?.map((reply) => (
        <div key={reply.id} className="ml-8">
          {renderNestedComment(reply, user?.id === reply.author_id)}
        </div>
      ))}
    </div>
  );

  const toggleExpand = (commentId: number) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const renderFirstLevelComment = (comment: CommentTree) => {
    const isOwn = user?.id === comment.author_id;
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div key={comment.id} className="mt-4">
        <div className={`rounded-lg border border-neutral-200 bg-white/50 p-4 ${isOwn ? "ml-8" : ""}`}>
          <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
            <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm">
              {comment.author_username.charAt(0).toUpperCase()}
            </div>
            <div className={isOwn ? "text-right" : ""}>
              <span className="font-medium">{comment.author_username}</span>
              <span className="ml-2 text-sm text-neutral-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            {/* 展开/缩放按钮 */}
            {hasReplies && (
              <button
                onClick={() => toggleExpand(comment.id)}
                className="ml-auto text-xs text-blue-500 hover:underline"
              >
                {isExpanded ? "[-] Collapse" : "[+] Expand"}
              </button>
            )}
          </div>
          <p className={`mt-2 text-neutral-700 ${isOwn ? "text-right" : ""}`}>{comment.content}</p>
          <div className={`mt-2 flex gap-4 ${isOwn ? "justify-end" : ""}`}>
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
                onClick={() => {
                  setDeletingCommentId(comment.id);
                  setShowDeleteCommentConfirm(true);
                }}
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

        {/* 展开时显示嵌套评论 */}
        {isExpanded && comment.replies?.map((reply) => (
          <div key={reply.id} className="ml-8">
            {renderNestedComment(reply, user?.id === reply.author_id)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="font-sans text-2xl font-medium text-neutral-900 md:text-3xl">
          {blog.title}
        </h1>
        <p className="text-sm text-neutral-500">
          {new Date(blog.created_at).toLocaleDateString()}
        </p>
      </div>

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
                onClick={() => setShowDeleteBlogConfirm(true)}
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
            {comments.map((comment) => renderFirstLevelComment(comment))}
          </div>

          {comments.length === 0 && (
            <p className="text-neutral-400">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      {/* 删除博客确认弹窗 */}
      <ConfirmDialog
        open={showDeleteBlogConfirm}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={handleDeleteBlog}
        onCancel={() => setShowDeleteBlogConfirm(false)}
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
      />

      {/* 删除评论确认弹窗 */}
      <ConfirmDialog
        open={showDeleteCommentConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={handleDeleteComment}
        onCancel={() => {
          setShowDeleteCommentConfirm(false);
          setDeletingCommentId(null);
        }}
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
      />
    </>
  );
}

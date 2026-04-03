from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CommentBase(BaseModel):
    """评论基础 schema"""
    content: str = Field(..., min_length=1)


class CommentCreate(CommentBase):
    """创建评论请求"""
    parent_id: Optional[int] = None


class CommentUpdate(BaseModel):
    """更新评论请求"""
    content: str = Field(..., min_length=1)


class CommentResponse(CommentBase):
    """评论响应"""
    id: int
    blog_id: int
    author_id: int
    author_username: str
    author_avatar: Optional[str] = None
    parent_id: Optional[int] = None
    depth: int
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CommentTreeResponse(CommentBase):
    """嵌套评论响应（包含子评论）"""
    id: int
    blog_id: int
    author_id: int
    author_username: str
    author_avatar: Optional[str] = None
    parent_id: Optional[int] = None
    depth: int
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    replies: List["CommentTreeResponse"] = []

    class Config:
        from_attributes = True

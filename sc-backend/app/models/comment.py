from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Comment(SQLModel, table=True):
    """评论模型（支持无限嵌套）"""
    __tablename__ = "comments"

    id: Optional[int] = Field(default=None, primary_key=True)
    blog_id: int = Field(foreign_key="blogs.id", ondelete="CASCADE")
    author_id: int = Field(foreign_key="users.id")
    parent_id: Optional[int] = Field(default=None, foreign_key="comments.id")
    content: str
    depth: int = Field(default=0)  # 嵌套深度，0=顶级
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

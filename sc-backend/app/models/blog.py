from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Blog(SQLModel, table=True):
    """博客模型"""
    __tablename__ = "blogs"

    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="users.id")
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

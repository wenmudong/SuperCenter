"""博客路由"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, func

from app.database import engine
from app.models import User, Blog, Comment
from app.schemas import BlogCreate, BlogUpdate, BlogResponse, BlogListResponse
from app.middleware.auth import get_current_user, require_blogger

router = APIRouter(prefix="/api/blogs", tags=["博客"])


@router.get("", response_model=List[BlogListResponse])
def list_blogs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """获取博客列表（排除已删除）"""
    with Session(engine) as session:
        # 获取博客及其作者信息（排除已删除）
        blogs = session.exec(
            select(Blog, User.username)
            .join(User, Blog.author_id == User.id)
            .where(Blog.is_deleted == False)
            .order_by(Blog.created_at.desc())
            .offset(skip)
            .limit(limit)
        ).all()

        result = []
        for blog, author_username in blogs:
            # 获取评论数
            comment_count = session.exec(
                select(func.count()).where(Comment.blog_id == blog.id)
            ).one()

            result.append(BlogListResponse(
                id=blog.id,
                title=blog.title,
                subtitle=blog.subtitle,
                author_id=blog.author_id,
                author_username=author_username,
                created_at=blog.created_at,
                updated_at=blog.updated_at,
                comment_count=comment_count,
            ))

        return result


@router.post("", response_model=BlogResponse)
def create_blog(
    data: BlogCreate,
    current_user: User = Depends(require_blogger),
):
    """创建博客（仅博主）"""
    with Session(engine) as session:
        blog = Blog(
            author_id=current_user.id,
            title=data.title,
            subtitle=data.subtitle,
            content=data.content,
        )
        session.add(blog)
        session.commit()
        session.refresh(blog)
        return blog


@router.get("/{blog_id}", response_model=BlogResponse)
def get_blog(blog_id: int):
    """获取博客详情"""
    with Session(engine) as session:
        blog = session.exec(
            select(Blog).where(Blog.id == blog_id, Blog.is_deleted == False)
        ).first()
        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="博客不存在",
            )
        return blog


@router.put("/{blog_id}", response_model=BlogResponse)
def update_blog(
    blog_id: int,
    data: BlogUpdate,
    current_user: User = Depends(require_blogger),
):
    """更新博客（仅博主）"""
    with Session(engine) as session:
        blog = session.get(Blog, blog_id)
        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="博客不存在",
            )

        # 检查权限：只能编辑自己的博客
        if blog.author_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="只能编辑自己的博客",
            )

        if data.title is not None:
            blog.title = data.title
        if data.subtitle is not None:
            blog.subtitle = data.subtitle
        if data.content is not None:
            blog.content = data.content

        session.add(blog)
        session.commit()
        session.refresh(blog)
        return blog


@router.delete("/{blog_id}")
def delete_blog(
    blog_id: int,
    current_user: User = Depends(require_blogger),
):
    """软删除博客（仅博主）"""
    with Session(engine) as session:
        blog = session.get(Blog, blog_id)
        if not blog or blog.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="博客不存在",
            )

        # 检查权限：只能删除自己的博客
        if blog.author_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="只能删除自己的博客",
            )

        # 软删除：标记 is_deleted 为 True
        blog.is_deleted = True
        from datetime import datetime
        blog.deleted_at = datetime.utcnow()
        session.add(blog)
        session.commit()
        return {"message": "博客已删除"}

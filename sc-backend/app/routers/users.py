"""用户路由"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import engine
from app.models import User
from app.schemas import UserResponse, UserUpdate
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["用户"])


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_my_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
):
    """更新当前用户信息"""
    with Session(engine) as session:
        user = session.get(User, current_user.id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在",
            )

        if data.email is not None:
            # 检查邮箱是否被其他用户使用
            existing = session.exec(
                select(User).where(User.email == data.email, User.id != user.id)
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="邮箱已被使用",
                )
            user.email = data.email

        if data.avatar_url is not None:
            user.avatar_url = data.avatar_url

        session.add(user)
        session.commit()
        session.refresh(user)
        return user

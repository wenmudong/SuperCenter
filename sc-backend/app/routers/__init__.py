from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.upload import router as upload_router
from app.routers.blogs import router as blogs_router
from app.routers.comments import router as comments_router

__all__ = [
    "auth_router",
    "users_router",
    "upload_router",
    "blogs_router",
    "comments_router",
]

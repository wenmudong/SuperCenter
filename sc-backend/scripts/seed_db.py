"""
Database seed script - Create default users
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from passlib.hash import argon2
from sqlalchemy import text
from sqlmodel import Session, create_engine, SQLModel

from app.models import User, UserRole
from app.config import settings


def hash_password(password: str) -> str:
    """Hash password"""
    return argon2.hash(password)


def seed_users():
    """Create default users"""
    engine = create_engine(settings.database_url)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        existing = session.exec(
            text("SELECT COUNT(*) FROM users")
        ).scalar_one()

        if existing > 0:
            print("Users exist, skip seeding")
            return

        blogger = User(
            username="wenmudong",
            email="wenmudong@example.com",
            password_hash=hash_password("wenmudong.hwd"),
            role=UserRole.BLOGGER.value,
        )
        session.add(blogger)

        admin = User(
            username="admin",
            email="admin@example.com",
            password_hash=hash_password("admin.hwd"),
            role=UserRole.ADMIN.value,
        )
        session.add(admin)

        session.commit()
        print("Seed users created:")
        print("  - wenmudong (blogger)")
        print("  - admin (admin)")


if __name__ == "__main__":
    seed_users()

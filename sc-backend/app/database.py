from sqlmodel import SQLModel, create_engine
from app.config import settings

connect_args = {"check_same_thread": False} if "sqlite" in settings.database_url else {}
engine = create_engine(settings.database_url, echo=settings.debug, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class SystemConfig(SQLModel, table=True):
    """系统配置模型"""
    __tablename__ = "system_config"

    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(unique=True, index=True, max_length=100)
    value: str = Field(max_length=1000)
    description: Optional[str] = Field(default=None, max_length=500)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True

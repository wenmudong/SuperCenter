from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class SystemConfigBase(BaseModel):
    key: str = Field(..., max_length=100)
    value: str = Field(..., max_length=1000)
    description: Optional[str] = Field(default=None, max_length=500)


class SystemConfigCreate(SystemConfigBase):
    pass


class SystemConfigUpdate(BaseModel):
    value: str = Field(..., max_length=1000)
    description: Optional[str] = Field(default=None, max_length=500)


class SystemConfigResponse(SystemConfigBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True


class SystemConfigListResponse(BaseModel):
    configs: List[SystemConfigResponse]
    total: int

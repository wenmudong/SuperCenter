from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SuperCenter API"
    debug: bool = True
    database_url: str = "sqlite:///./data/supercenter.db"

    class Config:
        env_file = ".env"


settings = Settings()

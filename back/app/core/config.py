from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings"""

    # Application
    APP_NAME: str = "Career AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # PostgreSQL Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "admin"
    DB_PASSWORD: str = "secret"
    DB_NAME: str = "career_ai"
    DATABASE_URL: Optional[str] = None

    # Vector Settings (pgvector)
    VECTOR_DIMENSIONS: int = 384  # Default embedding dimension

    # API
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def database_url(self) -> str:
        """Generate database URL from components"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


# Singleton instance
settings = Settings()

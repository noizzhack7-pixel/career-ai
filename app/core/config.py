from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings"""

    # Application
    APP_NAME: str = "Career AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DB_USER: str = "admin"
    DB_PASSWORD: str = "secret"
    DB_NAME: str = "test.db"

    # Vector Database (Qdrant)
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION_CANDIDATES: str = "candidates"
    QDRANT_COLLECTION_SKILLS: str = "skills"
    QDRANT_VECTOR_SIZE: int = 384  # Default embedding dimension

    # API
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        env_file = ".env"
        case_sensitive = True


# Singleton instance
settings = Settings()

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
    # Supabase managed Postgres (preferred if provided)
    SUPABASE_DB_URL: Optional[str] = None
    SUPABASE_REQUIRE_SSL: bool = True

    # Vector Settings (pgvector)
    VECTOR_DIMENSIONS: int = 384  # Default embedding dimension

    # API
    API_V1_PREFIX: str = "/api/v1"

    # OpenAI
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def database_url(self) -> str:
        """Generate database URL from components"""
        # Prefer explicit Supabase connection string when available
        url = self.SUPABASE_DB_URL or self.DATABASE_URL
        if not url:
            url = f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

        # Ensure sslmode=require for managed providers like Supabase unless explicitly set
        if self.SUPABASE_REQUIRE_SSL and "sslmode=" not in url and ("supabase.co" in url or self.SUPABASE_DB_URL):
            sep = "&" if "?" in url else "?"
            url = f"{url}{sep}sslmode=require"
        return url


# Singleton instance
settings = Settings()

import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "ResolveIQ API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./resolveiq.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "resolveiq-super-secret-jwt-key-2026-production-change-me")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    
    # LLM & AI - NVIDIA NIM First
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_MULTILINGUAL_API_KEY: str = os.getenv("NVIDIA_MULTILINGUAL_API_KEY", "")
    NVIDIA_NEMOTRON_API_KEY: str = os.getenv("NVIDIA_NEMOTRON_API_KEY", "")
    NVIDIA_GUARD_API_KEY: str = os.getenv("NVIDIA_GUARD_API_KEY", "")
    NVIDIA_MODEL: str = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3.5-lightning-30b-a3b")
    NVIDIA_MODEL_NEMOTRON: str = os.getenv("NVIDIA_MODEL_NEMOTRON", "nvidia/nemotron-3.5-lightning-30b-a3b")
    NVIDIA_MODEL_GUARD: str = os.getenv("NVIDIA_MODEL_GUARD", "meta/llama-guard-4-12b")
    NVIDIA_BASE_URL: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "nvidia")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "large-v3")
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    
    # Telegram
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_WEBHOOK_SECRET: str = os.getenv("TELEGRAM_WEBHOOK_SECRET", "resolveiq_secret_token")
    
    # Object Storage
    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID", "")
    R2_ACCESS_KEY_ID: str = os.getenv("R2_ACCESS_KEY_ID", "")
    R2_SECRET_ACCESS_KEY: str = os.getenv("R2_SECRET_ACCESS_KEY", "")
    R2_BUCKET: str = os.getenv("R2_BUCKET", "resolveiq-media")
    
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()


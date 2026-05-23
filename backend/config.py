import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Determine the absolute path to the .env file in the same directory as config.py
base_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_dir, ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "RoadSoS AI"
    API_V1_STR: str = "/api"
    
    # API Keys
    GOOGLE_PLACES_KEY: Optional[str] = None
    TWILIO_SID: Optional[str] = None
    TWILIO_TOKEN: Optional[str] = None
    TWILIO_FROM: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "sqlite:///./roadsos.db"
    
    # Ollama / AI (Strict/Local)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2:3b"
    
    # Cloud AI (Fallback)
    OPENAI_API_KEY: Optional[str] = None
    AI_BASE_URL: str = "https://api.openai.com/v1"
    AI_MODEL: str = "gpt-4o-mini"
    
    model_config = SettingsConfigDict(env_file=env_path, env_file_encoding='utf-8', case_sensitive=True)

settings = Settings()

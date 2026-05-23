from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import routers (to be created)
from routers import voice, emergency, sos, ai_chat, cache, report, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Starting RoadSoS AI Backend...")
    yield
    # Shutdown logic
    logger.info("Shutting down RoadSoS AI Backend...")

app = FastAPI(
    title="RoadSoS AI",
    description="Voice-First Emergency Response Chatbot API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(voice.router, prefix="/api/voice", tags=["Voice"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])
app.include_router(sos.router, prefix="/api/sos", tags=["SOS"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Chat"])
app.include_router(cache.router, prefix="/api/cache", tags=["Cache"])
app.include_router(report.router, prefix="/api/report", tags=["Report"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])

@app.get("/")
async def root():
    return {"message": "Welcome to RoadSoS AI API", "status": "online"}

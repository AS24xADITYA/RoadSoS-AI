from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "osm": "online",
            "database": "online",
            "ai": "standby"
        }
    }

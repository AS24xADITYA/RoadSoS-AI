from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services import places_service

router = APIRouter()

class NearbyRequest(BaseModel):
    lat: float
    lon: float
    types: List[str]
    radius_km: Optional[int] = 10

@router.post("/nearby")
async def get_nearby(request: NearbyRequest):
    try:
        contacts = await places_service.get_nearby_emergency_contacts(
            request.lat, request.lon, request.types, request.radius_km
        )
        return {"contacts": contacts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

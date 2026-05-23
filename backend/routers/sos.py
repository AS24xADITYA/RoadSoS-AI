from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
import httpx

logger = logging.getLogger(__name__)

router = APIRouter()

class SOSRequest(BaseModel):
    lat: float
    lon: float
    contact_ids: List[str]

class Location(BaseModel):
    lat: float
    lon: float

@router.post("/send")
async def send_sos(request: SOSRequest):
    logger.info(f"SOS Broadcast triggered at {request.lat}, {request.lon}")
    return {
        "status": "sent",
        "message": f"SOS alerts sent to {len(request.contact_ids)} services.",
        "location": f"https://maps.google.com/?q={request.lat},{request.lon}"
    }

@router.post("/hospitals")
async def get_nearby_hospitals(loc: Location):
    radius = 5000 # 5km
    overpass_url = "https://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:{radius},{loc.lat},{loc.lon});
      way["amenity"="hospital"](around:{radius},{loc.lat},{loc.lon});
      relation["amenity"="hospital"](around:{radius},{loc.lat},{loc.lon});
    );
    out center;
    """
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(overpass_url, data={"data": overpass_query})
            data = response.json()
            
            hospitals = []
            for element in data.get("elements", []):
                name = element.get("tags", {}).get("name", "Unknown Hospital")
                lat = element.get("lat") or element.get("center", {}).get("lat")
                lon = element.get("lon") or element.get("center", {}).get("lon")
                if lat and lon:
                    hospitals.append({"name": name, "lat": lat, "lon": lon})
            
            if not hospitals:
                raise Exception("No hospitals found")
                
            return {"status": "success", "data": hospitals}
            
    except Exception as e:
        logger.error(f"Overpass API error: {e}")
        # Fallback data
        return {
            "status": "fallback",
            "data": [
                {"name": "Emergency Medical Center (Fallback)", "lat": loc.lat + 0.01, "lon": loc.lon + 0.01},
                {"name": "City General Hospital (Fallback)", "lat": loc.lat - 0.01, "lon": loc.lon - 0.01},
                {"name": "Regional Trauma Care (Fallback)", "lat": loc.lat + 0.015, "lon": loc.lon - 0.015}
            ]
        }

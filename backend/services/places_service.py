import httpx
import logging
from typing import List, Dict, Any
from utils.haversine import calculate_distance

logger = logging.getLogger(__name__)

OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

CATEGORY_TAGS = {
    'hospital': '[amenity=hospital]',
    'ambulance': '[amenity=ambulance_station]',
    'police': '[amenity=police]',
    'towing': '[shop=car_repair]',
    'fuel': '[amenity=fuel]',
    'pharmacy': '[amenity=pharmacy]',
    'blood_bank': '[amenity=blood_bank]'
}

def _infer_category(tags: Dict[str, Any]) -> str:
    if tags.get('amenity') == 'hospital': return 'hospital'
    if tags.get('amenity') == 'ambulance_station': return 'ambulance'
    if tags.get('amenity') == 'police': return 'police'
    if tags.get('shop') == 'car_repair': return 'towing'
    if tags.get('amenity') == 'fuel': return 'fuel'
    if tags.get('amenity') == 'pharmacy': return 'pharmacy'
    if tags.get('amenity') == 'blood_bank': return 'blood_bank'
    return 'other'

async def get_nearby_emergency_contacts(
    lat: float, lon: float, types: List[str], radius_km: int = 10
) -> List[Dict[str, Any]]:
    radius_m = radius_km * 1000
    
    # Build multi-category Overpass QL query
    nodes = ""
    for t in types:
        if t in CATEGORY_TAGS:
            nodes += f'node{CATEGORY_TAGS[t]}(around:{radius_m},{lat},{lon});'
    
    if not nodes:
        return []

    query = f'[out:json][timeout:25];({nodes});out body;'
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(OVERPASS_URL, params={'data': query})
            resp.raise_for_status()
            elements = resp.json().get('elements', [])
            
            contacts = []
            for el in elements:
                tags = el.get('tags', {})
                contact_lat = el.get('lat')
                contact_lon = el.get('lon')
                
                if contact_lat is None or contact_lon is None:
                    continue
                    
                contacts.append({
                    'name': tags.get('name', 'Unknown Service'),
                    'phone': tags.get('phone') or tags.get('contact:phone') or tags.get('emergency:phone', '108'),
                    'address': tags.get('addr:full') or tags.get('addr:street', 'Address unavailable'),
                    'lat': contact_lat,
                    'lon': contact_lon,
                    'category': _infer_category(tags),
                    'distance': round(calculate_distance(lat, lon, contact_lat, contact_lon), 2),
                    'source': 'osm'
                })
            
            # Sort by distance
            return sorted(contacts, key=lambda x: x['distance'])
            
    except Exception as e:
        logger.error(f"Error fetching OSM data: {str(e)}")
        return []

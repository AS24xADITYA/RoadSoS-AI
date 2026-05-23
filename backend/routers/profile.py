from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from db.database import get_db
from db import models

router = APIRouter(prefix="/api/profile", tags=["profile"])

class EmergencyContact(BaseModel):
    name: str
    phone: str
    relation: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None
    medical_conditions: Optional[str] = None
    emergency_contacts: Optional[List[EmergencyContact]] = None

@router.get("/{user_id}")
async def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{user_id}")
async def update_profile(user_id: int, profile_data: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_dict = profile_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        if key == "emergency_contacts" and value is not None:
            # Convert Pydantic models to dictionaries for JSON storage
            setattr(profile, key, [c.dict() for c in value])
        else:
            setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile

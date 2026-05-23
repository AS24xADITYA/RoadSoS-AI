from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db.database import get_db
from db import models
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])

class AuthRequest(BaseModel):
    phone_number: str

class VerifyRequest(BaseModel):
    phone_number: str
    otp: str

@router.post("/request-otp")
async def request_otp(req: AuthRequest):
    # In a real app, send SMS here. For mock, just return success.
    return {"message": "OTP sent successfully (Mock: Use 123456)"}

@router.post("/verify-otp")
async def verify_otp(req: VerifyRequest, db: Session = Depends(get_db)):
    if req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if user exists, else create
    user = db.query(models.User).filter(models.User.phone_number == req.phone_number).first()
    if not user:
        user = models.User(phone_number=req.phone_number)
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create empty profile
        profile = models.Profile(user_id=user.id, emergency_contacts=[])
        db.add(profile)
        db.commit()

    # Generate a mock token
    token = f"mock-token-{uuid.uuid4()}-{user.id}"
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "phone_number": user.phone_number
    }

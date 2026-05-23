from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True) # For mock auth, we might not use this much
    
    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    blood_group = Column(String, nullable=True)
    medical_conditions = Column(Text, nullable=True)
    emergency_contacts = Column(JSON, nullable=True) # Store list of {name, phone, relation}

    user = relationship("User", back_populates="profile")

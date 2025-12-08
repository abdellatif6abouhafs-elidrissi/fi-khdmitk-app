from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class ServiceCreate(BaseModel):
    category: str
    name: str
    description: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    price_type: str = "fixed"

class ServiceResponse(BaseModel):
    id: int
    category: str
    name: str
    description: Optional[str]
    price_min: Optional[float]
    price_max: Optional[float]
    price_type: str

    class Config:
        from_attributes = True

class PortfolioCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: str
    before_image: Optional[str] = None

class PortfolioResponse(BaseModel):
    id: int
    title: Optional[str]
    description: Optional[str]
    image_url: str
    before_image: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ArtisanCreate(BaseModel):
    bio: Optional[str] = None
    experience_years: int = 0
    city: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    service_radius_km: int = 20
    working_hours: Optional[Dict] = None
    services: List[ServiceCreate]

class ArtisanUpdate(BaseModel):
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    city: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    service_radius_km: Optional[int] = None
    is_available: Optional[bool] = None
    working_hours: Optional[Dict] = None

class ArtisanResponse(BaseModel):
    id: int
    user_id: int
    bio: Optional[str]
    experience_years: int
    city: str
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    service_radius_km: int
    is_available: bool
    working_hours: Optional[Dict]
    rating: float
    total_reviews: int
    completed_jobs: int
    is_verified: bool
    created_at: datetime
    services: List[ServiceResponse] = []
    portfolio: List[PortfolioResponse] = []

    class Config:
        from_attributes = True

class ArtisanListResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    avatar: Optional[str]
    bio: Optional[str]
    city: str
    rating: float
    total_reviews: int
    is_available: bool
    is_verified: bool
    services: List[ServiceResponse] = []

    class Config:
        from_attributes = True

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    booking_id: int
    rating: float = Field(..., ge=1, le=5)
    quality_rating: Optional[float] = Field(None, ge=1, le=5)
    punctuality_rating: Optional[float] = Field(None, ge=1, le=5)
    communication_rating: Optional[float] = Field(None, ge=1, le=5)
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    booking_id: int
    customer_id: int
    artisan_id: int
    rating: float
    quality_rating: Optional[float]
    punctuality_rating: Optional[float]
    communication_rating: Optional[float]
    comment: Optional[str]
    artisan_response: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ArtisanResponseToReview(BaseModel):
    artisan_response: str

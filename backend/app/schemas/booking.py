from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.booking import BookingStatus, PaymentStatus

class BookingCreate(BaseModel):
    artisan_id: int
    service_category: str
    service_description: str
    scheduled_date: datetime
    scheduled_time: str
    address: str
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    estimated_price: Optional[float] = None
    customer_notes: Optional[str] = None

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    artisan_notes: Optional[str] = None
    final_price: Optional[float] = None

class BookingResponse(BaseModel):
    id: int
    customer_id: int
    artisan_id: int
    service_category: str
    service_description: str
    scheduled_date: datetime
    scheduled_time: str
    estimated_duration: Optional[int]
    address: str
    city: str
    latitude: Optional[float]
    longitude: Optional[float]
    estimated_price: Optional[float]
    final_price: Optional[float]
    status: BookingStatus
    payment_status: PaymentStatus
    customer_notes: Optional[str]
    artisan_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

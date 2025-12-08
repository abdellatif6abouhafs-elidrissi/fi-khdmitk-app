from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    artisan_id = Column(Integer, ForeignKey("artisans.id"))

    # Service Details
    service_category = Column(String, nullable=False)
    service_description = Column(Text, nullable=False)

    # Schedule
    scheduled_date = Column(DateTime, nullable=False)
    scheduled_time = Column(String, nullable=False)
    estimated_duration = Column(Integer, nullable=True)  # in minutes

    # Location
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Pricing
    estimated_price = Column(Float, nullable=True)
    final_price = Column(Float, nullable=True)

    # Status
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)

    # Payment
    stripe_payment_id = Column(String, nullable=True)

    # Notes
    customer_notes = Column(Text, nullable=True)
    artisan_notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="bookings_as_customer")
    artisan = relationship("Artisan", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False)

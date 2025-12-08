from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    artisan_id = Column(Integer, ForeignKey("artisans.id"))

    # Rating (1-5)
    rating = Column(Float, nullable=False)
    quality_rating = Column(Float, nullable=True)  # Quality of work
    punctuality_rating = Column(Float, nullable=True)  # On-time
    communication_rating = Column(Float, nullable=True)  # Communication

    # Review Content
    comment = Column(Text, nullable=True)

    # Artisan Response
    artisan_response = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="review")
    customer = relationship("User", back_populates="reviews")
    artisan = relationship("Artisan", back_populates="reviews")

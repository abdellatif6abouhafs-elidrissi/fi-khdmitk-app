from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Artisan(Base):
    __tablename__ = "artisans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # Profile Info
    bio = Column(Text, nullable=True)
    experience_years = Column(Integer, default=0)

    # Location
    city = Column(String, nullable=False)
    address = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    service_radius_km = Column(Integer, default=20)  # Service area

    # Availability
    is_available = Column(Boolean, default=True)
    working_hours = Column(JSON, nullable=True)  # {"monday": {"start": "08:00", "end": "18:00"}, ...}

    # Stats
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    completed_jobs = Column(Integer, default=0)

    # Verification
    is_verified = Column(Boolean, default=False)
    id_document = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="artisan_profile")
    services = relationship("ArtisanService", back_populates="artisan")
    portfolio = relationship("ArtisanPortfolio", back_populates="artisan")
    bookings = relationship("Booking", back_populates="artisan")
    reviews = relationship("Review", back_populates="artisan")


class ArtisanService(Base):
    __tablename__ = "artisan_services"

    id = Column(Integer, primary_key=True, index=True)
    artisan_id = Column(Integer, ForeignKey("artisans.id"))

    category = Column(String, nullable=False)  # plumbing, electrical, carpentry, etc.
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price_min = Column(Float, nullable=True)
    price_max = Column(Float, nullable=True)
    price_type = Column(String, default="fixed")  # fixed, hourly, negotiable

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    artisan = relationship("Artisan", back_populates="services")


class ArtisanPortfolio(Base):
    __tablename__ = "artisan_portfolio"

    id = Column(Integer, primary_key=True, index=True)
    artisan_id = Column(Integer, ForeignKey("artisans.id"))

    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=False)
    before_image = Column(String, nullable=True)  # Before/After

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    artisan = relationship("Artisan", back_populates="portfolio")

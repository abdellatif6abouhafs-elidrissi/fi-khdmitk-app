from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.database import engine, Base
from app.routers import auth, artisans, bookings, reviews

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="API pour la plateforme Fi-Khidmatik - Services à domicile",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(artisans.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Bienvenue sur l'API Fi-Khidmatik",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Service categories endpoint
@app.get("/api/categories")
def get_service_categories():
    return {
        "categories": [
            {"id": "plumbing", "name_fr": "Plomberie", "name_ar": "سباكة", "icon": "🔧"},
            {"id": "electrical", "name_fr": "Électricité", "name_ar": "كهرباء", "icon": "⚡"},
            {"id": "carpentry", "name_fr": "Menuiserie", "name_ar": "نجارة", "icon": "🪚"},
            {"id": "painting", "name_fr": "Peinture", "name_ar": "دهان", "icon": "🎨"},
            {"id": "hvac", "name_fr": "Climatisation", "name_ar": "تكييف", "icon": "❄️"},
            {"id": "cleaning", "name_fr": "Nettoyage", "name_ar": "تنظيف", "icon": "🧹"},
            {"id": "gardening", "name_fr": "Jardinage", "name_ar": "بستنة", "icon": "🌱"},
            {"id": "masonry", "name_fr": "Maçonnerie", "name_ar": "بناء", "icon": "🧱"},
            {"id": "locksmith", "name_fr": "Serrurerie", "name_ar": "حدادة", "icon": "🔐"},
            {"id": "appliance", "name_fr": "Électroménager", "name_ar": "إصلاح الأجهزة", "icon": "🔌"},
            {"id": "moving", "name_fr": "Déménagement", "name_ar": "نقل", "icon": "📦"},
            {"id": "other", "name_fr": "Autre", "name_ar": "أخرى", "icon": "🔨"},
        ]
    }

# Cities endpoint (Morocco)
@app.get("/api/cities")
def get_cities():
    return {
        "cities": [
            "Casablanca", "Rabat", "Fès", "Marrakech", "Tanger",
            "Meknès", "Agadir", "Oujda", "Kénitra", "Tétouan",
            "Salé", "Temara", "Safi", "El Jadida", "Mohammedia",
            "Béni Mellal", "Nador", "Taza", "Settat", "Khouribga"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

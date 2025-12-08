from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.artisan import Artisan, ArtisanService, ArtisanPortfolio
from app.schemas.artisan import (
    ArtisanResponse,
    ArtisanUpdate,
    ArtisanListResponse,
    ServiceCreate,
    ServiceResponse,
    PortfolioCreate,
    PortfolioResponse
)
from app.core.security import get_current_user

router = APIRouter(prefix="/artisans", tags=["Artisans"])

# Service categories
SERVICE_CATEGORIES = [
    "plumbing",      # سباكة
    "electrical",    # كهرباء
    "carpentry",     # نجارة
    "painting",      # دهان
    "hvac",          # تكييف وتبريد
    "cleaning",      # تنظيف
    "gardening",     # بستنة
    "masonry",       # بناء
    "locksmith",     # حداد
    "appliance",     # إصلاح الأجهزة
    "moving",        # نقل
    "other"          # أخرى
]

@router.get("/categories")
def get_categories():
    return SERVICE_CATEGORIES

@router.get("/", response_model=List[ArtisanListResponse])
def get_artisans(
    city: Optional[str] = None,
    category: Optional[str] = None,
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    is_available: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Artisan).options(
        joinedload(Artisan.user),
        joinedload(Artisan.services)
    )

    # Filter by city
    if city:
        query = query.filter(Artisan.city.ilike(f"%{city}%"))

    # Filter by category
    if category:
        query = query.join(ArtisanService).filter(
            ArtisanService.category == category
        )

    # Filter by rating
    if min_rating is not None:
        query = query.filter(Artisan.rating >= min_rating)

    # Filter by availability
    if is_available is not None:
        query = query.filter(Artisan.is_available == is_available)

    # Search by name or bio
    if search:
        query = query.join(User).filter(
            (User.full_name.ilike(f"%{search}%")) |
            (Artisan.bio.ilike(f"%{search}%"))
        )

    # Order by rating
    query = query.order_by(Artisan.rating.desc())

    artisans = query.offset(skip).limit(limit).all()

    # Transform to response format
    result = []
    for artisan in artisans:
        result.append(ArtisanListResponse(
            id=artisan.id,
            user_id=artisan.user_id,
            full_name=artisan.user.full_name,
            avatar=artisan.user.avatar,
            bio=artisan.bio,
            city=artisan.city,
            rating=artisan.rating,
            total_reviews=artisan.total_reviews,
            is_available=artisan.is_available,
            is_verified=artisan.is_verified,
            services=[ServiceResponse.model_validate(s) for s in artisan.services]
        ))

    return result

@router.get("/{artisan_id}", response_model=ArtisanResponse)
def get_artisan(artisan_id: int, db: Session = Depends(get_db)):
    artisan = db.query(Artisan).options(
        joinedload(Artisan.user),
        joinedload(Artisan.services),
        joinedload(Artisan.portfolio)
    ).filter(Artisan.id == artisan_id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan not found"
        )

    return artisan

@router.put("/me", response_model=ArtisanResponse)
def update_my_profile(
    update_data: ArtisanUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan profile not found"
        )

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(artisan, field, value)

    db.commit()
    db.refresh(artisan)

    return artisan

@router.post("/me/services", response_model=ServiceResponse)
def add_service(
    service_data: ServiceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan profile not found"
        )

    service = ArtisanService(
        artisan_id=artisan.id,
        **service_data.model_dump()
    )
    db.add(service)
    db.commit()
    db.refresh(service)

    return service

@router.delete("/me/services/{service_id}")
def delete_service(
    service_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan profile not found"
        )

    service = db.query(ArtisanService).filter(
        ArtisanService.id == service_id,
        ArtisanService.artisan_id == artisan.id
    ).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    db.delete(service)
    db.commit()

    return {"message": "Service deleted"}

@router.post("/me/portfolio", response_model=PortfolioResponse)
def add_portfolio_item(
    portfolio_data: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan profile not found"
        )

    portfolio = ArtisanPortfolio(
        artisan_id=artisan.id,
        **portfolio_data.model_dump()
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)

    return portfolio

@router.delete("/me/portfolio/{portfolio_id}")
def delete_portfolio_item(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan profile not found"
        )

    portfolio = db.query(ArtisanPortfolio).filter(
        ArtisanPortfolio.id == portfolio_id,
        ArtisanPortfolio.artisan_id == artisan.id
    ).first()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )

    db.delete(portfolio)
    db.commit()

    return {"message": "Portfolio item deleted"}

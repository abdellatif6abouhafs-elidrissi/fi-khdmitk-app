from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.artisan import Artisan, ArtisanService
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.schemas.artisan import ArtisanCreate
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if phone exists
    if user_data.phone and db.query(User).filter(User.phone == user_data.phone).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )

    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role,
        preferred_language=user_data.preferred_language
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.post("/register/artisan", response_model=UserResponse)
def register_artisan(
    user_data: UserCreate,
    artisan_data: ArtisanCreate,
    db: Session = Depends(get_db)
):
    # Set role to artisan
    user_data.role = UserRole.ARTISAN

    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role=UserRole.ARTISAN,
        preferred_language=user_data.preferred_language
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create artisan profile
    artisan = Artisan(
        user_id=user.id,
        bio=artisan_data.bio,
        experience_years=artisan_data.experience_years,
        city=artisan_data.city,
        address=artisan_data.address,
        latitude=artisan_data.latitude,
        longitude=artisan_data.longitude,
        service_radius_km=artisan_data.service_radius_km,
        working_hours=artisan_data.working_hours
    )
    db.add(artisan)
    db.commit()
    db.refresh(artisan)

    # Add services
    for service_data in artisan_data.services:
        service = ArtisanService(
            artisan_id=artisan.id,
            category=service_data.category,
            name=service_data.name,
            description=service_data.description,
            price_min=service_data.price_min,
            price_max=service_data.price_max,
            price_type=service_data.price_type
        )
        db.add(service)

    db.commit()

    return user

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return Token(access_token=access_token, refresh_token=refresh_token)

@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    access_token = create_access_token(data={"sub": user.id})
    new_refresh_token = create_refresh_token(data={"sub": user.id})

    return Token(access_token=access_token, refresh_token=new_refresh_token)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

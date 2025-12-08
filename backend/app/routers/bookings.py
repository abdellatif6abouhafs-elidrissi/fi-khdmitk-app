from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.user import User, UserRole
from app.models.artisan import Artisan
from app.models.booking import Booking, BookingStatus
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate
from app.core.security import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/", response_model=BookingResponse)
def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if artisan exists
    artisan = db.query(Artisan).filter(Artisan.id == booking_data.artisan_id).first()
    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan not found"
        )

    # Check if artisan is available
    if not artisan.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Artisan is not available"
        )

    # Create booking
    booking = Booking(
        customer_id=current_user.id,
        artisan_id=booking_data.artisan_id,
        service_category=booking_data.service_category,
        service_description=booking_data.service_description,
        scheduled_date=booking_data.scheduled_date,
        scheduled_time=booking_data.scheduled_time,
        address=booking_data.address,
        city=booking_data.city,
        latitude=booking_data.latitude,
        longitude=booking_data.longitude,
        estimated_price=booking_data.estimated_price,
        customer_notes=booking_data.customer_notes
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking

@router.get("/my-bookings", response_model=List[BookingResponse])
def get_my_bookings(
    status_filter: BookingStatus = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Booking).filter(Booking.customer_id == current_user.id)

    if status_filter:
        query = query.filter(Booking.status == status_filter)

    return query.order_by(Booking.created_at.desc()).all()

@router.get("/artisan-bookings", response_model=List[BookingResponse])
def get_artisan_bookings(
    status_filter: BookingStatus = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan profile not found"
        )

    query = db.query(Booking).filter(Booking.artisan_id == artisan.id)

    if status_filter:
        query = query.filter(Booking.status == status_filter)

    return query.order_by(Booking.created_at.desc()).all()

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Check permission
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()
    artisan_id = artisan.id if artisan else None

    if booking.customer_id != current_user.id and booking.artisan_id != artisan_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )

    return booking

@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    update_data: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Get artisan profile if exists
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()
    artisan_id = artisan.id if artisan else None

    # Check permission
    if booking.customer_id != current_user.id and booking.artisan_id != artisan_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booking"
        )

    # Update fields
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)

    # Update artisan stats if completed
    if update_data.status == BookingStatus.COMPLETED and artisan:
        artisan.completed_jobs += 1

    db.commit()
    db.refresh(booking)

    return booking

@router.post("/{booking_id}/accept", response_model=BookingResponse)
def accept_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan or booking.artisan_id != artisan.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is not pending"
        )

    booking.status = BookingStatus.ACCEPTED
    db.commit()
    db.refresh(booking)

    return booking

@router.post("/{booking_id}/reject", response_model=BookingResponse)
def reject_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan or booking.artisan_id != artisan.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is not pending"
        )

    booking.status = BookingStatus.REJECTED
    db.commit()
    db.refresh(booking)

    return booking

@router.post("/{booking_id}/complete", response_model=BookingResponse)
def complete_booking(
    booking_id: int,
    final_price: float = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan or booking.artisan_id != artisan.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    if booking.status != BookingStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking must be in progress to complete"
        )

    booking.status = BookingStatus.COMPLETED
    if final_price:
        booking.final_price = final_price

    artisan.completed_jobs += 1

    db.commit()
    db.refresh(booking)

    return booking

@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Check if customer
    if booking.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    if booking.status not in [BookingStatus.PENDING, BookingStatus.ACCEPTED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel this booking"
        )

    booking.status = BookingStatus.CANCELLED
    db.commit()
    db.refresh(booking)

    return booking

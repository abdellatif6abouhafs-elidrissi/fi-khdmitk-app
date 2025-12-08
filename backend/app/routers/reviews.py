from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.artisan import Artisan
from app.models.booking import Booking, BookingStatus
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewResponse, ArtisanResponseToReview
from app.core.security import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=ReviewResponse)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if booking exists and is completed
    booking = db.query(Booking).filter(Booking.id == review_data.booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to review this booking"
        )

    if booking.status != BookingStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only review completed bookings"
        )

    # Check if review already exists
    existing_review = db.query(Review).filter(Review.booking_id == booking.id).first()
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already exists for this booking"
        )

    # Create review
    review = Review(
        booking_id=booking.id,
        customer_id=current_user.id,
        artisan_id=booking.artisan_id,
        rating=review_data.rating,
        quality_rating=review_data.quality_rating,
        punctuality_rating=review_data.punctuality_rating,
        communication_rating=review_data.communication_rating,
        comment=review_data.comment
    )
    db.add(review)

    # Update artisan rating
    artisan = db.query(Artisan).filter(Artisan.id == booking.artisan_id).first()
    if artisan:
        # Calculate new average rating
        total_rating = (artisan.rating * artisan.total_reviews) + review_data.rating
        artisan.total_reviews += 1
        artisan.rating = round(total_rating / artisan.total_reviews, 2)

    db.commit()
    db.refresh(review)

    return review

@router.get("/artisan/{artisan_id}", response_model=List[ReviewResponse])
def get_artisan_reviews(
    artisan_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    reviews = db.query(Review).filter(
        Review.artisan_id == artisan_id
    ).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()

    return reviews

@router.post("/{review_id}/respond", response_model=ReviewResponse)
def respond_to_review(
    review_id: int,
    response_data: ArtisanResponseToReview,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )

    # Check if current user is the artisan
    artisan = db.query(Artisan).filter(Artisan.user_id == current_user.id).first()

    if not artisan or review.artisan_id != artisan.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to respond to this review"
        )

    if review.artisan_response:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already responded to this review"
        )

    review.artisan_response = response_data.artisan_response
    db.commit()
    db.refresh(review)

    return review

@router.get("/stats/{artisan_id}")
def get_review_stats(artisan_id: int, db: Session = Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()

    if not artisan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artisan not found"
        )

    # Get rating distribution
    rating_counts = db.query(
        func.floor(Review.rating).label("rating"),
        func.count(Review.id).label("count")
    ).filter(Review.artisan_id == artisan_id).group_by(
        func.floor(Review.rating)
    ).all()

    distribution = {i: 0 for i in range(1, 6)}
    for rating, count in rating_counts:
        distribution[int(rating)] = count

    # Get average sub-ratings
    avg_ratings = db.query(
        func.avg(Review.quality_rating).label("quality"),
        func.avg(Review.punctuality_rating).label("punctuality"),
        func.avg(Review.communication_rating).label("communication")
    ).filter(Review.artisan_id == artisan_id).first()

    return {
        "total_reviews": artisan.total_reviews,
        "average_rating": artisan.rating,
        "distribution": distribution,
        "quality_rating": round(avg_ratings.quality or 0, 2),
        "punctuality_rating": round(avg_ratings.punctuality or 0, 2),
        "communication_rating": round(avg_ratings.communication or 0, 2)
    }

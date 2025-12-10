from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.db import get_db
from app import models, schemas
from .auth import get_current_user

router = APIRouter()   # ❗ remove prefix and tags here
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ----------------------
# LIST STAFF
# ----------------------
@router.get("", response_model=list[schemas.UserOut])
def list_staff(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),   # no models.User type here
):
    # SuperAdmin sees everyone
    if current_user.role == "SuperAdmin":
        return db.query(models.User).order_by(models.User.userId).all()

    # Admin sees only their department
    return (
        db.query(models.User)
        .filter(models.User.department == current_user.department)
        .order_by(models.User.userId)
        .all()
    )


# ----------------------
# CREATE STAFF
# ----------------------
@router.post("", response_model=schemas.UserOut)
def create_staff(
    payload: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Prevent duplicate emails
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(400, "Email already exists")

    # Admin can ONLY create Staff in their own department
    if current_user.role == "Admin":
        if payload.role != "Staff":
            raise HTTPException(403, "Admins can only create Staff users")
        payload.department = current_user.department

    # Hash password if provided
    password_hash = pwd.hash(payload.password) if payload.password else None

    new_user = models.User(
        name=payload.name,
        email=payload.email,
        role=payload.role,
        department=payload.department,
        passwordHash=password_hash,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# ----------------------
# UPDATE STAFF
# ----------------------
@router.put("/{userId}", response_model=schemas.UserOut)
def update_staff(
    userId: int,
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = db.get(models.User, userId)
    if not user:
        raise HTTPException(404, "User not found")

    # Admin cannot edit users from other departments
    if current_user.role == "Admin" and user.department != current_user.department:
        raise HTTPException(403, "Forbidden")

    user.name = payload.name
    user.email = payload.email

    # Only SuperAdmin can change department
    if current_user.role == "SuperAdmin":
        user.department = payload.department

    user.role = payload.role

    # Update password if provided
    if payload.password:
        user.passwordHash = pwd.hash(payload.password)

    db.commit()
    db.refresh(user)
    return user


# ----------------------
# DELETE STAFF
# ----------------------
@router.delete("/{userId}")
def delete_staff(
    userId: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = db.get(models.User, userId)
    if not user:
        raise HTTPException(404, "User not found")

    # Admin cannot delete outside their department
    if current_user.role == "Admin" and user.department != current_user.department:
        raise HTTPException(403, "Forbidden")

    db.delete(user)
    db.commit()
    return {"deleted": True}

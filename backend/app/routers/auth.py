from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt

from ..db import get_db
from .. import models, schemas

router = APIRouter(tags=["Auth"])   # no prefix, correct

# ------------------------------
# CONFIGURATION
# ------------------------------
SECRET_KEY = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_KEY_123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ------------------------------
# TOKEN CREATION
# ------------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ------------------------------
# FIRST SUPERADMIN CREATION (RUN ONCE)
# ------------------------------
@router.post("/init-superadmin")
def init_superadmin(db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.role == "SuperAdmin").first()
    if existing:
        raise HTTPException(400, "SuperAdmin already exists")

    superadmin = models.User(
        name="Super Admin",
        email="superadmin@system.com",
        passwordHash=pwd.hash("SuperAdmin123"),
        role="SuperAdmin",
        department="IT",
    )

    db.add(superadmin)
    db.commit()
    db.refresh(superadmin)

    return {"message": "SuperAdmin created successfully"}


# ------------------------------
# LOGIN
# ------------------------------
@router.post("/login")
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()

    if not user:
        raise HTTPException(404, "User not found")

    if not pwd.verify(payload.password, user.passwordHash):
        raise HTTPException(401, "Invalid password")

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role,
            "userId": user.userId,
            "department": user.department,
        }
    )

    return {
        "token": access_token,
        "user": {
            "userId": user.userId,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        },
    }

# ------------------------------
# GET CURRENT USER
# ------------------------------
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception

    return user

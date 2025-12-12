from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt

from ..db import get_db
from .. import models, schemas

router = APIRouter(tags=["Auth"])

# -----------------------------
# JWT & PASSWORD CONFIGURATION
# -----------------------------
SECRET_KEY = "SUPER_LONG_RANDOM_KEY_HERE_CHANGE_ME_123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# -----------------------------
# TOKEN CREATION
# -----------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -----------------------------
# TEMPORARY SUPERADMIN CREATION
# -----------------------------
@router.post("/init-superadmin")
def init_superadmin(db: Session = Depends(get_db)):
    """
    Creates the FIRST SuperAdmin.
    Safe: Will run only once. Remove after deployment.
    """

    existing = db.query(models.User).filter(models.User.role == "SuperAdmin").first()
    if existing:
        return {"message": "SuperAdmin already exists"}

    super_admin = models.User(
        name="Super Admin",
        email="superadmin@nssystem.com",
        passwordHash=pwd.hash("SuperAdmin123"),
        role="SuperAdmin",
        department="System",
    )

    db.add(super_admin)
    db.commit()

    return {"message": "SuperAdmin created successfully"}


# -----------------------------
# LOGIN ENDPOINT
# -----------------------------
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


# -----------------------------
# AUTH MIDDLEWARE
# -----------------------------
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

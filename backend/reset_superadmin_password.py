# reset_superadmin_password.py

from app.db import SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    db = SessionLocal()

    email = "superadmin@system.com"
    new_plain_password = "SuperAdmin123"   # <-- choose your password here

    user = db.query(User).filter(User.email == email).first()
    if not user:
        print("SuperAdmin not found")
        return

    user.passwordHash = pwd.hash(new_plain_password)
    db.commit()
    print("✅ SuperAdmin password updated successfully!")
    print(f"Email: {email}")
    print(f"New password: {new_plain_password}")

if __name__ == "__main__":
    main()

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

passwords = {
    "Admin@123": pwd_context.hash("Admin@123"),
    "User@123": pwd_context.hash("User@123"),
}

for plain, hashed in passwords.items():
    print(f"{plain} → {hashed}")

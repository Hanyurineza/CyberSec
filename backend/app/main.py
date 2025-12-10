from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import Base, engine
import app.models   # ensure models load

print(">>> MAIN Base =", Base)


# Debug optional prints
print("✔ Tables created successfully")

# Create tables
Base.metadata.create_all(bind=engine)

# Init FastAPI
app = FastAPI(title="Cybersecurity Awareness API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all origins (or only React: http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
from app.routers import (
    auth,
    staff,
    topics,
    quizzes,
    attempts,
    reports,
    training,
    awareness,
    home,
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(staff.router, prefix="/api/staff", tags=["Staff"])
app.include_router(topics.router, prefix="/api/topics", tags=["Topics"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["Quizzes"])
app.include_router(attempts.router, prefix="/api/attempts", tags=["Attempts"])
app.include_router(training.router, prefix="/api/training", tags=["Training"])
app.include_router(awareness.router, prefix="/api/awareness", tags=["Awareness"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(home.router, prefix="/api/home", tags=["Home"])

# Health
@app.get("/api/ping")
def ping():
    return {"message": "pong"}

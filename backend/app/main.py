from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import Base, engine
import app.models  # ensure models load

# Create tables (OK for now in development)
Base.metadata.create_all(bind=engine)

# Init FastAPI
app = FastAPI(
    title="Cybersecurity Awareness API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ============================================================
# CORS
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://192.168.0.100:3000",
        "http://192.168.0.100:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# ROOT (IMPORTANT FOR RAILWAY)
# ============================================================
@app.get("/")
def root():
    return {
        "status": "running",
        "service": "Cybersecurity Awareness API"
    }

# ============================================================
# ROUTERS
# ============================================================
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
    policies,
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
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])

# ============================================================
# HEALTH CHECK
# ============================================================
@app.get("/api/ping")
def ping():
    return {"message": "pong"}

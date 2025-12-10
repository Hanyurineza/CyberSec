from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from app import models, schemas

# Router will mount at /api/attempts from main.py
router = APIRouter()


# ============================================
# CREATE / RECORD QUIZ ATTEMPT
# ============================================
@router.post("", response_model=schemas.AttemptOut)
def record_attempt(payload: schemas.AttemptCreate, db: Session = Depends(get_db)):

    # Validate User
    user = db.get(models.User, payload.userId)
    if not user:
        raise HTTPException(400, "User not found")

    # Validate Quiz
    quiz = db.get(models.Quiz, payload.quizId)
    if not quiz:
        raise HTTPException(400, "Quiz not found")

    # Check correctness
    is_correct = 1 if payload.selectedAnswer.upper() == quiz.correctAnswer.upper() else 0

    # Create attempt
    attempt = models.QuizAttempt(
        userId=user.userId,
        quizId=quiz.quizId,
        selectedAnswer=payload.selectedAnswer.upper(),
        isCorrect=is_correct,
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    # ============================
    # UPDATE or CREATE REPORT
    # ============================
    report = (
        db.query(models.Report)
        .filter(models.Report.userId == user.userId)
        .order_by(models.Report.createdAt.desc())
        .first()
    )

    if not report:
        report = models.Report(
            userId=user.userId,
            totalAttempts=0,
            correctCount=0,
            awarenessScore=0.0
        )
        db.add(report)

    report.totalAttempts += 1
    report.correctCount += is_correct
    report.awarenessScore = round(
        (report.correctCount / max(1, report.totalAttempts)) * 100.0, 1
    )

    db.commit()
    db.refresh(report)

    return attempt

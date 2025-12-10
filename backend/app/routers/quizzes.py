from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from app import models, schemas

router = APIRouter()


# =======================================
# LIST QUIZZES
# =======================================
@router.get("", response_model=list[schemas.QuizOut])
def list_quizzes(
    topicId: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Quiz)

    if topicId:
        query = query.filter(models.Quiz.topicId == topicId)

    return query.order_by(models.Quiz.quizId).all()


# =======================================
# CREATE QUIZ
# =======================================
@router.post("", response_model=schemas.QuizOut)
def create_quiz(
    payload: schemas.QuizCreate,
    db: Session = Depends(get_db)
):

    # Check referenced topic exists
    topic = db.get(models.Topic, payload.topicId)
    if not topic:
        raise HTTPException(status_code=400, detail="Topic not found")

    quiz = models.Quiz(**payload.model_dump())
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return quiz


# =======================================
# UPDATE QUIZ
# =======================================
@router.put("/{quizId}", response_model=schemas.QuizOut)
def update_quiz(
    quizId: int,
    payload: schemas.QuizCreate,
    db: Session = Depends(get_db)
):

    quiz = db.get(models.Quiz, quizId)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Validate Topic
    topic = db.get(models.Topic, payload.topicId)
    if not topic:
        raise HTTPException(status_code=400, detail="Topic not found")

    quiz.question = payload.question
    quiz.optionA = payload.optionA
    quiz.optionB = payload.optionB
    quiz.optionC = payload.optionC
    quiz.optionD = payload.optionD
    quiz.correctAnswer = payload.correctAnswer
    quiz.topicId = payload.topicId

    db.commit()
    db.refresh(quiz)

    return quiz


# =======================================
# DELETE QUIZ
# =======================================
@router.delete("/{quizId}")
def delete_quiz(
    quizId: int,
    db: Session = Depends(get_db)
):

    quiz = db.get(models.Quiz, quizId)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Check if quiz has attempts → prevent delete if used
    attempts_exist = (
        db.query(models.QuizAttempt)
        .filter(models.QuizAttempt.quizId == quizId)
        .first()
    )

    if attempts_exist:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete quiz: attempts exist"
        )

    db.delete(quiz)
    db.commit()

    return {"deleted": True}

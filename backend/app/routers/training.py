from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from app import models, schemas

router = APIRouter()


# ================================
# GET ALL TRAININGS
# ================================
@router.get("", response_model=list[schemas.TrainingOut])
def list_trainings(db: Session = Depends(get_db)):
    return db.query(models.Training).order_by(models.Training.trainingId.desc()).all()


# ================================
# CREATE TRAINING
# ================================
@router.post("", response_model=schemas.TrainingOut)
def create_training(payload: schemas.TrainingBase, db: Session = Depends(get_db)):
    new_training = models.Training(
        title=payload.title,
        description=payload.description
    )
    db.add(new_training)
    db.commit()
    db.refresh(new_training)
    return new_training


# ================================
# DELETE TRAINING
# ================================
@router.delete("/{trainingId}")
def delete_training(trainingId: int, db: Session = Depends(get_db)):
    t = db.get(models.Training, trainingId)
    if not t:
        raise HTTPException(status_code=404, detail="Training not found")

    db.delete(t)
    db.commit()
    return {"deleted": True}

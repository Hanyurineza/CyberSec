from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from app import models

router = APIRouter()


# GET /api/awareness/tips
@router.get("/tips")
def list_tips(db: Session = Depends(get_db)):
    return db.query(models.AwarenessTip).order_by(models.AwarenessTip.tipId.desc()).all()


# POST /api/awareness/tips (NO TITLE REQUIRED)
@router.post("/tips")
def add_tip(payload: dict, db: Session = Depends(get_db)):
    # Title is OPTIONAL now
    title = payload.get("title")
    description = payload.get("description")
    category = payload.get("category")

    tip = models.AwarenessTip(
        title=title,
        description=description,
        category=category
    )

    db.add(tip)
    db.commit()
    db.refresh(tip)
    return tip


# PUT /api/awareness/tips/{tip_id}
@router.put("/tips/{tip_id}")
def update_tip(tip_id: int, payload: dict, db: Session = Depends(get_db)):
    tip = db.get(models.AwarenessTip, tip_id)
    if not tip:
        raise HTTPException(404, "Tip not found")

    # All fields optional
    if "title" in payload:
        tip.title = payload["title"]
    if "description" in payload:
        tip.description = payload["description"]
    if "category" in payload:
        tip.category = payload["category"]

    db.commit()
    db.refresh(tip)
    return tip


# DELETE /api/awareness/tips/{tip_id}
@router.delete("/tips/{tip_id}")
def delete_tip(tip_id: int, db: Session = Depends(get_db)):
    tip = db.get(models.AwarenessTip, tip_id)
    if not tip:
        raise HTTPException(404, "Tip not found")

    db.delete(tip)
    db.commit()
    return {"deleted": True}

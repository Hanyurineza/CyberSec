from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas

router = APIRouter(tags=["Topics"])


# GET /api/topics
@router.get("/", response_model=list[schemas.TopicOut])
def list_topics(db: Session = Depends(get_db)):
    return db.query(models.Topic).order_by(models.Topic.topicId.desc()).all()


# POST /api/topics
@router.post("/", response_model=schemas.TopicOut)
def create_topic(payload: schemas.TopicCreate, db: Session = Depends(get_db)):
    topic = models.Topic(**payload.model_dump())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


# PUT /api/topics/{topicId}
@router.put("/{topicId}", response_model=schemas.TopicOut)
def update_topic(topicId: int, payload: schemas.TopicCreate, db: Session = Depends(get_db)):
    topic = db.get(models.Topic, topicId)
    if not topic:
        raise HTTPException(404, "Topic not found")

    topic.title = payload.title
    topic.description = payload.description
    topic.link = payload.link
    topic.category = payload.category
    topic.file_path = payload.file_path

    db.commit()
    db.refresh(topic)
    return topic


# DELETE /api/topics/{topicId}
@router.delete("/{topicId}")
def delete_topic(topicId: int, db: Session = Depends(get_db)):
    topic = db.get(models.Topic, topicId)
    if not topic:
        raise HTTPException(404, "Topic not found")

    db.delete(topic)
    db.commit()
    return {"deleted": True}


# GET SINGLE TOPIC
@router.get("/{topicId}", response_model=schemas.TopicOut)
def get_topic(topicId: int, db: Session = Depends(get_db)):
    topic = db.get(models.Topic, topicId)
    if not topic:
        raise HTTPException(404, "Topic not found")
    return topic

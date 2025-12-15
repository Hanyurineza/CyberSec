# app/routers/policies.py

import os
import shutil
import uuid
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.routers.auth import get_current_user

# ✅ NO prefix here
router = APIRouter(tags=["Policies"])

UPLOAD_DIR = "app/uploads/policies"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ================= HELPERS =================
def validate_pdf(file: UploadFile):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are allowed")


def generate_filename(original: str) -> str:
    return f"{uuid.uuid4()}_{original}"


# ================= UPLOAD =================
@router.post("/", response_model=schemas.PolicyOut)
def upload_policy(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "SuperAdmin":
        raise HTTPException(403, "Only SuperAdmin can upload policies")

    validate_pdf(file)

    filename = generate_filename(file.filename)
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    policy = models.Policy(
        title=title,
        description=description,
        filePath=path,
        uploadedBy=current_user.email,
    )

    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


# ================= LIST =================
@router.get("/", response_model=list[schemas.PolicyOut])
def list_policies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Policy).order_by(models.Policy.createdAt.desc()).all()


# ================= DOWNLOAD =================
@router.get("/{policyId}/download")
def download_policy(
    policyId: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    policy = db.get(models.Policy, policyId)
    if not policy:
        raise HTTPException(404, "Policy not found")

    return FileResponse(
        policy.filePath,
        filename=os.path.basename(policy.filePath),
        media_type="application/pdf",
    )


# ================= UPDATE =================
@router.put("/{policyId}", response_model=schemas.PolicyOut)
def update_policy(
    policyId: int,
    title: str = Form(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "SuperAdmin":
        raise HTTPException(403, "Only SuperAdmin can update")

    policy = db.get(models.Policy, policyId)
    if not policy:
        raise HTTPException(404, "Policy not found")

    policy.title = title
    policy.description = description

    db.commit()
    db.refresh(policy)
    return policy


# ================= DELETE =================
@router.delete("/{policyId}")
def delete_policy(
    policyId: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "SuperAdmin":
        raise HTTPException(403, "Only SuperAdmin can delete")

    policy = db.get(models.Policy, policyId)
    if not policy:
        raise HTTPException(404, "Policy not found")

    if os.path.exists(policy.filePath):
        os.remove(policy.filePath)

    db.delete(policy)
    db.commit()
    return {"deleted": True}


# ================= PREVIEW =================
@router.get("/{policyId}/preview")
def preview_policy(
    policyId: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    policy = db.get(models.Policy, policyId)
    if not policy:
        raise HTTPException(404, "Policy not found")

    return FileResponse(policy.filePath, media_type="application/pdf")

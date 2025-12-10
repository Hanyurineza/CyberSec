from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..routers.auth import get_current_user

router = APIRouter()


@router.get("", response_model=list[schemas.ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    role = (current_user.role or "").lower()

    # =====================================
    # SUPERADMIN → sees ALL reports
    # =====================================
    if role == "superadmin":
        return (
            db.query(models.Report)
            .order_by(models.Report.createdAt.desc())
            .all()
        )

    # =====================================
    # ADMIN → sees reports of their department
    # =====================================
    if role == "admin":
        return (
            db.query(models.Report)
            .join(models.User, models.Report.userId == models.User.userId)
            .filter(models.User.department == current_user.department)
            .order_by(models.Report.createdAt.desc())
            .all()
        )

    # =====================================
    # STAFF → sees their own reports only
    # =====================================
    if role in ("staff", "user"):
        return (
            db.query(models.Report)
            .filter(models.Report.userId == current_user.userId)
            .order_by(models.Report.createdAt.desc())
            .all()
        )

    raise HTTPException(status_code=403, detail="Invalid role")

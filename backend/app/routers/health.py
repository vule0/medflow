from fastapi import APIRouter, HTTPException, Depends, status
import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_permission, require_role
from app.models import User, UserRole, Permissions
from app.s3helper import s3_client, S3_BUCKET

router = APIRouter(prefix="/health", tags=["health"])

@router.get("")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

@router.get("/ready")
async def check_db(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(select(1))
        return {"status": "ok",
                "db": "ok"}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "unavailable",
                "db": "unavailable"
            }
        )
        
@router.get("/detail")
async def check_db_s3(db: AsyncSession = Depends(get_db),
                      _: User = Depends(require_permission(Permissions.ADMIN_ROLE))):
    try:
        await db.execute(select(1))
        db_status = "ok"
    except Exception:
        db_status = "unavailable"
    try: 
        await asyncio.to_thread(
            s3_client.head_bucket,
            Bucket=S3_BUCKET,
        )
        s3_status = "ok"
    except Exception:
        s3_status = "unavailable"
        
    status = {
        "status": "ok" if db_status == "ok" and s3_status == "ok" else "unavailable",
        "dependencies": {
            "db": db_status,
            "s3": s3_status
        }  
    }
    return status
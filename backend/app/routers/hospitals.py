from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role, require_permission
from app.models import Hospital, User, UserRole, Permissions
from app.schemas.hospital import HospitalCreate, HospitalRead, HospitalUpdate

router = APIRouter(prefix="/hospitals", tags=["hospitals"])

@router.get("", response_model=list[HospitalRead])
async def get_hospitals(db: AsyncSession = Depends(get_db),
                        _: User = Depends(require_permission(Permissions.HOSPITAL_READ))) -> list[Hospital]:
    statement = select(Hospital).order_by(Hospital.id)
    result = await db.execute(statement)
    
    return list(result.scalars().all())

@router.get("/{hospital_id}", response_model=HospitalRead)
async def find_hospital(hospital_id: int,
                        db: AsyncSession = Depends(get_db),
                        _: User = Depends(get_current_user)) -> Hospital:
    result = await db.get(Hospital, hospital_id)
    
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital {hospital_id} could not be found."
        )
    
    return result

@router.post("", response_model=HospitalRead)
async def create_hospital(payload: HospitalCreate, 
                          db: AsyncSession = Depends(get_db),
                          _: User = Depends(require_permission(Permissions.HOSPITAL_WRITE))) -> Hospital:
    
    hospital = Hospital(**payload.model_dump())
    
    db.add(hospital)
    await db.commit()
    await db.refresh(hospital)
    return hospital

@router.delete("/{hospital_id}")
async def delete_hospital(hospital_id: int,
                          db: AsyncSession = Depends(get_db),
                          _: User = Depends(require_permission(Permissions.HOSPITAL_WRITE))):
    hospital = await db.get(Hospital, hospital_id)
    
    if hospital is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital {hospital_id} could not be found."
        )
        
    await db.delete(hospital)
    await db.commit()
    
    
@router.patch("/{hospital_id}", response_model=HospitalRead)
async def update_hospital(hospital_id: int,
                          payload: HospitalUpdate,
                          db: AsyncSession = Depends(get_db),
                          _: User = Depends(require_permission(Permissions.HOSPITAL_WRITE))) -> Hospital:
    
    hospital = await db.get(Hospital, hospital_id)
        
    if hospital is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital {hospital_id} could not be found."
        )
        
    update_data = payload.model_dump(exclude_unset=True)
        
    for field, value in update_data.items():
        setattr(hospital, field, value)
    
    await db.commit()
    await db.refresh(hospital)
    return hospital
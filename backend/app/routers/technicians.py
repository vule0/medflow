from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_role, get_current_user, require_permission
from app.models import Technician, User, UserRole, Permissions
from app.schemas.technician import TechnicianRead, TechnicianUpdate, TechnicianCreate


router = APIRouter(prefix="/technicians", tags=["technicians"])

@router.get("", response_model=list[TechnicianRead])
async def get_technicians(db: AsyncSession = Depends(get_db),
                          _: User = Depends(require_permission(Permissions.TECHNICIAN_READ))) -> list[Technician]:
    statement = select(Technician).order_by(Technician.id)
        
    response = await db.execute(statement)
    
    return list(response.scalars().all())

@router.get("/{technician_id}", response_model=TechnicianRead)
async def find_technician(technician_id: int,
                          db: AsyncSession = Depends(get_db),
                          _: User = Depends(get_current_user)) -> Technician:
    res = await db.get(Technician, technician_id)
    
    if res is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Technician {technician_id} not found"
        )
    
    return res

@router.post("", response_model=TechnicianRead)
async def create_technician(payload: TechnicianCreate,
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(require_permission(Permissions.TECHNICIAN_WRITE))) -> Technician:
    technician = Technician(**payload.model_dump())
    db.add(technician)
    await db.commit()
    await db.refresh(technician)
    return technician

@router.patch("/{technician_id}", response_model=TechnicianRead)
async def update_technician(technician_id: int,
                            payload: TechnicianUpdate,
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(require_permission(Permissions.TECHNICIAN_WRITE))) -> Technician:
    res = await db.get(Technician, technician_id)
            
    if res is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Technician {technician_id} not found"
        )
        
    update_data = payload.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(res, field, value)
    
    await db.commit()
    await db.refresh(res)
    return res


@router.delete("/{technician_id}")
async def delete_technician(technician_id:int,
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(require_permission(Permissions.TECHNICIAN_WRITE))):
    res = await db.get(Technician, technician_id)
        
    if res is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Technician {technician_id} not found"
        )
    
    await db.delete(res)
    await db.commit()
    
    
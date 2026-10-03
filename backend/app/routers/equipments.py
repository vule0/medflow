from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import Equipment, User, UserRole
from app.schemas.equipment import EquipmentCreate, EquipmentRead, EquipmentUpdate

router = APIRouter(prefix="/equipments", tags=["equipments"])

@router.get("", response_model=list[EquipmentRead])
async def get_equipment(db: AsyncSession = Depends(get_db),
                        _: User = Depends(get_current_user)) -> list[Equipment]:
    statement = select(Equipment).order_by(Equipment.id)
    results = await db.execute(statement)
    
    return list(results.scalars().all())

@router.get("/{equipment_id}", response_model=EquipmentRead)
async def find_equipment(equipment_id: int,
                         db: AsyncSession = Depends(get_db),
                         _: User = Depends(get_current_user)) -> Equipment:
    equipment = await db.get(Equipment, equipment_id)
    if equipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Equipment {equipment_id} not found"
        )
    
    return equipment

@router.post("", response_model=EquipmentRead)
async def create_equipment(payload: EquipmentCreate,
                           db: AsyncSession = Depends(get_db),
                           _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> Equipment:
    
    equipment = Equipment(**payload.model_dump())
    
    db.add(equipment)
    await db.commit()
    await db.refresh(equipment)
    return equipment

@router.delete("/{equipment_id}")
async def delete_equipment(equipment_id: int,
                           db: AsyncSession = Depends(get_db),
                           _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))):
    equipment = await db.get(Equipment, equipment_id)
    if equipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Equipment {equipment_id} not found"
        )
    await db.delete(equipment)
    await db.commit()

@router.patch("/{equipment_id}", response_model=EquipmentRead)
async def update_equipment(equipment_id: int,
                           payload: EquipmentUpdate,
                           db: AsyncSession = Depends(get_db),
                           _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))):
    equipment = await db.get(Equipment, equipment_id)
    if equipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Equipment {equipment_id} not found"
        )
    update_data = payload.model_dump(exclude_unset=True)
            
    for field, value in update_data.items():
        setattr(equipment, field, value)
    
    await db.commit()
    await db.refresh(equipment)
    return equipment
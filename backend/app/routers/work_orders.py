from fastapi import APIRouter, Depends, HTTPException, status, Query

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.schemas.work_order import WorkOrderCreate, WorkOrderRead, WorkOrderUpdate, DiscrepancyRead
from app.models import WorkOrder, WorkOrderStatus, WorkOrderPriority, Hospital, Technician, Equipment, User, UserRole

router = APIRouter(prefix="/work_orders", tags=["work_orders"])

@router.get("/discrepancies", response_model=list[DiscrepancyRead])
async def get_discrepancies(priority: WorkOrderPriority | None = Query(default=None),
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(get_current_user)):
    statement = (select(WorkOrder.id.label("work_order_id"),
                       WorkOrder.title,
                       Equipment.hospital_id.label("equipment_hospital_id"),
                       Technician.hospital_id.label("technician_hospital_id"))
                 .join(Equipment, WorkOrder.equipment_id == Equipment.id)
                 .join(Technician, WorkOrder.technician_id == Technician.id)
                 .where(Equipment.hospital_id != Technician.hospital_id))
    
    if priority is not None:
        statement = statement.where(WorkOrder.priority == priority)
        
    statement = statement.order_by("work_order_id")
    
    results = await db.execute(statement)
    return list(results.mappings().all())

@router.get("", response_model=list[WorkOrderRead])
async def get_work_orders(db: AsyncSession = Depends(get_db),
                          _: User = Depends(get_current_user)) -> list[WorkOrder]:
    statement = select(WorkOrder).order_by(WorkOrder.id)
    results = await db.execute(statement)
    
    return list(results.scalars().all())

@router.get("/{work_order_id}", response_model=WorkOrderRead)
async def find_word_order(work_order_id: int,
                          db: AsyncSession = Depends(get_db)) -> WorkOrder:
    work_order = await db.get(WorkOrder, work_order_id)
    
    if work_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work Order {work_order_id} not found."
        )
        
    return work_order


@router.post("", response_model=WorkOrderRead)
async def create_work_order(payload: WorkOrderCreate,
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> WorkOrder:
    work_order = WorkOrder(**payload.model_dump())
    
    db.add(work_order)
    await db.commit()
    await db.refresh(work_order)
    return work_order


@router.delete("/{work_order_id}")
async def delete_work_order(work_order_id: int,
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))):
    work_order = await db.get(WorkOrder, work_order_id)
        
    if work_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work Order {work_order_id} not found."
        )
        
    await db.delete(work_order)
    await db.commit()
    
@router.patch("/{work_order_id}", response_model=WorkOrderRead)
async def update_work_order(work_order_id: int,
                            payload: WorkOrderUpdate,
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(require_role(UserRole.CLINICAL_ADMIN, UserRole.FIELD_TECHNICIAN))) -> WorkOrder:
    work_order = await db.get(WorkOrder, work_order_id)
            
    if work_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work Order {work_order_id} not found."
        )
        
    update_data = payload.model_dump(exclude_unset=True)
                
    for field, value in update_data.items():
        setattr(work_order, field, value)
    
    await db.commit()
    await db.refresh(work_order)
    return work_order
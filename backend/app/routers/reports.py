from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models import (
    Equipment,
    EquipmentStatus,
    Hospital,
    WorkOrder,
    WorkOrderStatus,
    Technician
)

from app.schemas.work_order import ReportingLineResult, TechnicianActiveMissions

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/low-charge-equipment")
async def get_low_charge_equipment(
    charge_level: Decimal | None = Query(
        default=20,
        ge=0,
        le=100
    ),
    db: AsyncSession = Depends(get_db),
):
    statement = (
        select(Equipment)
        .where(Equipment.charge_level < charge_level)
    )

    result = await db.execute(statement)

    return list(result.scalars().all())


@router.get("/reliability")
async def get_reliability_metrics(
    db: AsyncSession = Depends(get_db),
):
    statement = (
        select(
            Equipment.model.label("equipment_model"),
            func.sum(
                case(
                    (WorkOrder.status == WorkOrderStatus.COMPLETED, 1),
                    else_=0,
                )
            ).label("completed_work_orders"),
            func.sum(
                case(
                    (
                        WorkOrder.status.in_([
                            WorkOrderStatus.PENDING,
                            WorkOrderStatus.IN_PROGRESS,]), 1),
                    else_=0,
                )
            ).label("incomplete_work_orders"),
            func.sum(
                case(
                    (WorkOrder.status == WorkOrderStatus.FAILED, 1),
                    else_=0,
                )
            ).label("failed_work_orders"),
        )
        .join(
            WorkOrder,
            WorkOrder.equipment_id == Equipment.id,
        )
        .group_by(Equipment.model)
    )

    result = await db.execute(statement)

    return result.mappings().all()


@router.get("/hospital-maintenance-flags")
async def get_hospital_maintenance_flags(
    threshold: Decimal | None = Query(
        default=30,
        ge=0,
        le=100
    ),
    db: AsyncSession = Depends(get_db),
):
    maintenance_count = func.sum(
        case(
            (Equipment.status == EquipmentStatus.MAINTENANCE, 1),
            else_=0,
        )
    )

    total_equipment = func.count(Equipment.id)

    maintenance_percentage = func.round(
        maintenance_count * 100.0 / total_equipment
    )

    statement = (
        select(
            Hospital.id.label("hospital_id"),
            Hospital.name.label("hospital_name"),
            total_equipment.label("total_equipment"),
            maintenance_count.label("maintenance_equipment"),
            maintenance_percentage.label("maintenance_percentage"),
        )
        .join(
            Equipment,
            Equipment.hospital_id == Hospital.id,
        )
        .group_by(
            Hospital.id,
            Hospital.name,
        )
        .having(
            maintenance_percentage > threshold
        )
        .order_by(Hospital.id)
    )

    result = await db.execute(statement)

    return result.mappings().all()


@router.get("/supervisor-lines", response_model=ReportingLineResult)
async def get_supervisor_lines(
    supervisor_id: int = Query(..., description="Regional Supervisor's ID."),
    db: AsyncSession = Depends(get_db)
):  
    statement = (
        select(
            Technician.id.label("technician_id"),
            Technician.name.label("technician_name"),
            func.count(WorkOrder.id).label("active_work_order_count"),
        )
        .join(Hospital, Hospital.id == Technician.hospital_id)
        .join(WorkOrder, WorkOrder.technician_id == Technician.id)
        .where(
            Hospital.supervisor_id == supervisor_id,
            WorkOrder.status.in_([WorkOrderStatus.PENDING, WorkOrderStatus.IN_PROGRESS]),
        )
        .group_by(Technician.id, Technician.name)
        .order_by(Technician.id)
    )
    result = await db.execute(statement)
    technicians = [TechnicianActiveMissions(**row) for row in result.mappings().all()]

    return ReportingLineResult(
        supervisor_id=supervisor_id,
        technician_count=len(technicians),
        technicians=technicians,
    )
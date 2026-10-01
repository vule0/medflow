from fastapi import APIRouter, Depends, HTTPException, status, Query

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.schemas.service_report import ServiceReportCreate, ServiceReportRead, ServiceReportUpdate
from app.models import ServiceReport

router = APIRouter(prefix="/service_reports", tags=["service_reports"])



@router.get("", response_model=list[ServiceReportRead])
async def get_service_reports(db: AsyncSession = Depends(get_db)) -> list[ServiceReport]:

    statement = select(ServiceReport).order_by(ServiceReport.id)
    results = await db.execute(statement)

    return list(results.scalars().all())


@router.get("/{service_report_id}", response_model=ServiceReportRead)
async def find_service_report(service_report_id: int,
                              db: AsyncSession = Depends(get_db)) -> ServiceReport:

    service_report = await db.get(ServiceReport, service_report_id)
    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service report {service_report_id} not found"
        )

    return service_report


@router.post("", response_model=ServiceReportRead)
async def create_service_report(payload: ServiceReportCreate,
                                db: AsyncSession = Depends(get_db)) -> ServiceReport:

    service_report = ServiceReport(**payload.model_dump())

    db.add(service_report)
    await db.commit()
    await db.refresh(service_report)

    return service_report


@router.delete("/{service_report_id}")
async def delete_service_report(service_report_id: int,
                                db: AsyncSession = Depends(get_db)):

    service_report = await db.get(ServiceReport,service_report_id)

    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service report {service_report_id} not found"
        )

    await db.delete(service_report)
    await db.commit()


@router.patch("/{service_report_id}", response_model=ServiceReportRead)
async def update_service_report(service_report_id: int,
                                payload: ServiceReportUpdate,
                                db: AsyncSession = Depends(get_db)):

    service_report = await db.get(ServiceReport,service_report_id)

    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service report {service_report_id} not found"
        )

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(service_report, field, value)

    await db.commit()
    await db.refresh(service_report)

    return service_report
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_role, get_current_user, require_permission
from app.schemas.service_report import ServiceReportCreate, ServiceReportRead, ServiceReportUpdate
from app.models import ServiceReport, UserRole, User, Permissions

from uuid import uuid4

from app.s3helper import upload_report, delete_report, S3_BUCKET, AWS_REGION
router = APIRouter(prefix="/service_reports", tags=["service_reports"])



@router.get("", response_model=list[ServiceReportRead])
async def get_service_reports(db: AsyncSession = Depends(get_db),
                              _: User = Depends(require_permission(Permissions.REPORT_READ))) -> list[ServiceReport]:

    statement = select(ServiceReport).order_by(ServiceReport.id)
    results = await db.execute(statement)

    return list(results.scalars().all())


@router.get("/{service_report_id}", response_model=ServiceReportRead)
async def find_service_report(service_report_id: int,
                              db: AsyncSession = Depends(get_db),
                              _: User = Depends(get_current_user)) -> ServiceReport:

    service_report = await db.get(ServiceReport, service_report_id)
    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service report {service_report_id} not found"
        )

    return service_report


@router.post("", response_model=ServiceReportRead)
async def create_service_report(work_order_id: int = Form(...),
                                notes: str | None = Form(None),
                                file: UploadFile = File(...),
                                # payload: ServiceReportCreate,
                                db: AsyncSession = Depends(get_db),
                                _: User = Depends(require_permission(Permissions.REPORT_WRITE))) -> ServiceReport:
    
    file_key = f"service_reports/{uuid4()}-{file.filename}"
    file_url = await upload_report(file=file, file_key=file_key)
    service_report = ServiceReport(work_order_id=work_order_id,
                                   file_url=file_url,
                                   notes=notes)
    
    db.add(service_report)
    await db.commit()
    await db.refresh(service_report)
    return service_report

    # service_report = ServiceReport(**payload.model_dump())

    # db.add(service_report)
    # await db.commit()
    # await db.refresh(service_report)

    # return service_report


@router.delete("/{service_report_id}")
async def delete_service_report(service_report_id: int,
                                db: AsyncSession = Depends(get_db),
                                _: User = Depends(require_permission(Permissions.REPORT_DELETE))):

    service_report = await db.get(ServiceReport,service_report_id)

    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service report {service_report_id} not found"
        )
        
    file_key = service_report.file_url.split(
                f"{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/"
            )[-1]

    delete_report(file_key)
    
    await db.delete(service_report)
    await db.commit()


# @router.patch("/{service_report_id}", response_model=ServiceReportRead)
# async def update_service_report(service_report_id: int,
#                                 payload: ServiceReportUpdate,
#                                 db: AsyncSession = Depends(get_db),
#                                 _: User = Depends(require_role(UserRole.CLINICAL_ADMIN, UserRole.FIELD_TECHNICIAN))):

#     service_report = await db.get(ServiceReport,service_report_id)

#     if service_report is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Service report {service_report_id} not found"
#         )

#     update_data = payload.model_dump(exclude_unset=True)

#     for field, value in update_data.items():
#         setattr(service_report, field, value)

#     await db.commit()
#     await db.refresh(service_report)

#     return service_report

@router.patch("/{service_report_id}", response_model=ServiceReportRead)
async def update_service_report(service_report_id: int,
                                work_order_id: int | None = Form(None),
                                notes: str | None = Form(None),
                                file: UploadFile | None = File(None),
                                db: AsyncSession = Depends(get_db),
                                _: User = Depends(require_permission(Permissions.REPORT_WRITE))) -> ServiceReport:

    service_report = await db.get(ServiceReport, service_report_id,)

    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service report {service_report_id} not found",
        )

    if work_order_id is not None:
        service_report.work_order_id = work_order_id

    if notes is not None:
        service_report.notes = notes

    if file is not None:
        new_file_key = (f"service_reports/{uuid4()}_{file.filename}")
        new_file_url = await upload_report(file=file, file_key=new_file_key)

        if service_report.file_url:
            old_file_key = service_report.file_url.split(
                f"{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/"
            )[-1]

            delete_report(old_file_key)

        service_report.file_url = new_file_url

    await db.commit()
    await db.refresh(service_report)

    return service_report


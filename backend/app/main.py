from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import hospitals, equipments, work_orders, service_reports, auth, reports, technicians,users
from app.config import settings
app = FastAPI(
    title="Medflow",
    description="...",
    version="0.1.0"
)

FRONTEND_ORIGIN = settings.FRONTEND_ORIGIN

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(hospitals.router)
app.include_router(equipments.router)
app.include_router(work_orders.router)
app.include_router(service_reports.router)
app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(technicians.router)
app.include_router(users.router)
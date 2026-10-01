from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import hospitals, equipments, work_orders, service_reports, auth

app = FastAPI(
    title="Medflow",
    description="...",
    version="0.1.0"
)


app.include_router(hospitals.router)
app.include_router(equipments.router)
app.include_router(work_orders.router)
app.include_router(service_reports.router)
app.include_router(auth.router)
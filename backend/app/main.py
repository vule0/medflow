from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import hospitals

app = FastAPI(
    title="Medflow",
    description="...",
    version="0.1.0"
)


app.include_router(hospitals.router)
import asyncio
from app.database import engine
from app.models import Base

# run for \backend with venv
# python -m scripts.day3_create_tables

async def create_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
if __name__ == "__main__":
    asyncio.run(create_tables())
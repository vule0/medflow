import asyncio

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import User, UserRole
from app.security import hash_password


async def seed_users() -> None:
    async with AsyncSessionLocal() as session:
        users = [User(username="admin", hashed_password=hash_password("AdminPass123!"), role_id=1),
                User(username="technician", hashed_password=hash_password("TechnicianPass123!"), role_id=2),
                User(username="auditor", hashed_password=hash_password('AuditorPass123!'), role_id=3)]
        
        for user in users:
            
            result = await session.execute(select(User).where(User.username == user.username))
            existing_user = result.scalar_one_or_none()
            if existing_user is None:
                session.add(user)
                
        await session.commit()
        

if __name__ == "__main__":
    asyncio.run(seed_users())
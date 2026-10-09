from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models import User, UserRole, Permissions, Role, RolePermissions
from app.security import decode_access_token
from app.permissions import ROLE_PERMISSIONS

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
        
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme),
                           db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    try:
        payload = decode_access_token(token)
        username = payload.get("sub")
        
        if username is None:
            raise credentials_exception
        
    except jwt.InvalidTokenError:
        raise credentials_exception

    result = await db.execute(select(User).options(selectinload(User.role)).where(User.username == username))
    
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return User(id=user.id,
                username=user.username,
                role_id=user.role_id,
                role=user.role.name)

def require_role(*allowed_roles: UserRole):
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {current_user.role} is not permitted to perform this action)"
            )
        return current_user
    return role_checker

def require_permission(permission: Permissions):
    async def checker(current_user: User = Depends(get_current_user),
                      db: AsyncSession = Depends(get_db)) -> User:
        
        result = await db.execute(select(RolePermissions.permission).where(RolePermissions.role_id == current_user.role_id))
        permissions = result.scalars().all()
        # permissions = ROLE_PERMISSIONS.get(current_user.role, set())
        if permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission: {permission.value}",
            )
        return current_user
    return checker
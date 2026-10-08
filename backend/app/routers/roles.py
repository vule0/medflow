from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_permission
from app.models import Role, RolePermissions, Permissions, User
from app.schemas.role import RoleCreate, RoleRead

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("", response_model=list[RoleRead])
async def get_roles(db: AsyncSession = Depends(get_db),
                    current_user: User = Depends(require_permission(Permissions.ROLE_MANAGE))):
    result = await db.execute(select(Role).options(selectinload(Role.permissions)).order_by(Role.id))
    
    roles = result.scalars().all()
    return [RoleRead(
        id=role.id,
        name=role.name,
        permissions= [role_permission.permission.value for role_permission in role.permissions]
    ) for role in roles]
    


@router.post("", response_model=RoleRead)
async def create_role(payload: RoleCreate,
                      db: AsyncSession = Depends(get_db)):
    role = Role(**payload.model_dump())
    
    db.add(role)
    await db.commit()
    await db.refresh(role)
    return role

@router.delete("/{role_id}")
async def delete_role(role_id: int,
                      db: AsyncSession = Depends(get_db)):
    role = await db.get(Role, role_id)
    if role is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role {role_id} not found"
        )
    
    await db.delete(role)
    await db.commit()
    
# @router.get("/{role_id}")
# async def get_role_permissions(role_id: int,
#                                db: AsyncSession = Depends(get_db)):
#     role = await db.get(Role, role_id)
#     if role is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Role {role_id} not found"
#         )
#     result = await db.execute(select(RolePermissions.permission).where(RolePermissions.role_id == role.id))
#     permissions = result.scalars().all()
#     return {"role_id": role_id, "permissions": permissions}
    

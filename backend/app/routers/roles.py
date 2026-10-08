from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_permission
from app.models import Role, RolePermissions, Permissions, User
from app.schemas.role import RoleCreate, RoleRead, RolePermissionsUpdate

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
    
    result = await db.execute(select(Role).where(Role.name == payload.name))

    existing_role = result.scalar_one_or_none()

    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Role already exists",
        )

    # create role
    role = Role(name=payload.name)

    db.add(role)

    await db.flush()
    # add permissions to permissions table
    for permission in payload.permissions:
        try:
            permission_enum = Permissions(permission)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid permission: {permission}",
            )

        role_permission = RolePermissions(
            role_id=role.id,
            permission=permission_enum,
        )

        db.add(role_permission)

    await db.commit()

    result = await db.execute(
        select(Role)
        .options(selectinload(Role.permissions))
        .where(Role.id == role.id)
    )

    role = result.scalar_one()

    return RoleRead(
        id=role.id,
        name=role.name,
        permissions=[
            role_permission.permission.value
            for role_permission in role.permissions
        ],
    )

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
    

@router.patch("/{role_id}", response_model=RoleRead)
async def update_role(role_id: int,
                      payload: RolePermissionsUpdate,
                      db: AsyncSession = Depends(get_db),
                      _: User = Depends(require_permission(Permissions.ROLE_MANAGE))):
    # find existing role
    role = await db.get(Role, role_id)

    if role is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role {role_id} not found",
        )
        
    # get all permission enums
    permission_enums = []
    for permission in payload.permissions:
        try:
            permission_enums.append(Permissions(permission))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid permission: {permission}",
            )
    # delete all existing permissions for role
    await db.execute(delete(RolePermissions).where(RolePermissions.role_id == role_id))

    for permission in permission_enums:
        db.add(RolePermissions(role_id=role_id, permission=permission))

    await db.commit()

    # reload and return new role w/ permissions
    result = await db.execute(select(Role).options(selectinload(Role.permissions)).where(Role.id == role_id))

    role = result.scalar_one()

    return RoleRead(
        id=role.id,
        name=role.name,
        permissions=[
            role_permission.permission.value
            for role_permission in role.permissions
        ],
    )


@router.get("/{role_id}")
async def get_role_permissions(role_id: int,
                               db: AsyncSession = Depends(get_db)):
    role = await db.get(Role, role_id)
    if role is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role {role_id} not found"
        )
    result = await db.execute(select(RolePermissions.permission).where(RolePermissions.role_id == role.id))
    permissions = result.scalars().all()
    return {"role_id": role_id, "permissions": permissions}

@router.get("/permissions/all")
async def get_all_permissions(_: User = Depends(require_permission(Permissions.ROLE_MANAGE))):
    return {"permissions": [permission.value for permission in Permissions]}
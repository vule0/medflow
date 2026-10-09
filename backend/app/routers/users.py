from fastapi import APIRouter, Depends, HTTPException, status, Query

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies import get_db, get_current_user, require_role, require_permission
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.models import UserRole, User, Permissions

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
async def get_users(db: AsyncSession = Depends(get_db),
                    _: User = Depends(require_permission(Permissions.USER_READ))) -> list[User]:
    statement = select(User).options(selectinload(User.role)).order_by(User.id)
    results = await db.execute(statement)
    users = list(results.scalars().all())
    return [UserRead(id=user.id,
                     username=user.username,
                     role_id=user.role_id,
                     role=user.role.name) for user in users]


# @router.post("", response_model=UserRead)
# async def create_user(payload: UserCreate,
#                       db: AsyncSession = Depends(get_db),
#                       _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> User:
#     user = User(**payload.model_dump())
    
#     db.add(user)
#     await db.commit()
#     await db.refresh(user)
#     return user


@router.delete("/{user_id}")
async def delete_user(user_id: int,
                      db:  AsyncSession = Depends(get_db),
                      _: User = Depends(require_permission(Permissions.USER_WRITE))):
    res = await db.get(User, user_id)
            
    if res is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    
    await db.delete(res)
    await db.commit()


@router.patch("/{user_id}", response_model=UserRead)
async def update_user(user_id: int,
                            payload: UserUpdate,
                            db: AsyncSession = Depends(get_db),
                            _: User = Depends(require_permission(Permissions.USER_WRITE))) -> User:
    res = await db.get(User, user_id)
            
    if res is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
        
    update_data = payload.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(res, field, value)
    
    await db.commit()
    statement = (select(User).options(selectinload(User.role)).where(User.id == user_id))

    result = await db.execute(statement)
    res = result.scalar_one()

    return UserRead(id=res.id,
                    username=res.username,
                    role_id=res.role_id,
                    role=res.role.name)
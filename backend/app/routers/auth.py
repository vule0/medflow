from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timezone

from uuid import uuid4

from sqlalchemy import select, func, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_permission
from app.models import User, RefreshToken
from app.schemas.user import Token, UserCreate, UserRead, RefreshRequest, LogoutRequest
from app.security import create_access_token, hash_password, verify_password, create_refresh_token, hash_refresh_token, refresh_token_expiry
from app.models import RolePermissions, Permissions

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(),
                db: AsyncSession = Depends(get_db)) -> Token:
    result = await db.execute(select(User).options(selectinload(User.role)).where(User.username == form_data.username))
    user = result.scalar_one_or_none()
    
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    access_token = create_access_token(data={"sub": user.username, "role": user.role.name, "id": user.id})
    refresh_token = create_refresh_token()
    
    refresh_token_row = RefreshToken(
        user_id=user.id,
        token_hash = hash_refresh_token(refresh_token),
        expiry = refresh_token_expiry(),
        revoked_flag = False,
        chain_id = uuid4()
    )
    
    db.add(refresh_token_row)
    await db.commit()
    
    return Token(access_token=access_token, token_type="bearer", refresh_token=refresh_token)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserCreate,
                        db: AsyncSession = Depends(get_db), 
                        _: User = Depends(require_permission(Permissions.USER_WRITE))) -> User:
    existing = await db.execute(select(User).where(func.lower(User.username) == payload.username.lower()))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username {payload.username} already exists"
        )    
        
    user = User(
        username = payload.username,
        hashed_password = hash_password(payload.password), 
        role_id = payload.role_id
    )
    
    db.add(user)
    await db.commit()
    result = await db.execute(select(User).options(selectinload(User.role)).where(User.id == user.id))

    user = result.scalar_one()

    return UserRead(id=user.id,
                role= user.role.name,
                username=user.username,
                role_id=user.role_id)

@router.post("/refresh", response_model=Token)
async def refresh_access_token(payload: RefreshRequest,
                               db: AsyncSession = Depends(get_db)) -> Token:
    token_hash = hash_refresh_token(payload.refresh_token)
    
    result = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    
    stored_token = result.scalar_one_or_none()
    
    if stored_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token.",
        )
    
    # re-used token
    if stored_token.revoked_flag: 
        statement = update(RefreshToken).where(RefreshToken.chain_id == stored_token.chain_id).values(revoked_flag = True)
        
        await db.execute(statement)
        await db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token reuse detected. Revoking flags."
        )
        
    # expired token
    if stored_token.expiry <= datetime.now(timezone.utc):
        stored_token.revoked_flag = True
        await db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired."
        )
    
    # if refresh token valid, get user
    result = await db.execute(
        select(User).options(selectinload(User.role)).where(User.id == stored_token.user_id)
    )

    user = result.scalar_one_or_none()

    if user is None:
        stored_token.revoked_flag = True
        await db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )
    
    
    stored_token.revoked_flag = True
    
    new_refresh_token = create_refresh_token()
    
    new_refresh_token_row = RefreshToken(
        user_id = user.id,
        token_hash = hash_refresh_token(new_refresh_token),
        expiry=stored_token.expiry,
        chain_id=stored_token.chain_id,
        revoked_flag=False
    )
    
    db.add(new_refresh_token_row)
    
    new_access_token = create_access_token(data={"sub": user.username, "role": user.role.name, "id": user.id})
    
    await db.commit()
    
    return Token(access_token=new_access_token, token_type="bearer", refresh_token=new_refresh_token)

@router.post("/logout")
async def logout(payload: LogoutRequest,
                 db: AsyncSession = Depends(get_db)):
    
    token_hash = hash_refresh_token(payload.refresh_token)
    
    result = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    
    stored_token = result.scalar_one_or_none()
    if stored_token is not None:
        stored_token.revoked_flag = True
        await db.commit()
        
    return {"message": "Logged Out"}


@router.get("/permissions")
async def get_role_permissions(current_user: User = Depends(get_current_user),
                               db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RolePermissions.permission).where(RolePermissions.role_id == current_user.role_id))
    # permissions = ROLE_PERMISSIONS.get(current_user.role, set())
    permissions = result.scalars().all()
    return {"permissions": permissions}


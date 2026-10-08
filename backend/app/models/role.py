from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .enums import Permissions
from .base import Base

class Role(Base):
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(32), unique=True)
    
    permissions: Mapped[list[RolePermissions]] = relationship(back_populates="role", cascade="all, delete-orphan")
    

class RolePermissions(Base):
    __tablename__ = "role_permissions"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False)
    # permission: Mapped[str] = mapped_column(String(64))
    permission: Mapped[Permissions] = mapped_column(SqlEnum(
        Permissions,
        name="permission",
         values_callable = lambda enum_cls: [member.value for member in enum_cls]
    ), nullable=False)
    
    role: Mapped[Role] = relationship(back_populates="permissions")
    

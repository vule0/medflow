from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String, ForeignKey
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .enums import UserRole

if TYPE_CHECKING:
    from .token import RefreshToken
    from .role import Role

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    # role: Mapped[UserRole] = mapped_column(
    #     SqlEnum(
    #             UserRole,
    #             name="user_role",
    #             values_callable = lambda enum_cls: [member.value for member in enum_cls]
    #     )
    # )
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    refresh_tokens: Mapped[list[RefreshToken]] = relationship(back_populates="user", cascade="all, delete-orphan")
    role: Mapped[Role] = relationship()
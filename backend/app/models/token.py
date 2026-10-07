from __future__ import annotations
from typing import TYPE_CHECKING
from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Integer, String, ForeignKey, Text, DateTime, func, Boolean
from sqlalchemy.dialects.postgresql import UUID as SQL_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


if TYPE_CHECKING:
    from .user import User
    
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    token_hash: Mapped[str] = mapped_column(String(64))
    issued: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expiry: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_flag: Mapped[bool] = mapped_column(Boolean)
    chain_id: Mapped[UUID] = mapped_column(SQL_UUID(as_uuid=True), default=uuid4)
    
    user: Mapped[User] = relationship(back_populates="refresh_tokens")
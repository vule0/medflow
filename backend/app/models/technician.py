from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .hospital import Hospital
    from .work_order import WorkOrder

class Technician(Base):
    __tablename__ = "technicians"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    hospital_id: Mapped[int] = mapped_column(Integer, ForeignKey("hospitals.id"))
    
    work_orders: Mapped[list[WorkOrder]] = relationship(back_populates="technician")
    hospital: Mapped[Hospital] = relationship(back_populates="technicians")

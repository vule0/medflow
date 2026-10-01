from pydantic import BaseModel, ConfigDict, Field
from decimal import Decimal
from app.models import EquipmentStatus

class EquipmentBase(BaseModel):
    serial_number: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=100)
    status: EquipmentStatus = EquipmentStatus.AVAILABLE
    charge_level: Decimal = Field(ge=0, le=100)
    hospital_id: int
    
class EquipmentCreate(EquipmentBase):
    pass

class EquipmentRead(EquipmentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
    
class EquipmentUpdate(EquipmentBase):
    serial_number: str | None = Field(default=None, min_length=1, max_length=50)
    model: str | None = Field(default=None, min_length=1, max_length=100)
    status: EquipmentStatus | None = None
    charge_level: Decimal | None = Field(default=None, ge=0, le=100)
    hospital_id: int | None = None
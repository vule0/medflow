from pydantic import BaseModel, ConfigDict, Field
from app.models import WorkOrderPriority, WorkOrderStatus

class WorkOrderBase(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    priority: WorkOrderPriority
    status: WorkOrderStatus
    equipment_id: int
    technician_id: int
    
class WorkOrderCreate(WorkOrderBase):
    pass

class WorkOrderRead(WorkOrderBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
    
class WorkOrderUpdate(WorkOrderBase):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    priority: WorkOrderPriority | None = None
    status: WorkOrderStatus | None = None
    equipment_id: int | None = None
    technician_id: int | None = None
    
class DiscrepancyRead(BaseModel):
    work_order_id: int
    title: str
    equipment_hospital_id: int
    technician_hospital_id: int
    
    model_config = ConfigDict(from_attributes=True)
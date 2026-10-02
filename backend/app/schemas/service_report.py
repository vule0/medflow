from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
class ServiceReportBase(BaseModel):
    work_order_id: int
    file_url: str = Field(min_length=1)
    notes: str
    
class ServiceReportCreate(ServiceReportBase):
    pass

class ServiceReportRead(ServiceReportBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
    
class ServiceReportUpdate(ServiceReportBase):
    work_order_id: int | None = None
    file_url: str | None = Field(default=None, min_length=1)
    notes: str | None = None
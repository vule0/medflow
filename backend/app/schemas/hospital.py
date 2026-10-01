from pydantic import BaseModel, ConfigDict, Field

class HospitalBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    location_region: str = Field(min_length=1, max_length=50)
    capacity: int
    supervisor_id: int
    
class HospitalCreate(HospitalBase):
    pass

class HospitalRead(HospitalBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
    
class HospitalUpdate(HospitalBase):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    location_region: str | None = Field(default=None, min_length=1, max_length=50)
    capacity: int | None = None
    supervisor_id: int | None = None
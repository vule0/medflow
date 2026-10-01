from pydantic import BaseModel, ConfigDict, Field

class TechnicianBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    branch_id: int

class TechnicianCreate(TechnicianBase):
    pass

class TechnicianRead(TechnicianBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
    
class TechnicianUpdate(TechnicianBase):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    
    branch_id: int | None = None
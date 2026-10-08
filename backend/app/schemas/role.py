from pydantic import BaseModel, ConfigDict, Field

class RoleBase(BaseModel):
    name: str = Field(max_length=32)
    
class RoleCreate(RoleBase):
    pass

class RoleRead(RoleBase):
    id: int
    permissions: list[str]
    
    model_config = ConfigDict(from_attributes=True)
    
    
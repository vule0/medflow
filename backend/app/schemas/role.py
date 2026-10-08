from pydantic import BaseModel, ConfigDict, Field

class RoleBase(BaseModel):
    name: str = Field(max_length=32)
    
class RoleCreate(RoleBase):
    name: str
    permissions: list[str]

class RoleRead(RoleBase):
    id: int
    permissions: list[str]
    
    model_config = ConfigDict(from_attributes=True)
    
class RolePermissionsUpdate(BaseModel):
    permissions: list[str]
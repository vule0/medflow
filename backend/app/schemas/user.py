from pydantic import BaseModel, ConfigDict, Field

class RoleRead(BaseModel):
    id: int
    name: str
    
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    # id: int
    username: str = Field(min_length=3, max_length=50)
    role: str
    
class UserCreate(UserBase):
    password: str = Field(min_length=3)
    
class UserRead(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
    
    
class UserUpdate(UserBase):
    username : str | None = Field(default=None, min_length=3, max_length=50)    
    role: RoleRead | None = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str
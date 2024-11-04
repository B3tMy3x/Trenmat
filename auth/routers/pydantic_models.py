from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    password: str
    role: str


class UserResponse(BaseModel):
    id: int
    username: str
    role: str
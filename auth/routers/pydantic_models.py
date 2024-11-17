from pydantic import BaseModel


class UserReg(BaseModel):
    email: str
    password: str
    role: str


class UserLog(BaseModel):
    email: str
    password: str
    role: str


class UserResponse(BaseModel):
    id: int
    email: str

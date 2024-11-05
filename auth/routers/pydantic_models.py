from pydantic import BaseModel


class UserReg(BaseModel):
    username: str
    password: str
    role: str


class UserLog(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    role: str

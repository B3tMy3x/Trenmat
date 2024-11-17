from pydantic import BaseModel
from typing import List


class ClassTittle(BaseModel):
    name: str


class ClassOut(BaseModel):
    id: int
    teacher_id: int
    cl_name: str
    student_ids: List[int] = []

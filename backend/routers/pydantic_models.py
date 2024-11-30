from pydantic import BaseModel
from typing import List
from datetime import datetime


class ClassTittle(BaseModel):
    name: str


class ClassOut(BaseModel):
    id: int
    teacher_id: int
    cl_name: str
    students: List[int]
    assignments: List[int] = []


class Answer(BaseModel):
    answer: str | int


class Assignment(BaseModel):
    class_id: int
    test_name: str
    hand_in_by_date: datetime
    created_date: datetime
    multiple_attempts: bool
    number_of_questions: int
    time_to_answer: int


class Assignments(BaseModel):
    class_id: int



class AssignmentOut(BaseModel):
    test_name: str
    hand_in_by_date: datetime
    created_date: datetime
    multiple_attempts: bool
    number_of_questions: int
    time_to_answer: int
    completed_by: int
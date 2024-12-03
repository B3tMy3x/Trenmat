from sqlalchemy import (
    Column,
    BigInteger,
    String,
    ForeignKey,
    Date,
    Boolean,
    JSON,
    Time,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4

Base = declarative_base()


class Class(Base):
    __tablename__ = "classes"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    teacher_id = Column(BigInteger, nullable=False)
    student_ids = Column(ARRAY(BigInteger), default=[])
    cl_name = Column(String, nullable=False)
    join_code = Column(String, unique=True, default=lambda: str(uuid4())[:8])


class Test(Base):
    __tablename__ = "tests"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    class_id = Column(BigInteger, ForeignKey("classes.id"), nullable=False)
    test_name = Column(String, nullable=False)
    hand_in_by_date = Column(Date, nullable=False)
    created_date = Column(Date, nullable=False)
    multiple_attempts = Column(Boolean, default=False)
    number_of_questions = Column(BigInteger, nullable=False)
    time_to_answer = Column(BigInteger, nullable=False)
    completed_by = Column(BigInteger, default=0)


class Result(Base):
    __tablename__ = "results"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(BigInteger, nullable=False)
    test_id = Column(BigInteger, ForeignKey("tests.id"), nullable=False)
    last_attempt_time = Column(Date, nullable=True)
    outcome = Column(JSON, nullable=True)


class Practice(Base):
    __tablename__ = "practices"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(BigInteger, nullable=False)
    time = Column(Date, nullable=True)
    correct = Column(BigInteger, nullable=False)
    count = Column(BigInteger, nullable=False)

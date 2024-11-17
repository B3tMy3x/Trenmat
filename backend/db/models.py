from sqlalchemy import (
    Column,
    BigInteger,
    String,
    ForeignKey,
    Date,
    Boolean,
    JSON,
    Time,
    ARRAY,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Class(Base):
    __tablename__ = "classes"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    teacher_id = Column(BigInteger, nullable=False)
    student_ids = Column(ARRAY(BigInteger), default=[])
    cl_name = Column(String, nullable=False)


class Test(Base):
    __tablename__ = "tests"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    class_id = Column(BigInteger, ForeignKey("classes.id"), nullable=False)
    test_name = Column(String, nullable=False)
    hand_in_by_date = Column(Date, nullable=False)
    created_date = Column(Date, nullable=False)
    multiple_attempts = Column(Boolean, default=False)
    number_of_questions = Column(BigInteger, nullable=False)
    time_to_answer = Column(Time, nullable=False)


class Result(Base):
    __tablename__ = "results"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(BigInteger, nullable=False)
    test_id = Column(BigInteger, ForeignKey("tests.id"), nullable=False)
    attempts = Column(BigInteger, default=0)
    last_attempt_time = Column(Date, nullable=True)
    outcome = Column(JSON, nullable=True)

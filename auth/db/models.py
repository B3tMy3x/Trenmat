from sqlalchemy import Enum
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
import enum

Base = declarative_base()

class Role(enum.Enum):
    TEACHER = "teacher"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()
    role: Mapped[Role] = mapped_column(Enum(Role))

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict
from jwt_auth import hash_password, verify_password, create_access_token
from db.models import Student, Teacher
from db import get_db
from routers.pydantic_models import UserReg, UserLog, UserResponse
from fastapi import APIRouter


router = APIRouter(prefix="/auth")


@router.get("/ping")
async def read_root():
    return {"status": "auth service is running!"}


@router.post("/register")
async def register(user: UserReg, db: AsyncSession = Depends(get_db)):
    role = user.role
    hashed_password = hash_password(user.password)
    if role == "student":
        db_user = Student(email=user.email, password=hashed_password)
    elif role == "teacher":
        db_user = Teacher(email=user.email, password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return {"auth": "registration is successful"}


@router.post("/login")
async def login(user: UserLog, request: Request, db: AsyncSession = Depends(get_db)):
    role = user.role
    if role == "student":
        result = await db.execute(select(Student).where(Student.email == user.email))
    elif role == "teacher":
        result = await db.execute(select(Teacher).where(Teacher.email == user.email))
    db_user = result.scalars().first()
    if db_user is None or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    user_ip = request.client.host
    access_token = create_access_token(
        data={"sub": db_user.id, "email": db_user.email,"role": role}, ip=user_ip
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users", response_model=Dict[str, List[UserResponse]])
async def get_users(
    limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_db)
):
    teachers_result = await db.execute(select(Teacher).offset(offset).limit(limit))
    students_result = await db.execute(select(Student).offset(offset).limit(limit))

    teachers = teachers_result.scalars().all()
    students = students_result.scalars().all()

    return {"teachers": teachers, "students": students}

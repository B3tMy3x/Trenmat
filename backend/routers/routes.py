from fastapi import APIRouter, Request, Header, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.models import Class
from db import get_db
from pydantic import BaseModel
from jwt_auth import verify_token
from trig_quiz import generate_question
from routers.pydantic_models import ClassTittle, ClassOut
from typing import List, Dict

router = APIRouter(prefix="/api")


@router.get("/ping")
async def read_root():
    return {"status": "backend service is running!"}


@router.get("/get_question")
async def get_question(request: Request, token: str = Header(None)):
    await verify_token(request, token)
    question, correct_answer, options = generate_question()
    return {
        "question": question,
        "correct_answer": correct_answer,
        "options": options,
    }


@router.get("/statistics")
async def get_statisticks(request: Request, token: str = Header(None)):
    user_data = await verify_token(request, token)

    return {"email": user_data["email"], "role": user_data["role"]}


@router.post("/class")
async def post_class(
    request: Request,
    classname: ClassTittle,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)
    if user_data["role"] == "teacher":
        new_class = Class(teacher_id=user_data["id"], cl_name=classname.name)
        db.add(new_class)
        await db.commit()
        await db.refresh(new_class)
        return {"teacher_id": user_data["id"], "cl_name": classname.name}
    return {"msg": f"you are not a teacher {user_data['role']}"}


@router.get("/classes", response_model=Dict[str, List[ClassOut]])
async def get_classes(
    request: Request,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)
    if user_data["role"] == "teacher":
        classes_result = await db.execute(select(Class).where(
            Class.teacher_id == user_data["id"]
        ))

        classes = classes_result.scalars().all()

        return {"classes": classes}
    return {"msg": f"you are not a teacher {user_data['role']}"}

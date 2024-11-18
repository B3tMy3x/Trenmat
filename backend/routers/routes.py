from fastapi import APIRouter, HTTPException, Request, Header, Depends
from sqlalchemy import update
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
        classes_result = await db.execute(
            select(Class).where(Class.teacher_id == user_data["id"])
        )

        classes = classes_result.scalars().all()

        class_out = [
            ClassOut(
                id=cls.id,
                teacher_id=cls.teacher_id,
                cl_name=cls.cl_name,
                students=cls.student_ids if cls.student_ids else [],
                assignments=[],
            )
            for cls in classes
        ]

        return {"classes": class_out}

    return {"msg": f"you are not a teacher {user_data['role']}"}


@router.get("/classes/{class_id}/join-link")
async def get_join_link(
    class_id: int,
    request: Request,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)
    if user_data["role"] == "student":
        raise HTTPException(status_code=403, detail="Access denied")

    class_obj = await db.get(Class, class_id)
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")

    return {"join_link": f"http://localhost:8080/api/join/class/{class_obj.join_code}"}


@router.get("/join/class/{code}")
async def join_class_by_code(
    code: str,
    request: Request,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)

    if user_data["role"] == "teacher":
        raise HTTPException(status_code=403, detail="Only students can join classes")

    result = await db.execute(select(Class).where(Class.join_code == code))
    class_obj = result.scalar_one_or_none()

    if not class_obj:
        raise HTTPException(status_code=404, detail="Invalid class code")

    if user_data["id"] in class_obj.student_ids:
        raise HTTPException(status_code=400, detail="Student already joined")

    updated_student_ids = class_obj.student_ids + [user_data["id"]]

    await db.execute(
        update(Class)
        .where(Class.id == class_obj.id)
        .values(student_ids=updated_student_ids)
    )

    await db.commit()
    await db.refresh(class_obj)
    return {"message": "Successfully joined the class"}

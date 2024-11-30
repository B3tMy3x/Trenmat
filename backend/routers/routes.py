from fastapi import APIRouter, HTTPException, Request, Header, Depends, status
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from db.models import Class, Test
from db import get_db
from pydantic import BaseModel
from jwt_auth import verify_token
from trig_quiz import generate_question
from routers.pydantic_models import (
    ClassTittle,
    ClassOut,
    Answer,
    Assignment,
    AssignmentOut,
)
from typing import List, Dict
import redis
from datetime import datetime, timedelta
import json


r = redis.Redis(host="localhost", port=6379, db=0)
QUESTION_TIME_LIMIT = 10
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

    return {"join_link": class_obj.join_code}


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


@router.get("/question")
async def start_test(request: Request, token: str = Header(None)):
    user_data = await verify_token(request, token)
    user_id = user_data["id"]

    if user_data["role"] == "student":
        question, correct_answer, options = generate_question()

        start_time = datetime.now()
        question_end_time = start_time + timedelta(seconds=QUESTION_TIME_LIMIT)

        test_data = {
            "correct_answer": correct_answer,
            "question_end_time": question_end_time.isoformat(),
        }

        r.set(f"test_data_{user_id}", json.dumps(test_data))

        return {
            "question": question,
            "options": options,
        }

    raise HTTPException(
        status_code=403, detail="Access forbidden. Only students can start a test."
    )


@router.post("/submit_answer")
async def submit_answer(request: Request, answer: Answer, token: str = Header(None)):
    user_data = await verify_token(request, token)
    user_id = user_data["id"]
    test_data_str = r.get(f"test_data_{user_id}")
    answer = answer.answer
    if not test_data_str:
        raise HTTPException(
            status_code=404, detail="Test not started or question not found"
        )
    test_data = json.loads(test_data_str.decode("utf-8"))
    question_end_time = datetime.fromisoformat(test_data["question_end_time"])

    if datetime.now() > question_end_time:
        raise HTTPException(
            status_code=400, detail="Time for this question has expired"
        )

    correct_answer = test_data["correct_answer"]

    if answer == correct_answer:
        return {"is_correct": True}
    else:
        return {"is_correct": False}


@router.post("/assignment")
async def new_Assignment(
    request: Request,
    assigment: Assignment,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)
    current_class = (
        await db.execute(select(Class).where(Class.id == assigment.class_id))
    ).scalar_one_or_none()

    if user_data["role"] == "teacher" and current_class.teacher_id == user_data["id"]:
        new_assigment = Test(
            class_id=assigment.class_id,
            test_name=assigment.test_name,
            hand_in_by_date=assigment.hand_in_by_date,
            created_date=assigment.created_date,
            multiple_attempts=assigment.multiple_attempts,
            number_of_questions=assigment.number_of_questions,
            time_to_answer=assigment.time_to_answer,
        )
        db.add(new_assigment)
        await db.commit()
        await db.refresh(new_assigment)
        return {"msg": f"succes create"}
    return {"msg": f"you are not a teacher {user_data['role']}"}


@router.get("/assignments/{class_id}", response_model=Dict[str, List[AssignmentOut]])
async def new_Assignment(
    class_id: int,
    request: Request,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)
    current_class = (
        await db.execute(select(Class).where(Class.id == class_id))
    ).scalar_one_or_none()
    if user_data["role"] == "teacher" and current_class.teacher_id == user_data["id"]:
        assignments = (
            (await db.execute(select(Test).where(Test.class_id == class_id)))
            .scalars()
            .all()
        )
        return {"assignments": assignments}


@router.get("/classes/{class_id}/students")
async def stundents_in_class():
    pass


from datetime import datetime


from datetime import datetime


@router.get("/homeworks")
async def get_homeworks(
    request: Request, token: str = Header(None), db: AsyncSession = Depends(get_db)
):
    user_data = await verify_token(request, token)
    user_id = user_data["id"]

    if user_data["role"] != "student":
        return {"msg": f"You are not a student, your role is {user_data['role']}"}

    query = select(Class.id).where(Class.student_ids.contains([user_id]))
    result = await db.execute(query)
    class_ids = [row[0] for row in result.fetchall()]

    if not class_ids:
        return {"msg": "No classes found for the student"}

    current_time = datetime.now()
    query = select(Test).where(
        Test.class_id.in_(class_ids), Test.hand_in_by_date > current_time
    )
    result = await db.execute(query)
    homeworks = result.scalars().all()

    return {"homeworks": [hw.__dict__ for hw in homeworks]}

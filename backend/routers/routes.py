from fastapi import APIRouter, HTTPException, Request, Header, Depends, status
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.future import select
from db.models import Class, Test, Result, Practice
from db import get_db
from jwt_auth import verify_token
from trig_quiz import generate_question
from routers.pydantic_models import (
    ClassTittle,
    ClassOut,
    Answer,
    Assignment,
    AssignmentOut,
    SessionHistoryItem,
    StatisticsResponse,
)
from typing import List, Dict
import redis
from datetime import datetime, timedelta, timezone
import json


class RedisClient:
    def __init__(self, host="localhost", port=6379, db=0):
        self.client = redis.Redis(host=host, port=port, db=db)

    def set_data(self, key: str, data: dict, expiration: int = None):
        """Set data in Redis with optional expiration time."""
        value = json.dumps(data)
        if expiration:
            self.client.setex(key, expiration, value)
        else:
            self.client.set(key, value)

    def get_data(self, key: str):
        """Get data from Redis."""
        value = self.client.get(key)
        if value:
            return json.loads(value.decode("utf-8"))
        return None

    def delete_data(self, key: str):
        """Delete data from Redis."""
        self.client.delete(key)

    def key_exists(self, key: str) -> bool:
        """Check if a key exists in Redis."""
        return self.client.exists(key) > 0


redis_client = RedisClient()
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


@router.get("/statistics", response_model=StatisticsResponse)
async def get_statistics(
    request: Request, token: str = Header(None), db: AsyncSession = Depends(get_db)
):
    user_data = await verify_token(request, token)
    user_id = user_data["id"]
    if user_data["role"] != "student":
        raise HTTPException(
            status_code=403, detail="Only students can view statistics."
        )
    practices = await db.execute(
        select(Practice)
        .where(Practice.student_id == user_id)
        .order_by(Practice.time.desc())
    )
    practices = practices.scalars().all()
    total_sessions = len(practices)
    correct_answers = sum(p.correct for p in practices)
    total_questions = sum(p.count for p in practices)
    practice_accuracy = (
        (correct_answers / total_questions * 100) if total_questions > 0 else 0
    )
    session_history = [
        SessionHistoryItem(
            date=p.time,
            correct=p.correct,
            count=p.count,
            accuracy=(p.correct / p.count * 100) if p.count > 0 else 0,
        )
        for p in practices[:3]
    ]
    recent_activity = practices[0].time if practices else None
    today = datetime.now(timezone.utc).date()
    active_days = sorted({p.time for p in practices}, reverse=True)
    streak = 0
    for active_day in active_days:
        if active_day == today:
            streak += 1
            today -= timedelta(days=1)
        else:
            break

    return StatisticsResponse(
        email=user_data["email"],
        role=user_data["role"],
        practice_accuracy=round(practice_accuracy, 2),
        total_sessions=total_sessions,
        correct_answers=correct_answers,
        recent_activity=recent_activity,
        session_history=session_history,
        learning_streak=streak,
    )


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


@router.post("/start_homework/{assignment_id}")
async def start_assignment(
    assignment_id: int,
    request: Request,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)
    if user_data["role"] == "student":
        test_settings = (
            await db.execute(select(Test).where(Test.id == assignment_id))
        ).scalar_one_or_none()

        test_data = {
            "questions_left": test_settings.number_of_questions,
            "question_time_limit": test_settings.time_to_answer,
            "correct_answers": 0,
            "assignment_id": assignment_id,
            "student_id": user_data["id"],
        }

        redis_client.set_data(f"started_test_{user_data['id']}", test_data)
        return {"question_time_limit": test_settings.time_to_answer}
    raise HTTPException(status_code=403, detail="Access forbidden.")


@router.get("/question")
async def get_question(request: Request, token: str = Header(None)):
    user_data = await verify_token(request, token)
    user_id = user_data["id"]
    if user_data["role"] == "student":
        started_test = redis_client.get_data(f"started_test_{user_id}")
        if not started_test:
            raise HTTPException(
                status_code=404, detail="Test not started or question not found"
            )
        question_time_limit = started_test["question_time_limit"]
        question, correct_answer, options = generate_question()

        start_time = datetime.now()
        question_end_time = start_time + timedelta(seconds=question_time_limit)

        test_data = {
            "correct_answer": correct_answer,
            "question_end_time": question_end_time.isoformat(),
        }

        redis_client.set_data(
            f"test_data_{user_id}", test_data, expiration=question_time_limit
        )
        return {"question": question, "options": options}
    raise HTTPException(status_code=403, detail="Access forbidden.")


@router.post("/submit_answer")
async def submit_answer(
    request: Request,
    answer: Answer,
    token: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user_data = await verify_token(request, token)
    user_id = user_data["id"]

    test_data = redis_client.get_data(f"test_data_{user_id}")
    if not test_data:
        raise HTTPException(
            status_code=404, detail="Test not started or question not found"
        )

    question_end_time = datetime.fromisoformat(test_data["question_end_time"])
    if datetime.now() > question_end_time:
        raise HTTPException(
            status_code=400, detail="Time for this question has expired"
        )

    correct_answer = test_data["correct_answer"]
    started_test = redis_client.get_data(f"started_test_{user_id}")
    if not started_test:
        raise HTTPException(
            status_code=404, detail="Test not started or question not found"
        )

    questions_left = started_test["questions_left"] - 1
    correct_answers = started_test["correct_answers"]
    if answer.answer == correct_answer:
        correct_answers += 1

    if questions_left == 0:
        new_result = Result(
            student_id=user_id,
            test_id=started_test["assignment_id"],
            last_attempt_time=datetime.now(),
            outcome={"correct_answers": correct_answers},
        )
        db.add(new_result)
        await db.commit()
        await db.refresh(new_result)
        redis_client.delete_data(f"started_test_{user_id}")
    else:
        updated_test_data = {
            "questions_left": questions_left,
            "correct_answers": correct_answers,
            **started_test,
        }
        redis_client.set_data(f"started_test_{user_id}", updated_test_data)

    return {"is_correct": answer.answer == correct_answer}


@router.post("/start_practice")
async def start_practice(request: Request, token: str = Header(None)):

    user_data = await verify_token(request, token)

    if user_data["role"] != "student":

        raise HTTPException(
            status_code=403,
            detail="Access forbidden. Only students can start practice.",
        )

    practice_data = {
        "correct_answers": 0,
        "total_questions": 0,
        "student_id": user_data["id"],
    }

    redis_client.set_data(f"practice_{user_data['id']}", practice_data)

    return {"message": "Practice started."}


@router.get("/practice_question")
async def get_practice_question(request: Request, token: str = Header(None)):

    user_data = await verify_token(request, token)

    user_id = user_data["id"]

    if user_data["role"] != "student":

        raise HTTPException(
            status_code=403,
            detail="Access forbidden. Only students can participate in practice.",
        )

    practice_data = redis_client.get_data(f"practice_{user_id}")

    if not practice_data:

        raise HTTPException(status_code=404, detail="Practice not started.")

    question, correct_answer, options = generate_question()

    practice_question_data = {
        "correct_answer": correct_answer,
    }

    redis_client.set_data(f"practice_question_{user_id}", practice_question_data)

    return {
        "question": question,
        "options": options,
    }


@router.post("/submit_practice_answer")
async def submit_practice_answer(
    request: Request,
    answer: Answer,
    token: str = Header(None),
):

    user_data = await verify_token(request, token)

    user_id = user_data["id"]

    if user_data["role"] != "student":

        raise HTTPException(
            status_code=403,
            detail="Access forbidden. Only students can participate in practice.",
        )

    practice_data = redis_client.get_data(f"practice_{user_id}")

    if not practice_data:

        raise HTTPException(status_code=404, detail="Practice not started.")

    practice_question_data = redis_client.get_data(f"practice_question_{user_id}")

    if not practice_question_data:

        raise HTTPException(status_code=404, detail="No active question found.")

    correct_answer = practice_question_data["correct_answer"]

    if answer.answer == correct_answer:

        is_correct = True

        practice_data["correct_answers"] += 1

    else:

        is_correct = False

    practice_data["total_questions"] += 1

    redis_client.set_data(f"practice_{user_id}", practice_data)

    return {"is_correct": is_correct}


@router.post("/end_practice")
async def end_practice(
    request: Request, token: str = Header(None), db: AsyncSession = Depends(get_db)
):

    user_data = await verify_token(request, token)

    user_id = user_data["id"]

    if user_data["role"] != "student":

        raise HTTPException(
            status_code=403, detail="Access forbidden. Only students can end practice."
        )

    practice_data = redis_client.get_data(f"practice_{user_id}")

    if not practice_data:

        raise HTTPException(status_code=404, detail="Practice not started.")

    new_practice = Practice(
        student_id=user_id,
        time=datetime.now(),
        correct=practice_data["correct_answers"],
        count=practice_data["total_questions"],
    )

    db.add(new_practice)

    await db.commit()

    await db.refresh(new_practice)

    redis_client.delete_data(f"practice_{user_id}")

    redis_client.delete_data(f"practice_question_{user_id}")

    return {
        "message": "Practice ended.",
        "correct_answers": practice_data["correct_answers"],
        "total_questions": practice_data["total_questions"],
    }


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

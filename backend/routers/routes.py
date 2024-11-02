from fastapi import APIRouter
from trig_quiz import generate_question


router = APIRouter(prefix="/api")


@router.get("/ping")
async def read_root():
    return {"status": "backend service is running!"}


@router.get("/get_question")
async def get_question():
    question, correct_answer, options = generate_question()
    return {
        "question": question,
        "correct_answer": correct_answer,
        "options": options,
    }

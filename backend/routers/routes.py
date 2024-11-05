from fastapi import APIRouter, Request, Header
from trig_quiz import generate_question
from jwt_auth import verify_token

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

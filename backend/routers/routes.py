from fastapi import APIRouter, Depends, HTTPException, status, Request
from trig_quiz import generate_question
from jwt_auth import verify_token  # Здесь указываем ваш модуль для верификации токена

router = APIRouter(prefix="/api")


@router.get("/ping")
async def read_root():
    return {"status": "backend service is running!"}


@router.get("/get_question")
async def get_question(request: Request, token: str = Depends(verify_token)):
    await verify_token(request, token)
    
    question, correct_answer, options = generate_question()
    return {
        "question": question,
        "correct_answer": correct_answer,
        "options": options,
    }
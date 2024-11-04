from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import HTTPException, status, Request
import jwt
from core.config import AuthSettings


SECRET_KEY = AuthSettings.SECRET_KEY
ALGORITHM = AuthSettings.ALGORITHM
ACCESS_TOKEN_EXPIRE = AuthSettings.ACCESS_TOKEN_EXPIRE

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def verify_token(request: Request, token: str):
    try:
        payload = jwt.decode(token, str(SECRET_KEY), algorithms=[ALGORITHM])
        token_ip = payload.get("ip")
        if token_ip != request.client.host:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="IP address mismatch"
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

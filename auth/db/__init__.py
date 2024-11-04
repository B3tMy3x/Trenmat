from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from core.config import BaseSettings

engine = create_async_engine(BaseSettings.LINK)  # echo=True для отладки
SessionLocal = async_sessionmaker(bind=engine)  # expire_on_commit=False для избежания автообновления после коммита


class Base(DeclarativeBase):
    pass

# Создаем таблицы один раз при старте приложения
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Создаем событие для FastAPI для инициализации таблиц


# Зависимость для получения сессии
async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

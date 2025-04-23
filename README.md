
# Инструкция по запуску проекта локально

## 1. Запуск Redis

Перед запуском основных сервисов необходимо поднять Redis:

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

Проверить, что Redis запущен:
```bash
docker ps
```

## 2. Запуск фронтенда

```bash
cd ./frontend
npm install
npm run dev
```

Фронтенд будет доступен по адресу: `http://localhost:3000`

## 3. Запуск бэкенда

```bash
cd ./backend
pip install -r requirements.txt
fastapi run main.py --host 0.0.0.0 --port 8080
```

Бэкенд будет доступен по адресу: `http://localhost:8080`

## 4. Запуск сервиса аутентификации

```bash
cd ./auth
pip install -r requirements.txt
fastapi dev main.py
```

Сервис аутентификации будет доступен по адресу: `http://localhost:8000`
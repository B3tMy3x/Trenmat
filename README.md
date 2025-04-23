Here's the instructions rewritten in Markdown format for a `README.md` file:

```markdown
# Local Development Setup

## Frontend
1. Navigate to the `frontend` directory:
   ```sh
   cd ./frontend
   ```
2. Install dependencies:
   ```sh
   npm i
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Backend
1. Navigate to the `backend` directory:
   ```sh
   cd ./backend
   ```
2. Start the Docker containers:
   ```sh
   docker-compose up
   ```
3. Install Python dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```sh
   fastapi run main.py --host 8080
   ```

## Authentication Service
1. Navigate to the `auth` directory:
   ```sh
   cd ./auth
   ```
2. Start the Docker containers:
   ```sh
   docker-compose up
   ```
3. Run the FastAPI development server:
   ```sh
   fastapi dev main.py
   ```
```
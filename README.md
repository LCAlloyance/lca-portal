# 🌍 LCA Portal – FastAPI + React

This project is an AI-driven Life Cycle Assessment (LCA) Portal built with FastAPI (backend) and React (frontend).

------------------------------------------------------------
📥 Clone the Repository
------------------------------------------------------------
git clone <your-repo-url>
cd lca-portal-main

------------------------------------------------------------
⚡ FastAPI / Backend Setup
------------------------------------------------------------
1. Create a new environment:
   python -m venv myenv

2. Activate the environment:
   Windows: myenv\Scripts\activate
   Mac/Linux: source myenv/bin/activate

3. Install Python frameworks & dependencies:
   pip install fastapi uvicorn pydantic

4. Run FastAPI:
   Option 1 (Uvicorn): uvicorn app:app --reload
   Option 2 (Python):  python app.py

------------------------------------------------------------
🎨 React / Frontend Setup
------------------------------------------------------------
cd my-app
npm install
npm run build

👉 After building, FastAPI will automatically serve the React frontend from my-app/build.

------------------------------------------------------------
🌐 Access Points
------------------------------------------------------------
- API Root → http://127.0.0.1:8000/api
- API Docs (Swagger) → http://127.0.0.1:8000/docs
- Frontend (React) → http://127.0.0.1:8000

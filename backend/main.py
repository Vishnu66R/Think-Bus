# backend/main.py

from dotenv import load_dotenv
load_dotenv()  # ← must be the very first thing, before importing database

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.parent import router as parent_router
from routes.driver import router as driver_router
from routes.admin import router as admin_router
from routes.student import router as student_router

app = FastAPI(title="ThinkBus API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(parent_router)
app.include_router(driver_router)
app.include_router(admin_router)
app.include_router(student_router)

@app.get("/")
def root():
    return {"message": "ThinkBus API is running!"}
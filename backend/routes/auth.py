# backend/routes/auth.py

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models import SignupRequest, LoginRequest, VALID_ROLES
from database import supabase

router = APIRouter()


@router.post("/signup")
def signup(data: SignupRequest):
    if data.role not in VALID_ROLES:
        return JSONResponse(status_code=400, content={
            "success": False,
            "message": f"Invalid role. Choose from: {VALID_ROLES}"
        })

    try:
        existing = supabase.table("users").select("id").eq("username", data.username).execute()
        if existing.data:
            return JSONResponse(status_code=409, content={
                "success": False,
                "message": "Username already taken. Please choose another."
            })

        supabase.table("users").insert({
            "username": data.username,
            "password": data.password,
            "role": data.role
        }).execute()

        return {"success": True, "message": f"Account created! Welcome, {data.role} {data.username}."}

    except Exception as e:
        print(f"[SIGNUP ERROR] {e}")
        return JSONResponse(status_code=500, content={
            "success": False,
            "message": f"Server error: {str(e)}"
        })


@router.post("/login")
def login(data: LoginRequest):
    """
    Authenticate by username + password only.
    Role is NOT required from the client — it is read directly
    from the database and returned in the response.
    """
    try:
        result = supabase.table("users").select("*") \
            .eq("username", data.username) \
            .eq("password", data.password) \
            .execute()

        if not result.data:
            return JSONResponse(status_code=401, content={
                "success": False,
                "message": "Invalid username or password."
            })

        user = result.data[0]
        return {
            "success": True,
            "message": "Login successful!",
            "role": user["role"],
            "username": user["username"]
        }

    except Exception as e:
        print(f"[LOGIN ERROR] {e}")
        return JSONResponse(status_code=500, content={
            "success": False,
            "message": f"Server error: {str(e)}"
        })
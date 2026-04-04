# backend/models.py
# ------------------------------------------------------------
# Pydantic models define the shape of data coming into the API
# FastAPI uses these to validate request bodies automatically
# ------------------------------------------------------------

from pydantic import BaseModel
from typing import Optional

VALID_ROLES = ["Admin", "Student", "Parent", "Driver"]

class SignupRequest(BaseModel):
    username: str
    password: str
    role: str

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str = None  # Optional — determined from DB, not required from client

class StudentSignupRequest(BaseModel):
    full_name: str
    email: str
    mobile_no: Optional[str] = None
    adm_number: str
    semester: Optional[str] = None
    department: Optional[str] = None
    class_section: Optional[str] = None
    boarding_stop_id: int  # selected from route_stops dropdown

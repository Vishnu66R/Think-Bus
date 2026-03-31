from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
from supabase import create_client, Client
from pydantic import BaseModel

router = APIRouter(prefix="/student", tags=["Student"])

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/dashboard")
def get_student_dashboard(username: str):
    try:
        if not username:
            return JSONResponse(status_code=400, content={"success": False, "message": "Username is required"})

        # 1. Get the user record
        user_res = supabase.table("users").select("id").eq("username", username).execute()
        if not user_res.data:
            return JSONResponse(status_code=404, content={"success": False, "message": "User not found"})
        user_id = user_res.data[0]["id"]

        # 2. Get the student record including relational fields
        student_res = supabase.table("students").select(
            "*, routes:default_route_id(name), route_stops:boarding_stop_id(stop_name), buses:current_bus_id(id, registration_number, status, driver_id)"
        ).eq("user_id", user_id).execute()

        if not student_res.data:
            return JSONResponse(status_code=404, content={"success": False, "message": "Student profile not linked to user"})
        
        student = student_res.data[0]

        # 3. Flatten the relational fields for the frontend
        bus_data = student.get("buses") or {}
        route_data = student.get("routes") or {}
        stop_data = student.get("route_stops") or {}

        bus_id = bus_data.get("id")
        driver_name = "Unassigned"
        
        # 4. If assigned to a bus with a driver, get driver name
        if bus_data.get("driver_id"):
            driver_res = supabase.table("drivers").select("full_name").eq("id", bus_data["driver_id"]).execute()
            if driver_res.data:
                driver_name = driver_res.data[0]["full_name"]

        # Format Response Payload
        payload = {
            "success": True,
            "data": {
                "student_name": student["full_name"],
                "bus_number": bus_data.get("registration_number") or "Unassigned",
                "bus_id": bus_id,
                "route_name": route_data.get("name") or "Unassigned",
                "stop_name": stop_data.get("stop_name") or "Unassigned",
                "driver_name": driver_name,
                "status": bus_data.get("status") or "Normal",
                # The following are mocked for now as actual GPS/ETA logic isn't built yet
                "estimated_arrival": "8:15 AM",
                "last_updated": "Just now",
                "alert_message": "Bus Route has been changed due to traffic" if bus_data.get("status") == "Rerouted" else None
            }
        }

        return payload

    except Exception as e:
        print(f"[STUDENT DASHBOARD ERROR] {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

"""Employees API router."""

import json
from pathlib import Path
from typing import List, Optional, Literal
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from backend.app.models.Employee import Employee as Employee
from backend.app.services.supabase_client import get_supabase_client

router = APIRouter(prefix="/employees", tags=["employees"])
supabase = get_supabase_client()

# Data directory
DATA_DIR = Path(__file__).parent.parent.parent.parent.parent / "data"

# Hardcoded mock employee ID
MOCK_EMPLOYEE_NUMBER = 1001


# =====================
# Profile-related models
# =====================

class Organization(BaseModel):
    division: str
    department: str
    team: str


class EmployeeDetails(BaseModel):
    seniority: str
    grade: str
    manager: str
    location: str
    email: Optional[str] = None
    phone: Optional[str] = None


class EmployeeMetrics(BaseModel):
    kudos: int
    data_quality: int
    matching_jobs_count: int


class Education(BaseModel):
    degree: str
    institution: str


class Specialization(BaseModel):
    main: str
    area: str


class IDPProgress(BaseModel):
    overall: int
    gaps_remaining: int
    gaps_total: int
    tasks_completed: int
    tasks_total: int
    estimated_months: int


class IDP(BaseModel):
    progress: IDPProgress


# Extended profile models
class SkillWithLevel(BaseModel):
    name: str
    level: int  # 1-5


class EducationItem(BaseModel):
    id: str
    title: str
    institution: str
    year_start: Optional[str] = None
    year_end: Optional[str] = None
    type: Literal["degree", "certification", "course"]
    description: Optional[str] = None


class ExperienceItem(BaseModel):
    id: str
    title: str
    department: str
    division: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool
    description: str
    achievements: List[str]



class Recommendation(BaseModel):
    id: str
    author_name: str
    author_title: str
    author_avatar: str
    relationship: Literal["manager", "colleague", "mentee"]
    date: str
    rating: int  # 1-5
    content: str
    skills_mentioned: List[str]


class WishlistItem(BaseModel):
    id: str
    type: Literal["text", "role", "keywords"]
    created_at: str
    has_alert: bool
    # For text type
    content: Optional[str] = None
    # For role type
    role_title: Optional[str] = None
    role_department: Optional[str] = None
    role_status: Optional[Literal["open", "closed"]] = None
    # For keywords type
    keywords: Optional[List[str]] = None


class CareerPreferences(BaseModel):
    career_path: Literal["management", "professional"]
    role_types: List[str]
    interests: List[str]
    locations: List[str]


class Language(BaseModel):
    name: str
    level: Literal["native", "fluent", "intermediate", "basic"]


class TargetRole(BaseModel):
    title: str
    division: str
    match_percentage: int
    required_skills_met: int
    required_skills_total: int
    gaps_count: int
    estimated_months: int


class NotificationItem(BaseModel):
    id: str
    type: Literal["job_match", "idp_update", "recommendation", "general"]
    title: str
    message: str
    timestamp: str


class EmployeeProfile(BaseModel):
    """Extended employee profile with all details."""
    id: str
    name: str
    title: str
    avatar: str
    cover_image: str
    is_active: Optional[bool] = True
    organization: Organization
    details: EmployeeDetails
    metrics: EmployeeMetrics
    education: Education
    specialization: Specialization
    soft_skills: List[str]
    hard_skills: List[str]
    idp: Optional[IDP] = None
    # Extended profile fields
    bio: Optional[str] = None
    professional_interests: Optional[List[str]] = None
    soft_skills_detailed: Optional[List[SkillWithLevel]] = None
    hard_skills_detailed: Optional[List[SkillWithLevel]] = None
    education_items: Optional[List[EducationItem]] = None
    experience: Optional[List[ExperienceItem]] = None
    recommendations: Optional[List[Recommendation]] = None
    wishlist: Optional[List[WishlistItem]] = None
    career_preferences: Optional[CareerPreferences] = None
    languages: Optional[List[Language]] = None
    target_role: Optional[TargetRole] = None
    notifications: Optional[List[NotificationItem]] = None


# Position assignment payloads
class EmployeePositionsUpdate(BaseModel):
    liked_positions: Optional[List[dict]] = None
    star_position: Optional[dict] = None


def load_json_file(filename: str) -> dict:
    """Load JSON data from file."""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail=f"Data file not found: {filename}")
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def ensure_mapping(data: dict | None, context: str) -> dict:
    """Ensure data is a mapping; raise a clear 500 otherwise."""
    if isinstance(data, dict):
        return data
    raise HTTPException(status_code=500, detail=f"{context} is unavailable (empty response)")


def enrich_profile_from_supabase(profile: dict, user_id: str) -> dict:
    """Overlay Supabase employees row onto the mock profile."""
    client = supabase
    if not client:
        return profile

    row = None

    # Try user_id match first (string/uuid)
    try:
        resp = client.table("employees").select("*").eq("user_id", user_id).single().execute()
        row = resp.data
    except Exception:
        row = None

    # If not found and user_id looks numeric, try employee_number
    if not row and user_id.isdigit():
        try:
            resp = client.table("employees").select("*").eq("employee_number", int(user_id)).single().execute()
            row = resp.data
        except Exception:
            row = None

    # Fallback: if still not found, take the first employee row
    if not row:
        try:
            resp = client.table("employees").select("*").limit(1).single().execute()
            row = resp.data
        except Exception:
            row = None

    if not row:
        return profile

    # Helper to coalesce None to fallback
    def coalesce(value, fallback=""):
        return fallback if value is None else value

    # Update name/title/avatar
    first = row.get("first_name") or ""
    last = row.get("last_name") or ""
    full_name = f"{first} {last}".strip() or profile.get("name", "")
    profile["name"] = full_name
    profile["title"] = coalesce(row.get("title"), profile.get("title", ""))
    # Map photo_url from DB into avatar used by the frontend
    profile["avatar"] = coalesce(row.get("photo_url"), profile.get("avatar", ""))

    # Organization
    org = profile.get("organization", {}) or {}
    org["division"] = coalesce(row.get("division"), org.get("division", ""))
    org["department"] = coalesce(row.get("department"), org.get("department", ""))
    org["team"] = coalesce(row.get("team"), org.get("team", ""))
    profile["organization"] = org

    # Details
    details = profile.get("details", {}) or {}
    details["seniority"] = coalesce(row.get("seniority"), details.get("seniority", ""))
    details["grade"] = coalesce(row.get("grade"), details.get("grade", ""))
    details["manager"] = coalesce(row.get("manager"), details.get("manager", ""))
    details["location"] = coalesce(row.get("location"), details.get("location", ""))
    details["email"] = coalesce(row.get("email"), details.get("email", None))
    profile["details"] = details

    # Metrics
    metrics = profile.get("metrics", {}) or {}
    if "data_quality" in row and row["data_quality"] is not None:
        metrics["data_quality"] = row["data_quality"]
    profile["metrics"] = metrics

    # Current / past positions
    if "current_position" in row:
        profile["current_position"] = row["current_position"]
    if "past_positions" in row:
        profile["past_positions"] = row["past_positions"]

    return profile


# =====================
# API Endpoints
# =====================

@router.post("/", response_model=Employee, status_code=201)
async def create_employee(employee: Employee):
    """Create a new employee"""
    return employee


@router.post("/batch", response_model=List[Employee], status_code=201)
async def create_employees(employees: List[Employee]):
    """Create multiple employees"""
    return employees


@router.get("/", response_model=List[dict])
async def get_all_employees():
    """Retrieve all employees"""
    client = supabase
    if client:
        try:
            resp = client.table("employees").select("*").execute()
            return resp.data or []
        except Exception as exc:
            print(f"[employees] Supabase fetch all failed: {exc}")
    return []


@router.get("/profile/{employee_number}", response_model=EmployeeProfile)
async def get_employee_profile(employee_number: str):
    """
    Get an employee's full profile including IDP.
    For now, returns mock data for the hardcoded employee ID.
    """
    # For now, we only have mock data for one employee
    if employee_number != MOCK_EMPLOYEE_NUMBER:
        raise HTTPException(status_code=404, detail=f"Employee not found: {employee_number}")

    data = ensure_mapping(load_json_file("mock_user_profile.json"), "Mock profile")
    data = enrich_profile_from_supabase(data, employee_number)
    data = ensure_mapping(data, "Profile data")
    return EmployeeProfile(**data)


@router.get("/me", response_model=dict)
async def get_current_employee(employee_number: int = Header(default=MOCK_EMPLOYEE_NUMBER, alias="X-User-ID")):
    """
    Get the current employee (based on X-User-ID header, or default mock)
    """
    # Use the get_employee function to fetch the employee with mock_employee_number
    return await get_employee(employee_number)

@router.get("/{employee_number}", response_model=dict)
async def get_employee(employee_number: int):
    """Retrieve a specific employee by number"""
    client = supabase
    if not client:
        return {}

    try:
        # Base employee row
        emp_resp = (
            client.table("employees")
            .select("*")
            .eq("employee_number", employee_number)
            .single()
            .execute()
        )
        if not emp_resp.data:
            raise HTTPException(status_code=404, detail=f"Employee not found: {employee_number}")

        # Structured employee row (acts as joined data)
        struct_resp = (
            client.table("structured_employees")
            .select("*")
            .eq("employee_number", employee_number)
            .single()
            .execute()
        )

        employee = emp_resp.data or {}

        # Ensure positions is always returned as a list (JSONB array of position_id/name pairs)
        if "positions" in employee and employee["positions"] is None:
            employee["positions"] = []
        elif "positions" not in employee:
            employee["positions"] = []

        if struct_resp.data:
            struct_data = struct_resp.data
            if isinstance(struct_data, dict):
                struct_data.pop("embedding", None)
            employee["structured_employees"] = struct_data

        # Helper to strip heavy fields
        def clean_position(pos: dict | None) -> dict | None:
            if not isinstance(pos, dict):
                return None
            pos.pop("embedding", None)
            return pos

        def fetch_position(position_id: int | str | None) -> dict | None:
            if position_id is None:
                return None
            try:
                resp = (
                    client.table("positions")
                    .select("*")
                    .eq("position_id", position_id)
                    .single()
                    .execute()
                )
                return clean_position(resp.data)
            except Exception as exc:
                print(f"[employees] positions lookup failed for {position_id}: {exc}")
                return None

        # Resolve current_position name (keep for convenience)
        current_position_id = employee.get("current_position")
        current_position_record = fetch_position(current_position_id)
        if current_position_record and "position_name" in current_position_record:
            employee["current_position_name"] = current_position_record.get("position_name")

        # star_position and liked_positions: return exactly as stored (no further lookups/manipulation)
        # If liked_positions is stored as JSON string, parse to list; otherwise pass through.
        liked_raw = employee.get("liked_positions")
        if isinstance(liked_raw, str):
            try:
                parsed = json.loads(liked_raw)
                if isinstance(parsed, list):
                    liked_raw = parsed
            except Exception:
                liked_raw = liked_raw  # keep original if parse fails
        employee["liked_positions"] = liked_raw

        return employee
    except HTTPException:
        raise
    except Exception as exc:
        print(f"[employees] /{employee_number} Supabase fetch failed: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch employee {employee_number}")

@router.put("/{employee_number}", response_model=Employee)
async def update_employee(employee_number: int, employee: Employee):
    """Update an existing employee"""
    client = supabase
    if client:
        try:
            resp = client.table("employees").update(employee.model_dump()).eq("employee_number", employee_number).execute()
            return resp.data
        except Exception as exc:
            print(f"[employees] /{employee_number} Supabase update failed: {exc}")
    return {}


@router.post("/{employee_number}/positions", response_model=dict)
async def update_employee_positions(employee_number: int, payload: EmployeePositionsUpdate):
    """
    Update the employee's liked_positions with the provided profile objects.
    """
    client = supabase
    if not client:
        raise HTTPException(status_code=500, detail="Supabase client is not initialized.")

    try:
        update_payload: dict = {}
        incoming = payload.model_dump(exclude_unset=True)

        if "liked_positions" in incoming:
            update_payload["liked_positions"] = incoming.get("liked_positions")
        if "star_position" in incoming:
            update_payload["star_position"] = incoming.get("star_position")

        if not update_payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        resp = (
            client.table("employees")
            .update(update_payload)
            .eq("employee_number", employee_number)
            .execute()
        )
        if not resp.data:
            raise HTTPException(status_code=404, detail=f"Employee not found: {employee_number}")
        return resp.data[0]
    except HTTPException:
        raise
    except Exception as exc:
        print(f"[employees] positions update {employee_number} failed: {exc}")
        raise HTTPException(status_code=500, detail="Failed to update employee positions")


@router.delete("/{employee_number}", status_code=204)
async def delete_employee(employee_number: int):
    """Delete a specific employee"""
    client = supabase
    if client:
        try:
            resp = client.table("employees").delete().eq("employee_number", employee_number).execute()
            return resp.data
        except Exception as exc:
            print(f"[employees] /{employee_number} Supabase delete failed: {exc}")
    return {}


# @router.delete("/", status_code=204)
# async def delete_all_employees():
#     """Delete all employees"""
#     client = supabase
#     if client:
#         try:
#             resp = client.table("employees").delete().execute()
#             return resp.data
#         except Exception as exc:
#             print(f"[employees] Supabase delete all failed: {exc}")
#     return {}


# """Employees API router."""

# import json
# from pathlib import Path
# from typing import List, Optional, Literal
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from app.models.Employee import Employee

# router = APIRouter(prefix="/employees", tags=["employees"])

# # Data directory
# DATA_DIR = Path(__file__).parent.parent.parent.parent.parent / "data"

# # Hardcoded mock employee ID
# MOCK_EMPLOYEE_ID = "user-1"


# # =====================
# # Profile-related models
# # =====================

# class Organization(BaseModel):
#     division: str
#     department: str
#     team: str


# class EmployeeDetails(BaseModel):
#     seniority: str
#     grade: str
#     manager: str
#     location: str
#     email: Optional[str] = None
#     phone: Optional[str] = None


# class EmployeeMetrics(BaseModel):
#     kudos: int
#     data_quality: int
#     matching_jobs_count: int


# class Education(BaseModel):
#     degree: str
#     institution: str


# class Specialization(BaseModel):
#     main: str
#     area: str


# class IDPProgress(BaseModel):
#     overall: int
#     gaps_remaining: int
#     gaps_total: int
#     tasks_completed: int
#     tasks_total: int
#     estimated_months: int


# class IDP(BaseModel):
#     progress: IDPProgress


# # Extended profile models
# class SkillWithLevel(BaseModel):
#     name: str
#     level: int  # 1-5


# class EducationItem(BaseModel):
#     id: str
#     title: str
#     institution: str
#     year_start: Optional[str] = None
#     year_end: Optional[str] = None
#     type: Literal["degree", "certification", "course"]
#     description: Optional[str] = None


# class ExperienceItem(BaseModel):
#     id: str
#     title: str
#     department: str
#     division: Optional[str] = None
#     start_date: str
#     end_date: Optional[str] = None
#     is_current: bool
#     description: str
#     achievements: List[str]


# class Recommendation(BaseModel):
#     id: str
#     author_name: str
#     author_title: str
#     author_avatar: str
#     relationship: Literal["manager", "colleague", "mentee"]
#     date: str
#     rating: int  # 1-5
#     content: str
#     skills_mentioned: List[str]


# class WishlistItem(BaseModel):
#     id: str
#     type: Literal["text", "role", "keywords"]
#     created_at: str
#     has_alert: bool
#     # For text type
#     content: Optional[str] = None
#     # For role type
#     role_title: Optional[str] = None
#     role_department: Optional[str] = None
#     role_status: Optional[Literal["open", "closed"]] = None
#     # For keywords type
#     keywords: Optional[List[str]] = None


# class CareerPreferences(BaseModel):
#     career_path: Literal["management", "professional"]
#     role_types: List[str]
#     interests: List[str]
#     locations: List[str]


# class Language(BaseModel):
#     name: str
#     level: Literal["native", "fluent", "intermediate", "basic"]


# class TargetRole(BaseModel):
#     title: str
#     division: str
#     match_percentage: int
#     required_skills_met: int
#     required_skills_total: int
#     gaps_count: int
#     estimated_months: int


# class NotificationItem(BaseModel):
#     id: str
#     type: Literal["job_match", "idp_update", "recommendation", "general"]
#     title: str
#     message: str
#     timestamp: str


# class EmployeeProfile(BaseModel):
#     """Extended employee profile with all details."""
#     id: str
#     name: str
#     title: str
#     avatar: str
#     cover_image: str
#     is_active: Optional[bool] = True
#     organization: Organization
#     details: EmployeeDetails
#     metrics: EmployeeMetrics
#     education: Education
#     specialization: Specialization
#     soft_skills: List[str]
#     hard_skills: List[str]
#     idp: Optional[IDP] = None
#     # Extended profile fields
#     bio: Optional[str] = None
#     professional_interests: Optional[List[str]] = None
#     soft_skills_detailed: Optional[List[SkillWithLevel]] = None
#     hard_skills_detailed: Optional[List[SkillWithLevel]] = None
#     education_items: Optional[List[EducationItem]] = None
#     experience: Optional[List[ExperienceItem]] = None
#     recommendations: Optional[List[Recommendation]] = None
#     wishlist: Optional[List[WishlistItem]] = None
#     career_preferences: Optional[CareerPreferences] = None
#     languages: Optional[List[Language]] = None
#     target_role: Optional[TargetRole] = None
#     notifications: Optional[List[NotificationItem]] = None


# def load_json_file(filename: str) -> dict:
#     """Load JSON data from file."""
#     filepath = DATA_DIR / filename
#     if not filepath.exists():
#         raise HTTPException(status_code=404, detail=f"Data file not found: {filename}")
#     with open(filepath, 'r', encoding='utf-8') as f:
#         return json.load(f)


# # =====================
# # API Endpoints
# # =====================

# @router.post("/", response_model=Employee, status_code=201)
# async def create_employee(employee: Employee):
#     """Create a new employee"""
#     return employee


# @router.post("/batch", response_model=List[Employee], status_code=201)
# async def create_employees(employees: List[Employee]):
#     """Create multiple employees"""
#     return employees


# @router.get("/", response_model=List[Employee])
# async def get_all_employees():
#     """Retrieve all employees"""
#     return []


# @router.get("/profile/{employee_id}", response_model=EmployeeProfile)
# async def get_employee_profile(employee_id: str):
#     """
#     Get a employee's full profile including IDP.
#     For now, returns mock data for the hardcoded employee ID.
#     """
#     # For now, we only have mock data for one employee
#     if employee_id != MOCK_EMPLOYEE_ID:
#         raise HTTPException(status_code=404, detail=f"Employee not found: {employee_id}")
    
#     data = load_json_file("mock_user_profile.json")
#     return EmployeeProfile(**data)


# @router.get("/me", response_model=EmployeeProfile)
# async def get_current_employee():
#     """
#     Get the current user's profile (convenience endpoint).
#     Returns the mock employee profile.
#     """
#     data = load_json_file("mock_user_profile.json")
#     return EmployeeProfile(**data)


# @router.get("/{employee_id}", response_model=Employee)
# async def get_employee(employee_id: str):
#     """Retrieve a specific employee by ID"""
#     raise HTTPException(status_code=404, detail="Employee not found")


# @router.put("/{employee_id}", response_model=Employee)
# async def update_employee(employee_id: str, employee: Employee):
#     """Update an existing employee"""
#     return employee


# @router.delete("/{employee_id}", status_code=204)
# async def delete_employee(employee_id: str):
#     """Delete a specific employee"""
#     pass


# @router.delete("/", status_code=204)
# async def delete_all_employees():
#     """Delete all employees"""
#     pass
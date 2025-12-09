"""Structured Employees API router."""

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Header

from app.services.supabase_client import get_supabase_client

router = APIRouter(prefix="/structured_employees", tags=["structured_employees"])
supabase = get_supabase_client()

# Default mock id fallback (align with other routers pattern)
MOCK_EMPLOYEE_NUMBER = 1001


def _require_client():
    """Ensure Supabase client is available; otherwise raise a clear 500."""
    if not supabase:
        raise HTTPException(
            status_code=500,
            detail="Supabase client is not initialized. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY.",
        )
    return supabase


@router.get("/", response_model=List[dict])
async def get_all_structured_employees():
    """
    Retrieve all structured employees from Supabase.
    """
    client = supabase
    try:
        resp = client.table("structured_employees").select("*").execute()
        return resp.data or []
    except Exception as exc:
        msg = f"[structured_employees] fetch all failed: {exc}"
        print(msg)
        raise HTTPException(status_code=500, detail=msg)


@router.get("/me", response_model=dict)
async def get_current_structured_employee(
    employee_number: int = Header(default=MOCK_EMPLOYEE_NUMBER, alias="X-User-ID"),
):
    """
    Get the current structured employee by header (X-User-ID) or fallback mock id.
    """
    return await get_structured_employee(employee_number)


@router.get("/{employee_number}", response_model=dict)
async def get_structured_employee(employee_number: int):
    """
    Retrieve a specific structured employee by employee_number.
    """
    client = _require_client()
    try:
        resp = (
            client.table("structured_employees")
            .select("*")
            .eq("employee_number", employee_number)
            .single()
            .execute()
        )
        if not resp.data:
            raise HTTPException(status_code=404, detail=f"Employee not found: {employee_number}")
        return resp.data
    except HTTPException:
        raise
    except Exception as exc:
        msg = f"[structured_employees] fetch {employee_number} failed: {exc}"
        print(msg)
        raise HTTPException(status_code=500, detail=msg)


@router.post("/", response_model=dict, status_code=201)
async def create_structured_employee(payload: dict):
    """
    Create a new structured employee (expects a JSON body).
    """
    client = _require_client()
    try:
        resp = client.table("structured_employees").insert(payload).execute()
        return (resp.data or [None])[0] or {}
    except Exception as exc:
        msg = f"[structured_employees] create failed: {exc}"
        print(msg)
        raise HTTPException(status_code=500, detail=msg)


@router.put("/{employee_number}", response_model=dict)
async def update_structured_employee(employee_number: int, payload: dict):
    """
    Update an existing structured employee.
    """
    client = _require_client()
    try:
        resp = (
            client.table("structured_employees")
            .update(payload)
            .eq("employee_number", employee_number)
            .execute()
        )
        return (resp.data or [None])[0] or {}
    except Exception as exc:
        msg = f"[structured_employees] update {employee_number} failed: {exc}"
        print(msg)
        raise HTTPException(status_code=500, detail=msg)


@router.delete("/{employee_number}", response_model=dict)
async def delete_structured_employee(employee_number: int):
    """
    Delete a structured employee by employee_number.
    """
    client = _require_client()
    try:
        resp = (
            client.table("structured_employees")
            .delete()
            .eq("employee_number", employee_number)
            .execute()
        )
        return {"deleted": bool(resp.data)}
    except Exception as exc:
        msg = f"[structured_employees] delete {employee_number} failed: {exc}"
        print(msg)
        raise HTTPException(status_code=500, detail=msg)


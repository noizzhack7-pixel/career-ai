import os
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

import json
from datetime import datetime, timezone
from typing import List, Optional

# -------------------------------------------------
# CONFIG
# -------------------------------------------------
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]  # must be service role
OPENAI_KEY = os.environ["OPENAI_API_KEY"]

EMBED_MODEL = "text-embedding-3-small"  # 1536 dimensions

client = OpenAI(api_key=OPENAI_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# -------------------------------------------------
# Helper: Create embedding for a string (Hebrew-safe)
# -------------------------------------------------
def embed_text(text: str) -> Optional[list[float]]:
    text = (text or "").strip()
    if not text:
        return None

    response = client.embeddings.create(
        model=EMBED_MODEL,
        input=text,
    )
    return response.data[0].embedding

###############

def update_employee_embeddings(employee_number: int | None = 6425):
    """
    Update embeddings for all employees OR only a specific employee.

    Args:
        employee_number (int | None): If provided, only this employee
        will be updated. If None, update all employees.
    """
    # ---------------------------------------------------------
    # 1. Fetch either one employee or all employees
    # ---------------------------------------------------------
    print("Fetching employees...")

    query = supabase.table("structured_employees").select(
        "employee_number, short_summary"
    )

    if employee_number is not None:
        query = query.eq("employee_number", employee_number)

    resp = query.execute()
    rows = resp.data or []

    print(f"Found {len(rows)} employees to update")

    # ---------------------------------------------------------
    # 2. Generate and update embeddings
    # ---------------------------------------------------------
    for row in rows:
        summary = row.get("short_summary") or ""
        vec = embed_text(summary)
        if not vec:
            print(f"Skipping {row['employee_number']} (no embedding)")
            continue

        supabase.table("structured_employees") \
            .update({"embedding": vec}) \
            .eq("employee_number", row["employee_number"]) \
            .execute()

        print(f"Updated embedding for employee {row['employee_number']}")

    print("✅ Done updating embeddings")


# -------------------------------------------------
# MAIN
# -------------------------------------------------
if __name__ == "__main__":
    update_employee_embeddings()
    print("🎉 All embeddings updated successfully")

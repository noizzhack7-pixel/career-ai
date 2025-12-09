# import json
# from datetime import datetime, timezone
# from typing import List, Optional
#
# import pandas as pd
#
# # === LangChain + OpenAI ===
# from langchain_openai import ChatOpenAI
# from pydantic import BaseModel, Field
# from dotenv import load_dotenv
# load_dotenv()
#
#
# # ============================================================
# #                 1. Pydantic Structured Models
# # ============================================================
#
# class SkillEntry(BaseModel):
#     """Represents a single skill with a level between 1–5."""
#     skill: str = Field(
#         ...,
#         description="Exact skill name from skills_rows.csv (name column)."
#     )
#     level: int = Field(
#         ...,
#         ge=1,
#         le=5,
#         description="Skill level from 1 (low) to 5 (high)."
#     )
#
#
# class EmployeeStructured(BaseModel):
#     """Structured representation of an employee row parsed by the LLM."""
#
#     employee_number: int = Field(
#         ...,
#         description="Employee number exactly as in the source CSV."
#     )
#     first_name: str = Field(
#         ...,
#         description="Employee first name in Hebrew."
#     )
#     last_name: str = Field(
#         ...,
#         description="Employee last name in Hebrew."
#     )
#     short_summary: str = Field(
#         ...,
#         description="2–3 sentence Hebrew summary of the employee."
#     )
#     current_position: Optional[int] = Field(
#         default=None,
#         description="ID of the employee's current position (from positions_rows.csv) or null."
#     )
#     past_positions: List[int] = Field(
#         default_factory=list,
#         description="List of IDs of the employee's past positions (from positions_rows.csv)."
#     )
#
#     # NEW: hard & soft skills from skills_rows.csv
#     hard_skills: List[SkillEntry] = Field(
#         default_factory=list,
#         description="List of hard skills with levels, each skill name must exist in skills_rows.csv with type='hard'."
#     )
#     soft_skills: List[SkillEntry] = Field(
#         default_factory=list,
#         description="List of soft skills with levels, each skill name must exist in skills_rows.csv with type='soft'."
#     )
#
#
# # ============================================================
# #                 2. LangChain LLM Setup
# # ============================================================
#
# _llm = ChatOpenAI(
#     model="gpt-4.1-mini",   # or "gpt-4.1" if you want more accuracy
#     temperature=0
# )
#
# _structured_llm = _llm.with_structured_output(EmployeeStructured)
#
#
# def call_llm(prompt: str) -> dict:
#     """
#     Uses LangChain + OpenAI to get strictly structured output
#     validated by the EmployeeStructured Pydantic model.
#
#     Returns a plain dict.
#     """
#     result: EmployeeStructured = _structured_llm.invoke(prompt)
#     return result.dict()
#
#
# # ============================================================
# #                 3. Prompt Builder
# # ============================================================
#
# def build_prompt_for_employee(
#     emp_row: pd.Series,
#     positions_catalog: list[dict],
#     skills_catalog: list[dict],
# ) -> str:
#     """
#     Creates a Hebrew prompt that instructs the LLM to return structured JSON,
#     including hard/soft skills chosen from skills_rows.csv.
#     """
#
#     emp_json = json.dumps(emp_row.to_dict(), ensure_ascii=False, indent=2)
#     positions_json = json.dumps(positions_catalog, ensure_ascii=False, indent=2)
#     skills_json = json.dumps(skills_catalog, ensure_ascii=False, indent=2)
#
#     return f"""
# אתה מקבל:
# 1. נתוני עובד גולמיים מתוך employees_rows.csv.
# 2. רשימת תפקידים אפשריים מתוך positions_rows.csv.
# 3. רשימת כישורים (skills) מתוך skills_rows.csv.
#
# נתוני העובד (employee_row):
# {emp_json}
#
# רשימת התפקידים (positions_catalog):
# {positions_json}
#
# רשימת הכישורים (skills_catalog):
# {skills_json}
#
# המטרה:
# להחזיר אובייקט JSON אחד **בדיוק לפי הסכמה הבאה**:
#
# {{
#   "employee_number": int,          // בדיוק כמו בשורה המקורית
#   "first_name": str,               // שם פרטי בעברית
#   "last_name": str,                // שם משפחה בעברית
#   "short_summary": str,            // 2–3 משפטים בעברית על העובד
#   "current_position": int | null,  // id מתוך positions_catalog או null
#   "past_positions": [int, ...],    // רשימת id מתוך positions_catalog
#
#   "hard_skills": [
#     {{"skill": "שם כישור", "level": 1-5}},
#     ...
#   ],
#   "soft_skills": [
#     {{"skill": "שם כישור", "level": 1-5}},
#     ...
#   ]
# }}
#
# חוקים חשובים:
#
# 1. employee_number
#    - חייב להיות זהה לחלוטין למספר העובד בשורה המקורית.
#
# 2. current_position
#    - בחר id אחד מתוך positions_catalog שמתאים בצורה הטובה ביותר לשדה current_job של העובד.
#    - אם אין התאמה סבירה, החזר null.
#
# 3. past_positions
#    - בחר 0–5 תפקידים מתוך positions_catalog שמתאימים לשדות previous_jobs או לתיאור הקריירה.
#    - אם אין מידע, החזר [].
#
# 4. hard_skills ו-soft_skills:
#    - השתמש רק בכישורים מתוך skills_catalog.
#    - כישורי hard_skills חייבים להיות רק מהשורות שבהן type="hard".
#    - כישורי soft_skills חייבים להיות רק מהשורות שבהן type="soft".
#    - לכל כישור בחר רמת level בין 1 ל-5 (1=חלש, 5=חזק).
#    - בחר 3–10 כישורים מכל סוג (אם יש מספיק כישורים רלוונטיים).
#    - התאמת הכישורים תיעשה לפי:
#      * current_job, previous_jobs
#      * השכלה (first_degree, second_degree)
#      * תחום עבודה, מחלקה וכדומה.
#
# 5. short_summary:
#    - כתוב 2–3 משפטים בעברית המתארים את העובד, הניסיון, ההשכלה והחוזקות המרכזיות שלו.
#    - כתוב בגוף מתאים (זכר/נקבה) לפי gender אם אפשר.
#
# החזר:
# - רק JSON תקין אחד לפי הסכמה למעלה.
# - ללא טקסט נוסף, ללא הסברים וללא Markdown.
# """.strip()
#
#
# # ============================================================
# #                 4. Main Conversion Process
# # ============================================================
#
# def convert_all_employees():
#     # Load CSVs
#     employees = pd.read_csv("employees_rows.csv")
#     positions = pd.read_csv("positions_rows.csv")
#     skills = pd.read_csv("skills_rows.csv")
#
#     # Catalogs for the LLM
#     positions_catalog = positions[["id", "name", "category", "description"]] \
#         .to_dict(orient="records")
#
#     skills_catalog = skills[["id", "type", "name"]] \
#         .to_dict(orient="records")
#
#     output_rows = []
#     now_iso = datetime.now(timezone.utc).isoformat()
#
#     for _, emp_row in employees.iterrows():
#         prompt = build_prompt_for_employee(emp_row, positions_catalog, skills_catalog)
#
#         llm_result = call_llm(prompt)
#
#         # Safety override: ensure employee_number is always correct
#         llm_result["employee_number"] = int(emp_row["employee_number"])
#
#         # Add timestamps
#         llm_result["created_at"] = now_iso
#         llm_result["updated_at"] = now_iso
#
#         # Ensure JSONable lists
#         if llm_result.get("past_positions") is None:
#             llm_result["past_positions"] = []
#         if llm_result.get("hard_skills") is None:
#             llm_result["hard_skills"] = []
#         if llm_result.get("soft_skills") is None:
#             llm_result["soft_skills"] = []
#
#         output_rows.append(llm_result)
#
#     # Convert to dataframe
#     df_out = pd.DataFrame(output_rows, columns=[
#         "employee_number",
#         "first_name",
#         "last_name",
#         "short_summary",
#         "current_position",
#         "past_positions",
#         "hard_skills",
#         "soft_skills",
#         "created_at",
#         "updated_at",
#     ])
#
#     # Convert list fields to JSON strings for CSV
#     df_out["past_positions"] = df_out["past_positions"].apply(
#         lambda lst: json.dumps(lst, ensure_ascii=False)
#     )
#     df_out["hard_skills"] = df_out["hard_skills"].apply(
#         lambda lst: json.dumps(lst, ensure_ascii=False)
#     )
#     df_out["soft_skills"] = df_out["soft_skills"].apply(
#         lambda lst: json.dumps(lst, ensure_ascii=False)
#     )
#
#     df_out.to_csv("structured_employees_rows_OUT.csv", index=False, encoding="utf-8-sig")
#     print("Wrote structured_employees_rows_OUT.csv")
#
#
# import pandas as pd
# import json
#
# # 1) Load the CSV into a DataFrame
# df = pd.read_csv("expanded_employees_langchain_deduped.csv")
#
# # 2) Fix current_position (float -> int, keeping empty as blank)
# #    After this, the column is nullable integer (Int64), not float64.
# df["current_position"] = df["current_position"].astype("Int64")
#
# # 3) Fix past_positions: JSON list like [70000504.0, 70000503.0] -> [70000504, 70000503]
# def fix_past_positions(cell):
#     if pd.isna(cell) or str(cell).strip() == "":
#         return "[]"
#
#     try:
#         lst = json.loads(cell)
#         fixed = [int(x) for x in lst if x is not None]
#         return json.dumps(fixed, ensure_ascii=False)
#     except Exception:
#         # If something unexpected is in the cell, leave it as-is
#         return cell
#
# df["past_positions"] = df["past_positions"].apply(fix_past_positions)
#
# # 4) Save to a new CSV
# df.to_csv("expanded_structured_employees_rows_FIXED.csv", index=False, encoding="utf-8-sig")
# print("Saved expanded_structured_employees_rows_FIXED.csv")

#
# import os
# import json
# from datetime import datetime, timezone
# from typing import List, Dict, Any
#
# import pandas as pd
# from langchain_openai import ChatOpenAI
# from pydantic import BaseModel, Field
# from dotenv import load_dotenv
#
# load_dotenv()
#
# # ---------- FILE PATHS ----------
# EMPLOYEES_CSV = "structured_employees_rows_FIXED.csv"
# POSITIONS_CSV = "positions_rows.csv"
# SKILLS_CSV = "skills_rows.csv"
# OUTPUT_CSV = "expanded_employees_langchain.csv"
#
# # how many new employees to generate in total
# N_TOTAL_NEW_EMPLOYEES = 835
#
# # how many to ask the LLM per call
# BATCH_SIZE = 5
#
# # OpenAI model
# MODEL_NAME = "gpt-4o-mini"   # or "gpt-4.1", "gpt-4o", etc.
#
#
# # ---------- Pydantic models for structured output ----------
#
# class SkillWithLevel(BaseModel):
#     skill: str = Field(description="Skill name, chosen from the allowed pool of skills")
#     level: int = Field(
#         ge=1,
#         le=5,
#         description="Skill level from 1 (low) to 5 (expert)",
#     )
#
#
# class GeneratedEmployee(BaseModel):
#     first_name: str = Field(description="Employee first name (Hebrew preferred)")
#     last_name: str = Field(description="Employee last name (Hebrew preferred)")
#     short_summary: str = Field(
#         description=(
#             "2–4 sentences in Hebrew summarizing the employee's experience, "
#             "current focus and key skills. Use a style similar to the existing CSV: "
#             "1–2 sentences about personality and soft skills, 1–2 sentences about "
#             "hard skills, tech stack, tools, and business context."
#         )
#     )
#     current_position: int = Field(
#         description=(
#             "Position ID, must be one of the ids in positions_catalog. "
#             "The employee story must be consistent with that position's name, "
#             "category and description."
#         )
#     )
#     past_positions: List[int] = Field(
#         description=(
#             "List of 0–3 past position IDs from positions_catalog. "
#             "If there is no history, use an empty list. "
#             "Past roles should be realistic steps that lead to current_position."
#         )
#     )
#     hard_skills: List[SkillWithLevel] = Field(
#         description=(
#             "3–6 hard skills with levels, chosen ONLY from hard_skills_pool "
#             "(coming from skills_rows.csv where type='hard')."
#         )
#     )
#     soft_skills: List[SkillWithLevel] = Field(
#         description=(
#             "3–6 soft skills with levels, chosen ONLY from soft_skills_pool "
#             "(coming from skills_rows.csv where type='soft')."
#         )
#     )
#
#
# class EmployeesBatch(BaseModel):
#     employees: List[GeneratedEmployee]
#
#
# # ---------- Helpers to load catalog data ----------
#
# def load_positions_catalog(positions_csv: str) -> Dict[int, Dict[str, Any]]:
#     """Load positions_rows.csv and build a catalog: id -> {name, category, description}"""
#     pos_df = pd.read_csv(positions_csv)
#
#     # ensure IDs are ints
#     pos_df["id"] = pos_df["id"].astype(int)
#
#     catalog = {}
#     for _, row in pos_df.iterrows():
#         catalog[int(row["id"])] = {
#             "name": row["name"],
#             "category": row.get("category", None),
#             "description": row.get("description", None),
#         }
#     return catalog
#
#
# def load_skill_pools(skills_csv: str):
#     """Load skills_rows.csv and return (hard_skills_pool, soft_skills_pool)."""
#     skills_df = pd.read_csv(skills_csv)
#
#     # normalize type to lower-case just in case
#     skills_df["type"] = skills_df["type"].str.lower()
#
#     hard_skills = (
#         skills_df[skills_df["type"] == "hard"]["name"]
#         .dropna()
#         .astype(str)
#         .unique()
#         .tolist()
#     )
#     soft_skills = (
#         skills_df[skills_df["type"] == "soft"]["name"]
#         .dropna()
#         .astype(str)
#         .unique()
#         .tolist()
#     )
#
#     return hard_skills, soft_skills
#
#
# def generate_employees_batch(
#     positions_catalog: Dict[int, Dict[str, Any]],
#     hard_skills_pool: List[str],
#     soft_skills_pool: List[str],
#     n: int,
# ) -> EmployeesBatch:
#     """Use a simple with_structured_output call to generate n employees."""
#
#     model = ChatOpenAI(
#         model=MODEL_NAME,
#         temperature=0.4,
#     )
#
#     structured_llm = model.with_structured_output(EmployeesBatch)
#
#     positions_json = json.dumps(positions_catalog, ensure_ascii=False, indent=2)
#     hard_skills_json = json.dumps(hard_skills_pool, ensure_ascii=False)
#     soft_skills_json = json.dumps(soft_skills_pool, ensure_ascii=False)
#
#     system_msg = (
#         "You are a data generator for an internal HR career system called GO-PRO.\n"
#         "You generate realistic employee rows for a PostgreSQL/Supabase table.\n\n"
#         "You are given:\n"
#         "1) A catalog of positions with IDs, names, categories, and descriptions.\n"
#         "2) A pool of hard skills (type='hard').\n"
#         "3) A pool of soft skills (type='soft').\n\n"
#         "Your job: create realistic employees whose current_position and story "
#         "are consistent with the position's name, category and description, and "
#         "whose skills are picked ONLY from the given skill pools.\n"
#         "Use Hebrew for names and summaries.\n"
#         "Make employees diverse across departments (קטגוריות), seniority "
#         "(junior / mid / senior / מנהל/ת), and expertise.\n"
#     )
#
#     user_msg = f"""
# Generate {n} NEW employees that can be appended to an existing employees table.
#
# Use this positions catalog (id -> name, category, description):
# {positions_json}
#
# Use ONLY the following hard skills pool (from skills_rows.csv where type='hard'):
# {hard_skills_json}
#
# Use ONLY the following soft skills pool (from skills_rows.csv where type='soft'):
# {soft_skills_json}
#
# Constraints:
# - current_position must be one of the position IDs in the catalog.
# - past_positions must be a realistic career path using those IDs (0–3 items).
# - hard_skills.skill must be a value from the hard skills pool.
# - soft_skills.skill must be a value from the soft skills pool.
# - Levels are integers 1–5.
# - Summaries must sound like real employees in an Israeli organization,
#   combining personality, experience, and tech/business details.
#
# Return your answer EXACTLY in the schema EmployeesBatch -> employees: List[GeneratedEmployee].
# """
#
#     messages = [
#         ("system", system_msg),
#         ("user", user_msg),
#     ]
#
#     batch: EmployeesBatch = structured_llm.invoke(messages)
#     return batch
#
#
# # ---------- Main logic ----------
#
# def main():
#     if not os.getenv("OPENAI_API_KEY"):
#         raise RuntimeError("OPENAI_API_KEY is not set in environment.")

#     # 1. Load existing employees
#     emp_df = pd.read_csv(EMPLOYEES_CSV)
#
#     # employee_number might be float in CSV -> cast to int
#     emp_df["employee_number"] = emp_df["employee_number"].astype(int)
#     max_emp_number = int(emp_df["employee_number"].max())
#     current_emp_number = max_emp_number + 1
#
#     # 2. Load positions & skills catalogs
#     positions_catalog = load_positions_catalog(POSITIONS_CSV)
#     hard_skills_pool, soft_skills_pool = load_skill_pools(SKILLS_CSV)
#
#     # 3. Initialize output CSV: write existing employees once (overwrite if exists)
#     emp_df.to_csv(OUTPUT_CSV, index=False)
#
#     now_iso = datetime.now(timezone.utc).isoformat()
#
#     generated = 0
#     while generated < N_TOTAL_NEW_EMPLOYEES:
#         remaining = N_TOTAL_NEW_EMPLOYEES - generated
#         n_this_batch = min(BATCH_SIZE, remaining)
#
#         batch = generate_employees_batch(
#             positions_catalog=positions_catalog,
#             hard_skills_pool=hard_skills_pool,
#             soft_skills_pool=soft_skills_pool,
#             n=n_this_batch,
#         )
#
#         batch_rows = []
#         for emp in batch.employees:
#             if generated >= N_TOTAL_NEW_EMPLOYEES:
#                 break
#
#             row = {
#                 "employee_number": current_emp_number,
#                 "first_name": emp.first_name,
#                 "last_name": emp.last_name,
#                 "short_summary": emp.short_summary,
#                 "current_position": emp.current_position,
#                 # store as JSON strings, consistent with your existing employees CSV
#                 "past_positions": json.dumps(emp.past_positions, ensure_ascii=False),
#                 "hard_skills": json.dumps(
#                     [s.dict() for s in emp.hard_skills],
#                     ensure_ascii=False,
#                 ),
#                 "soft_skills": json.dumps(
#                     [s.dict() for s in emp.soft_skills],
#                     ensure_ascii=False,
#                 ),
#                 "created_at": now_iso,
#                 "updated_at": now_iso,
#             }
#
#             batch_rows.append(row)
#             current_emp_number += 1
#             generated += 1
#
#         # write this batch immediately (append, no header)
#         if batch_rows:
#             df_batch = pd.DataFrame(batch_rows)
#             df_batch.to_csv(OUTPUT_CSV, mode="a", header=False, index=False)
#
#         print(f"✅ Generated so far: {generated}/{N_TOTAL_NEW_EMPLOYEES}")
#
#     print(f"🎉 Done! Final file: {OUTPUT_CSV}")
#
#
# if __name__ == "__main__":
#     main()

#
# import pandas as pd
#
# INPUT_CSV = "expanded_employees_langchain.csv"
# OUTPUT_CSV = "expanded_employees_langchain_deduped.csv"
#
# def dedupe_employees_by_name(input_csv: str, output_csv: str):
#     # Load file
#     df = pd.read_csv(input_csv)
#
#     # Normalize name fields (in case of leading/trailing spaces)
#     df["first_name"] = df["first_name"].astype(str).str.strip()
#     df["last_name"] = df["last_name"].astype(str).str.strip()
#
#     # Create a combined full-name column
#     df["full_name"] = df["first_name"] + " " + df["last_name"]
#
#     # Drop duplicates — keep first occurrence
#     df_deduped = df.drop_duplicates(subset=["full_name"], keep="first")
#
#     # Remove helper column before saving
#     df_deduped = df_deduped.drop(columns=["full_name"])
#
#     # Save
#     df_deduped.to_csv(output_csv, index=False)
#
#     print(f"✔ Done! Deduped employees saved to: {output_csv}")
#     print(f"Original count: {len(df)}, After dedupe: {len(df_deduped)}")
#
#
# if __name__ == "__main__":
#     dedupe_employees_by_name(INPUT_CSV, OUTPUT_CSV)
#

import os
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()


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


# -------------------------------------------------
# 1) structured_employees
#    Uses: short_summary
# -------------------------------------------------
def update_employee_embeddings():
    print("Fetching employees...")
    resp = supabase.table("structured_employees").select(
        "employee_number, short_summary"
    ).execute()
    rows = resp.data or []
    print(f"Found {len(rows)} employees")

    for row in rows:
        summary = row.get("short_summary") or ""
        vec = embed_text(summary)
        if not vec:
            continue

        supabase.table("structured_employees") \
            .update({"embedding": vec}) \
            .eq("employee_number", row["employee_number"]) \
            .execute()

    print("✅ Updated embeddings for structured_employees")


# -------------------------------------------------
# 2) positions
#    Uses: position_name + description
# -------------------------------------------------
def update_position_embeddings():
    print("Fetching positions...")
    resp = supabase.table("positions").select(
        "position_id, position_name, description"
    ).execute()
    rows = resp.data or []
    print(f"Found {len(rows)} positions")

    for row in rows:
        text = f"{row.get('position_name') or ''} {row.get('description') or ''}"
        vec = embed_text(text)
        if not vec:
            continue

        supabase.table("positions") \
            .update({"embedding": vec}) \
            .eq("position_id", row["position_id"]) \
            .execute()

    print("✅ Updated embeddings for positions")


# -------------------------------------------------
# 3) profiles
#    Uses: profile_name + position_name + description
# -------------------------------------------------
def update_profile_embeddings():
    print("Fetching profiles...")
    resp = supabase.table("profiles").select(
        "profile_id, profile_name, position_name, description"
    ).execute()
    rows = resp.data or []
    print(f"Found {len(rows)} profiles")

    for row in rows:
        text = (
            f"{row.get('profile_name') or ''} "
            f"{row.get('position_name') or ''} "
            f"{row.get('description') or ''}"
        )
        vec = embed_text(text)
        if not vec:
            continue

        supabase.table("profiles") \
            .update({"embedding": vec}) \
            .eq("profile_id", row["profile_id"]) \
            .execute()

    print("✅ Updated embeddings for profiles")


# -------------------------------------------------
# MAIN
# -------------------------------------------------
if __name__ == "__main__":
    # update_employee_embeddings()
    # update_position_embeddings()
    update_profile_embeddings()
    print("🎉 All embeddings updated successfully")

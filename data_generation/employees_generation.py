import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any

import pandas as pd
from marvin import ai_fn


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data_generation"

EMPLOYEES_SRC = DATA_DIR / "employees_rows.csv"
POSITIONS_SRC = DATA_DIR / "positions_rows.csv"
OUTPUT_CSV = DATA_DIR / "structured_employees_rows.csv"


@ai_fn
def hebrew_employee_summary(profile: Dict[str, Any]) -> str:
    """
    צור תקציר קצר בעברית (2–4 משפטים) עבור עובד בהתבסס על השדות: שם, תפקיד נוכחי,
    מחלקה, שנות ותק בתפקיד ובחברה, השכלה, שפות וקורסים. יש לנסח בעברית טבעית
    ובטון מקצועי, עם דגשים על טכנולוגיות/מיומנויות רלוונטיות.
    החזר טקסט בלבד ללא תווים מיוחדים מעבר לשורות חדשות לפי הצורך.
    """


def now_utc_str() -> str:
    dt = datetime.now(timezone.utc)
    # Format similar to: 2025-12-08 16:02:38.7282+00
    return f"{dt.strftime('%Y-%m-%d %H:%M:%S')}.{int(dt.microsecond/100):04d}+00"


def load_positions() -> pd.DataFrame:
    return pd.read_csv(POSITIONS_SRC, encoding="utf-8")


def load_employees() -> pd.DataFrame:
    return pd.read_csv(EMPLOYEES_SRC, encoding="utf-8")


def build_position_lookup(df_positions: pd.DataFrame) -> Dict[str, int]:
    # Map exact Hebrew position name to ID
    by_name = {str(row["name"]).strip(): int(row["id"]) for _, row in df_positions.iterrows()}
    return by_name


def map_job_to_position_id(job_name: str, by_name: Dict[str, int]) -> int:
    job_name = (job_name or "").strip()
    # 1) Exact match
    if job_name in by_name:
        return by_name[job_name]

    # 2) Simple contains/substring heuristics
    lower_map = {k.lower(): v for k, v in by_name.items()}
    j = job_name.lower()
    for k, v in lower_map.items():
        if j in k or k in j:
            return v

    # 3) Manual mapping for common roles from the provided dataset
    manual_map = {
        "רכזת גיוס": "רכזת גיוס טכנולוגי",
        "מנהל פרויקטים": "PMO טכנולוגי",
        "אנליסטית מודיעין": "Data Analyst",
        "מתאמת לוגיסטיקה": "מנהל מחסן ממוחשב",
        "מנהל חשבונות": "חשב שכר בכיר",
        "אנליסטית סייבר": "מיישם סייבר",
        "מפתח Backend": "מפתח Full Stack",
        "אחresponsible": "מנהלת משרד ועוזרת אישית",
        "אחראית פרט ורווחה": "מנהלת משרד ועוזרת אישית",
        "רכז אבטחת מידע": "מיישם סייבר",
        "מנהל תוכן": "מעצב UX/UI",
        "איסוף מודיעין": "Data Analyst",
        "רכזת מלאי": "מנהל מחסן ממוחשב",
        "מנהל רכש": "קניין רכש טכני",
        "מנהל מש\"א": "רכזת גיוס טכנולוגי",
        "חוקר אירועי סייבר": "מיישם סייבר",
        "מנהלת רווחה": "מנהלת משרד ועוזרת אישית",
        "נציג שירות": "מנהל צוות שירות",
    }
    if job_name in manual_map and manual_map[job_name] in by_name:
        return by_name[manual_map[job_name]]

    # 4) Fallback: pick a stable first position id (still a real position)
    return sorted(by_name.values())[0]


def choose_past_positions(current_id: int, all_ids: List[int]) -> List[int]:
    # Keep it simple and deterministic: pick up to two previous smaller IDs different than current
    candidates = [pid for pid in sorted(all_ids) if pid != current_id and pid < current_id]
    return candidates[:2]


async def generate_structured_employees(n: int = 20) -> pd.DataFrame:
    df_emp = load_employees().head(n)
    df_pos = load_positions()
    pos_by_name = build_position_lookup(df_pos)
    all_pos_ids = [int(x) for x in df_pos["id"].tolist()]

    rows = []
    created = now_utc_str()
    for _, r in df_emp.iterrows():
        name: str = str(r.get("name", "")).strip()
        parts = name.split()
        first_name = parts[0] if parts else ""
        last_name = " ".join(parts[1:]) if len(parts) > 1 else ""

        current_job = str(r.get("current_job", "")).strip()
        current_position_id = map_job_to_position_id(current_job, pos_by_name)
        past_positions_ids = choose_past_positions(current_position_id, all_pos_ids)

        profile_dict = {
            "name": name,
            "department": r.get("department"),
            "current_job": current_job,
            "office_seniority": r.get("office_seniority"),
            "job_seniority": r.get("job_seniority"),
            "first_degree": r.get("first_degree"),
            "second_degree": r.get("second_degree"),
            "languages": r.get("languages"),
            "certification_courses": r.get("certification_courses"),
            "external_courses": r.get("external_courses"),
            "previous_jobs": r.get("previous_jobs"),
        }

        try:
            summary = await hebrew_employee_summary(profile_dict)  # type: ignore
            summary = str(summary).strip()
        except Exception:
            # Fallback simple summary if LLM call fails
            summary = (
                f"{name} עובד/ת במחלקת {profile_dict.get('department', '')} בתפקיד {current_job}. "
                f"בעל/ת ניסיון של {profile_dict.get('job_seniority', '')} שנים בתפקיד ו-"
                f"{profile_dict.get('office_seniority', '')} שנים בארגון."
            ).strip()

        rows.append({
            "employee_number": int(r.get("employee_number")),
            "first_name": first_name,
            "last_name": last_name,
            "short_summary": summary,
            "current_position": int(current_position_id),
            "past_positions": json.dumps(past_positions_ids, ensure_ascii=False),
            "created_at": created,
            "updated_at": created,
        })

    return pd.DataFrame(rows)


def main():
    df = asyncio.run(generate_structured_employees(n=20))
    # Write header exactly as required
    df = df[[
        "employee_number",
        "first_name",
        "last_name",
        "short_summary",
        "current_position",
        "past_positions",
        "created_at",
        "updated_at",
    ]]
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
    print(f"Wrote {len(df)} employees to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()

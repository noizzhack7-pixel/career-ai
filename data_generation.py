import argparse
import asyncio
import json
from pathlib import Path
from typing import List, Tuple

import pandas as pd
from dotenv import load_dotenv
import marvin

# Ensure the 'app' package (located under back\app) is importable when running from repo root
import sys
from pathlib import Path as _P
_repo_root = _P(__file__).resolve().parent
_back_path = _repo_root / "back"
if str(_back_path) not in sys.path:
    sys.path.insert(0, str(_back_path))

from app.models.Skill import SoftSkill, HardSkill
from app.models.Profile import Profile
from app.models.Position import Position
from app.models.Employee import Employee


def _to_json(value) -> str:
    return json.dumps(value, default=lambda o: getattr(o, "model_dump", lambda: str(o))())


async def gen_skills(n_soft: int = 10, n_hard: int = 10) -> Tuple[List[SoftSkill], List[HardSkill]]:
    soft = await marvin.generate_async(SoftSkill, n=n_soft)
    hard_instructions = (
        "For each HardSkill include an integer 'experience' field (years) >= 0, "
        "typically between 0 and 30. Use valid enum values for 'skill' and keep "
        "levels within the allowed range."
    )
    hard = await marvin.generate_async(HardSkill, n=n_hard, instructions=hard_instructions)
    return soft, hard


async def gen_profiles(n: int = 10) -> List[Profile]:
    # Provide a light instruction to ensure realistic distributions
    instructions = (
        "Generate realistic skill profiles with a mix of 3-8 hard_skills and 3-8 soft_skills. "
        "Names are optional but helpful. Use valid enums and levels within allowed range. "
        "For each hard_skill include 'experience' (years) as a non-negative integer, typically 0-30."
    )
    profiles = await marvin.generate_async(Profile, n=n, instructions=instructions)
    return profiles


async def gen_positions(n: int = 10) -> List[Position]:
    instructions = (
        "Each position should have a short, human-readable name, a valid category, and 1-3 profiles "
        "that reflect the role."
    )
    positions = await marvin.generate_async(Position, n=n, instructions=instructions)
    return positions


async def gen_employees(n: int = 25) -> List[Employee]:
    instructions = (
        "Generate employees with 4-10 hard_skills and 4-10 soft_skills using valid enums and levels. "
        "For each hard_skill include 'experience' (years) as a non-negative integer, typically 0-30. "
        "Optionally include current_position and a small set of past_positions that make sense."
    )
    employees = await marvin.generate_async(Employee, n=n, instructions=instructions)
    return employees


def skills_to_df(soft: List[SoftSkill], hard: List[HardSkill]) -> pd.DataFrame:
    rows = []
    for s in soft:
        rows.append({
            "id": getattr(s, "id", None),
            "type": "soft",
            "skill": s.skill,
            "level": s.level,
        })
    for h in hard:
        rows.append({
            "id": getattr(h, "id", None),
            "type": "hard",
            "skill": h.skill,
            "level": h.level,
            "experience": getattr(h, "experience", None),
        })
    return pd.DataFrame(rows)


def profiles_to_df(items: List[Profile]) -> pd.DataFrame:
    def skill_list(lst):
        return [s.model_dump(mode="json") for s in lst]

    rows = []
    for p in items:
        rows.append({
            "id": str(p.id),
            "name": p.name or "",
            "soft_skills": json.dumps(skill_list(p.soft_skills)),
            "hard_skills": json.dumps(skill_list(p.hard_skills)),
        })
    return pd.DataFrame(rows)


def positions_to_df(items: List[Position]) -> pd.DataFrame:
    rows = []
    for pos in items:
        rows.append({
            "id": pos.id,
            "name": pos.name,
            "category": pos.category,
            "profiles": json.dumps([pr.model_dump(mode="json") for pr in pos.profiles]),
        })
    return pd.DataFrame(rows)


def employees_to_df(items: List[Employee]) -> pd.DataFrame:
    rows = []
    for emp in items:
        rows.append({
            "id": emp.id,
            "name": emp.name,
            "current_position": json.dumps(emp.current_position.model_dump(mode="json")) if emp.current_position else "",
            "past_positions": json.dumps([p.model_dump(mode="json") for p in emp.past_positions]) if getattr(emp, "past_positions", None) else "[]",
            "hard_skills": json.dumps([s.model_dump(mode="json") for s in emp.hard_skills]),
            "soft_skills": json.dumps([s.model_dump(mode="json") for s in emp.soft_skills]),
        })
    return pd.DataFrame(rows)


async def main(args):
    load_dotenv()

    soft, hard = await gen_skills(args.n_soft_skills, args.n_hard_skills)
    profiles = await gen_profiles(args.n_profiles)
    positions = await gen_positions(args.n_positions)
    employees = await gen_employees(args.n_employees)

    df_skills = skills_to_df(soft, hard)
    df_profiles = profiles_to_df(profiles)
    df_positions = positions_to_df(positions)
    df_employees = employees_to_df(employees)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        df_skills.to_excel(writer, sheet_name="skills", index=False)
        df_positions.to_excel(writer, sheet_name="positions", index=False)
        df_profiles.to_excel(writer, sheet_name="profiles", index=False)
        df_employees.to_excel(writer, sheet_name="employees", index=False)

    print(f"Saved synthetic data to: {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic career data to Excel (via Marvin)")
    parser.add_argument("--output", default="back/data/synthetic.xlsx", help="Output Excel file path")
    parser.add_argument("--n-soft-skills", type=int, default=5)
    parser.add_argument("--n-hard-skills", type=int, default=5)
    parser.add_argument("--n-profiles", type=int, default=5)
    parser.add_argument("--n-positions", type=int, default=5)
    parser.add_argument("--n-employees", type=int, default=5)
    args = parser.parse_args()

    asyncio.run(main(args))

import marvin
import os
from pydantic import BaseModel, Field
from typing import Dict, List
import pandas as pd
from dotenv import load_dotenv
load_dotenv()


# ---------- 1. Schema ----------

class Employee(BaseModel):
    """
    Synthetic employee with coherent skill ratings.
    """
    name: str
    hard_skills: Dict[str, int] = Field(
        description="Mapping of hard skill -> score from 0 to 6"
    )
    soft_skills: Dict[str, int] = Field(
        description="Mapping of soft skill -> score from 0 to 6"
    )


# ---------- 2. Instructions for Marvin ----------

GEN_INSTRUCTIONS = """
Generate synthetic employees with hard and soft skills, each assigned a score from 0–6.

VALID HARD SKILLS (only these exact strings allowed):
"Python", "Pandas", "Numpy", "Scikit-learn", "SQL", "DB", "NoSQL",
"Data Modeling", "ETL", "Airflow", "Spark", "Excel", "Power BI",
"Tableau", "Git", "Docker", "Kubernetes"

VALID SOFT SKILLS:
"Communication", "Teamwork", "Problem Solving", "Ownership", "Leadership",
"Adaptability", "Time Management", "Attention to Detail", "Mentoring",
"Stakeholder Management"

RULES:
1. Each skill score must be an integer between 0 and 6.
2. Use 3–8 hard skills and 2–6 soft skills.
3. NON-CONTRADICTION LOGIC:
   - If "Pandas" or "Numpy" or "Scikit-learn" is present → "Python" must be present.
   - If "SQL" is present → "DB" must be present.
   - If "Spark" or "ETL" or "Airflow" is present → "Python" must be present.
4. Skills must not contradict each other.
5. The scores should make sense:
   - If an advanced tool appears (Spark, Airflow, ETL), Python should have score ≥ 3.
   - If SQL score ≥ 4, DB must also be ≥ 3.
6. Output must match the Employee schema exactly.
"""


# ---------- 3. DataFrame generator ----------

def generate_employee_df(n=5) -> pd.DataFrame:
    employees: List[Employee] = marvin.generate(
        n=n,
        target=Employee,
        instructions=GEN_INSTRUCTIONS,
    )

    rows = []
    for idx, emp in enumerate(employees, start=1):
        rows.append({
            "id": idx,
            "name": emp.name,
            "Skills": {
                "Hard Skills": emp.hard_skills,
                "Soft Skills": emp.soft_skills,
            }
        })

    return pd.DataFrame(rows)


# ---------- 4. Example ----------

if __name__ == "__main__":
    df_emp = generate_employee_df(5)
    print(df_emp.head())

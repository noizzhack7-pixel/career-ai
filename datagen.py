import marvin
from pydantic import BaseModel, Field
from typing import List
import pandas as pd

# ---------- 1. Define structured schema for Marvin ----------

class Employee(BaseModel):
    """
    Synthetic employee with coherent skills.
    """
    name: str = Field(
        description="Realistic first name (e.g. Alice, Amir, Chen, Dana)"
    )
    hard_skills: List[str] = Field(
        description="List of technical skills from the allowed list"
    )
    soft_skills: List[str] = Field(
        description="List of soft skills from the allowed list"
    )

# ---------- 2. Instructions for Marvin (skill constraints) ----------

GEN_INSTRUCTIONS = """
You generate synthetic employees for a tech / data company.

Return only JSON objects matching the Employee schema:
- name: a realistic first name (any gender, any locale)
- hard_skills: a list of 3-8 strings
- soft_skills: a list of 2-6 strings

VALID HARD SKILLS (use ONLY these exact strings):
- "Python"
- "Pandas"
- "Numpy"
- "Scikit-learn"
- "SQL"
- "DB"
- "NoSQL"
- "Data Modeling"
- "ETL"
- "Airflow"
- "Spark"
- "Excel"
- "Power BI"
- "Tableau"
- "Git"
- "Docker"
- "Kubernetes"

VALID SOFT SKILLS (use ONLY these exact strings):
- "Communication"
- "Teamwork"
- "Problem Solving"
- "Ownership"
- "Leadership"
- "Adaptability"
- "Time Management"
- "Attention to Detail"
- "Mentoring"
- "Stakeholder Management"

NON-CONTRADICTION RULES (MUST ALWAYS HOLD):
1. If "Pandas" is in hard_skills, "Python" MUST also be in hard_skills.
2. If "Numpy" is in hard_skills, "Python" MUST also be in hard_skills.
3. If "Scikit-learn" is in hard_skills, "Python" MUST also be in hard_skills.
4. If "SQL" is in hard_skills, "DB" MUST also be in hard_skills.
5. If "Spark" or "Airflow" or "ETL" is in hard_skills, then "Python" MUST also be in hard_skills.
6. Do NOT create logically inconsistent combinations like:
   - Advanced tools without the basics, e.g. "Pandas" without "Python",
     or "SQL" without "DB", or "Spark" without "Python".
7. Avoid obvious duplicates or near-duplicates in the same list.

The distribution should mix:
- Data analysts (Excel, Power BI, SQL, DB, Tableau)
- Data scientists (Python, Pandas, Numpy, Scikit-learn, SQL, DB)
- Data / ML engineers (Python, DB, SQL, ETL, Airflow, Spark, Docker, Kubernetes)
- Less technical people with fewer hard skills and stronger soft skills.
"""

# ---------- 3. Wrapper to generate a pandas DataFrame ----------

def generate_employee_df(n: int = 10_000) -> pd.DataFrame:
    # Use Marvin to generate structured synthetic employees
    employees: List[Employee] = marvin.generate(
        n=n,
        target=Employee,
        instructions=GEN_INSTRUCTIONS,
    )

    records = []
    for idx, e in enumerate(employees, start=1):
        records.append(
            {
                "id": idx,
                "name": e.name,
                "Skills": {
                    "Hard Skills": e.hard_skills,
                    "Soft Skills": e.soft_skills,
                },
            }
        )

    df = pd.DataFrame(records)
    return df

# ---------- 4. Example usage ----------

if __name__ == "__main__":
    df_emp = generate_employee_df(10_000)
    print(df_emp.head())
    # df_emp now looks like:
    #    id   name                                             Skills
    # 0   1  Alice  {'Hard Skills': ['Python', 'SQL', 'DB'], 'Soft ...

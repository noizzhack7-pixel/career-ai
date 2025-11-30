import pandas as pd
import numpy as np
from typing import List, Tuple, Dict


def explode_skill_columns(
    df: pd.DataFrame,
    id_col: str,
    name_col: str,
    kind: str,
    skill_prefix: str
) -> pd.DataFrame:
    """
    Convert wide skill columns into long format.

    Parameters
    ----------
    df : DataFrame
        Input table with repeated skill-name / skill-level columns.
    id_col : str
        Column name with the entity id (job_id or employee_id).
    name_col : str
        Column name with the entity name.
    kind : str
        Either 'hard' or 'soft'.
    skill_prefix : str
        Common prefix for the skill columns, e.g. 'hard_skill', 'soft_skill'.

    Expected column pattern:
        {skill_prefix}_{i}_name
        {skill_prefix}_{i}_level
    for i starting at 1, 2, 3, ...

    Returns
    -------
    DataFrame with columns:
        [id_col, name_col, "skill_type", "skill_name", "skill_level"]
    """
    # detect how many skill slots there are by scanning columns
    name_cols = [c for c in df.columns if c.startswith(skill_prefix) and c.endswith("_name")]
    # Expect pattern like "hard_skill_1_name" -> index is 1
    indices = sorted(int(c.split("_")[2]) for c in name_cols)

    records = []
    for _, row in df.iterrows():
        base_id = row[id_col]
        base_name = row[name_col]
        for i in indices:
            skill_name_col = f"{skill_prefix}_{i}_name"
            skill_level_col = f"{skill_prefix}_{i}_level"
            skill_name = row.get(skill_name_col)
            skill_level = row.get(skill_level_col)
            # Skip completely empty skill slots
            if pd.isna(skill_name) or skill_name == "":
                continue
            if pd.isna(skill_level):
                skill_level = 0
            records.append(
                {
                    id_col: base_id,
                    name_col: base_name,
                    "skill_type": kind,
                    "skill_name": str(skill_name),
                    "skill_level": int(skill_level),
                }
            )
    return pd.DataFrame.from_records(records)


def build_skill_universe(
    jobs_long: pd.DataFrame,
    emps_long: pd.DataFrame
) -> Dict[str, List[str]]:
    """
    Build the unified universe of skills for hard and soft.

    Returns dict:
        {
            "hard": [skill1, skill2, ...],
            "soft": [skill1, skill2, ...],
        }
    """
    all_long = pd.concat([jobs_long, emps_long], ignore_index=True)
    skill_universe = {}
    for kind in ["hard", "soft"]:
        subset = all_long[all_long["skill_type"] == kind]
        skills = sorted(subset["skill_name"].unique().tolist())
        skill_universe[kind] = skills
    return skill_universe


def expand_to_full_matrix(
    long_df: pd.DataFrame,
    id_col: str,
    name_col: str,
    kind: str,
    skills: List[str]
) -> pd.DataFrame:
    """
    Turn long-format skills into a matrix where each skill is its own column
    and missing skills are filled with 0.

    Returns a DataFrame indexed by [id_col, name_col] with one column per skill.
    """
    subset = long_df[long_df["skill_type"] == kind]

    # pivot to wide format
    mat = subset.pivot_table(
        index=[id_col, name_col],
        columns="skill_name",
        values="skill_level",
        fill_value=0,
        aggfunc="max",  # if duplicates ever appear, keep the max level
    )

    # ensure we have all skills, even those missing in this side (jobs/emps)
    for skill in skills:
        if skill not in mat.columns:
            mat[skill] = 0

    # reorder columns according to the global skill list
    mat = mat[skills]

    # for convenience, drop the column index name
    mat.columns.name = None
    return mat.sort_index()


def cosine_similarity_matrix(
    A: np.ndarray,
    B: np.ndarray
) -> np.ndarray:
    """
    Compute cosine similarity between all rows of A and B.

    A: shape (n_a, d)
    B: shape (n_b, d)
    Returns: shape (n_a, n_b)
    """
    # norms
    A_norm = np.linalg.norm(A, axis=1, keepdims=True)
    B_norm = np.linalg.norm(B, axis=1, keepdims=True)

    # avoid division by zero by replacing zeros with tiny number
    A_norm[A_norm == 0] = 1e-9
    B_norm[B_norm == 0] = 1e-9

    # similarity = A · B^T / (||A|| * ||B||)
    sim = (A @ B.T) / (A_norm * B_norm.T)
    return sim


def similarity_long_table(
    job_matrix: pd.DataFrame,
    emp_matrix: pd.DataFrame,
    sim_kind: str
) -> pd.DataFrame:
    """
    Build a long-format table of similarities between each job and employee.

    job_matrix: DataFrame indexed by [job_id, job_name]
    emp_matrix: DataFrame indexed by [employee_id, employee_name]

    sim_kind: str
        Label for the similarity column, e.g. 'cosine_hard' or 'cosine_soft'.

    Returns
    -------
    DataFrame with columns:
        job_id, job_name, employee_id, employee_name, <sim_kind>
    """
    job_index = job_matrix.index.to_frame(index=False)
    emp_index = emp_matrix.index.to_frame(index=False)

    sim_values = cosine_similarity_matrix(
        job_matrix.values.astype(float), emp_matrix.values.astype(float)
    )

    # build multi-indexed DataFrame then stack to long
    sim_df = pd.DataFrame(
        sim_values,
        index=pd.MultiIndex.from_frame(job_index),
        columns=pd.MultiIndex.from_frame(emp_index),
    )

    sim_df = sim_df.stack(list(range(2))).reset_index()
    sim_df.columns = ["job_id", "job_name", "employee_id", "employee_name", sim_kind]
    return sim_df


def build_matching_pipeline(
    jobs_raw: pd.DataFrame,
    emps_raw: pd.DataFrame,
) -> Tuple[
    pd.DataFrame,  # job_hard_matrix
    pd.DataFrame,  # job_soft_matrix
    pd.DataFrame,  # emp_hard_matrix
    pd.DataFrame,  # emp_soft_matrix
    pd.DataFrame,  # similarity_table
]:
    """
    Full pipeline from raw wide tables to cosine similarity matching table.

    Assumed column structure of jobs_raw:
        - 'job_id'
        - 'job_name'
        - 'hard_skill_1_name', 'hard_skill_1_level', ...
        - 'soft_skill_1_name', 'soft_skill_1_level', ...

    Assumed column structure of emps_raw:
        - 'employee_id'
        - 'employee_name'
        - 'hard_skill_1_name', 'hard_skill_1_level', ...
        - 'soft_skill_1_name', 'soft_skill_1_level', ...

    Returns
    -------
    job_hard_matrix, job_soft_matrix, emp_hard_matrix, emp_soft_matrix, similarity_table
    """
    # Step 1: explode wide skill columns to long format for jobs and employees
    job_hard_long = explode_skill_columns(
        jobs_raw, id_col="job_id", name_col="job_name", kind="hard", skill_prefix="hard_skill"
    )
    job_soft_long = explode_skill_columns(
        jobs_raw, id_col="job_id", name_col="job_name", kind="soft", skill_prefix="soft_skill"
    )
    jobs_long = pd.concat([job_hard_long, job_soft_long], ignore_index=True)

    emp_hard_long = explode_skill_columns(
        emps_raw, id_col="employee_id", name_col="employee_name", kind="hard", skill_prefix="hard_skill"
    )
    emp_soft_long = explode_skill_columns(
        emps_raw, id_col="employee_id", name_col="employee_name", kind="soft", skill_prefix="soft_skill"
    )
    emps_long = pd.concat([emp_hard_long, emp_soft_long], ignore_index=True)

    # Step 2: build the full skill universe from both tables
    skill_universe = build_skill_universe(jobs_long, emps_long)
    hard_skills = skill_universe["hard"]
    soft_skills = skill_universe["soft"]

    # Step 3: expand jobs and employees to full matrices for hard and soft skills
    job_hard_matrix = expand_to_full_matrix(
        jobs_long, id_col="job_id", name_col="job_name", kind="hard", skills=hard_skills
    )
    job_soft_matrix = expand_to_full_matrix(
        jobs_long, id_col="job_id", name_col="job_name", kind="soft", skills=soft_skills
    )
    emp_hard_matrix = expand_to_full_matrix(
        emps_long, id_col="employee_id", name_col="employee_name", kind="hard", skills=hard_skills
    )
    emp_soft_matrix = expand_to_full_matrix(
        emps_long, id_col="employee_id", name_col="employee_name", kind="soft", skills=soft_skills
    )

    # Step 4: compute cosine similarity for hard and soft vectors separately
    hard_sim_long = similarity_long_table(job_hard_matrix, emp_hard_matrix, sim_kind="cosine_hard")
    soft_sim_long = similarity_long_table(job_soft_matrix, emp_soft_matrix, sim_kind="cosine_soft")

    # Merge the two similarity tables on the pair (job, employee)
    similarity_table = pd.merge(
        hard_sim_long,
        soft_sim_long,
        on=["job_id", "job_name", "employee_id", "employee_name"],
        how="outer",
    )

    # Optionally compute an overall score as the mean of available similarities
    similarity_table["cosine_overall"] = similarity_table[["cosine_hard", "cosine_soft"]].mean(axis=1)

    # sort for readability
    similarity_table = similarity_table.sort_values(
        ["job_id", "employee_id"]
    ).reset_index(drop=True)

    return job_hard_matrix, job_soft_matrix, emp_hard_matrix, emp_soft_matrix, similarity_table


def demo():
    """
    Small demo with toy data to show how the pipeline works.
    """
    # Example job table
    jobs_raw = pd.DataFrame(
        {
            "job_id": [1, 2],
            "job_name": ["Data Scientist", "Backend Engineer"],
            "hard_skill_1_name": ["Python", "Python"],
            "hard_skill_1_level": [5, 4],
            "hard_skill_2_name": ["SQL", "Java"],
            "hard_skill_2_level": [4, 5],
            "soft_skill_1_name": ["Communication", "Teamwork"],
            "soft_skill_1_level": [4, 5],
            "soft_skill_2_name": ["Problem Solving", "Communication"],
            "soft_skill_2_level": [5, 4],
        }
    )

    # Example employee table
    emps_raw = pd.DataFrame(
        {
            "employee_id": [101, 102],
            "employee_name": ["Alice", "Bob"],
            "hard_skill_1_name": ["Python", "Java"],
            "hard_skill_1_level": [4, 5],
            "hard_skill_2_name": ["SQL", "Python"],
            "hard_skill_2_level": [3, 4],
            "soft_skill_1_name": ["Communication", "Communication"],
            "soft_skill_1_level": [5, 3],
            "soft_skill_2_name": ["Teamwork", "Problem Solving"],
            "soft_skill_2_level": [4, 4],
        }
    )

    job_hard_matrix, job_soft_matrix, emp_hard_matrix, emp_soft_matrix, similarity_table = build_matching_pipeline(
        jobs_raw, emps_raw
    )

    print("=== Job Hard Skill Matrix ===")
    print(job_hard_matrix, "\n")

    print("=== Job Soft Skill Matrix ===")
    print(job_soft_matrix, "\n")

    print("=== Employee Hard Skill Matrix ===")
    print(emp_hard_matrix, "\n")

    print("=== Employee Soft Skill Matrix ===")
    print(emp_soft_matrix, "\n")

    print("=== Job-Employee Similarities ===")
    print(similarity_table)


if __name__ == "__main__":
    demo()

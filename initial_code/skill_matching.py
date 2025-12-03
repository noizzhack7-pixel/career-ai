import pandas as pd
import numpy as np

## the system gets as of now predefined set of job and employee dfs and calculates the match
## between them using cosine similarity.
## 1. the weight of calculations between soft skills and hard skills is dynamic for each job (with default enabled)
## 2. unified vector store has been calculated
## 3. top employees for job has been made
## next steps:
## 1. generate data using datage.py and test it on larger set of employees
## 2. build the structure engine
## 3. 

# -------------------------------------------------------------------
# 1. Helpers to safely extract skills
# -------------------------------------------------------------------

# -------------------------------------------------------------------
# Dynamic weighting per job
# -------------------------------------------------------------------

# Per-job dynamic weights: job_name -> (weight_hard, weight_soft)
JOB_WEIGHT_CONFIG = {
    "HR": (0.3, 0.7),
    "Finances": (0.7, 0.3),
    "Diplomat": (0.2, 0.8),
    "Fullstack Developer": (0.8, 0.2),
    "AI Engineer": (0.85, 0.15),
    "Penetration Tester": (0.9, 0.1),
    "Strategic Consultant": (0.5, 0.5),
    "Material Engineer": (0.75, 0.25),
}

DEFAULT_WEIGHT_HARD = 0.7
DEFAULT_WEIGHT_SOFT = 0.3

def get_job_weights(job_name: str):
    """
    Returns (weight_hard, weight_soft) for a job name.
    Falls back to DEFAULT_* if job_name not in JOB_WEIGHT_CONFIG.
    """
    return JOB_WEIGHT_CONFIG.get(job_name, (DEFAULT_WEIGHT_HARD, DEFAULT_WEIGHT_SOFT))

def cosine_similarity_one_to_many(vec, mat, eps=1e-9):
    """
    vec: shape (d,)
    mat: shape (n, d)
    returns: shape (n,) cosine similarity between vec and each row in mat
    """
    vec = vec.astype(float)
    mat = mat.astype(float)

    vec_norm = np.linalg.norm(vec) + eps
    mat_norms = np.linalg.norm(mat, axis=1) + eps

    return (mat @ vec) / (mat_norms * vec_norm)

def cosine_similarity_matrix(A, B, eps=1e-9):
    """
    A: (n_a, d) matrix
    B: (n_b, d) matrix
    returns: (n_a, n_b) matrix of cosine similarities
    """
    A_norm = A / (np.linalg.norm(A, axis=1, keepdims=True) + eps)
    B_norm = B / (np.linalg.norm(B, axis=1, keepdims=True) + eps)
    return A_norm @ B_norm.T

def get_top_employees_for_job(
    job_identifier,
    top_k=5,
    weight_hard=None,
    weight_soft=None
):
    # -----------------------------
    # 1. Resolve job index + name
    # -----------------------------
    if isinstance(job_identifier, int):
        job_idx = skill_spaces["job_hard"]["id_index"][job_identifier]
        job_row = df_job.loc[df_job["id"] == job_identifier].iloc[0]
    else:
        job_idx = skill_spaces["job_hard"]["name_index"][job_identifier]
        job_row = df_job.loc[df_job["name"] == job_identifier].iloc[0]

    job_name = job_row["name"]

    # -----------------------------
    # 2. Dynamic weights as before
    # -----------------------------
    if weight_hard is None or weight_soft is None:
        weight_hard, weight_soft = get_job_weights(job_name)

    total_w = weight_hard + weight_soft
    if total_w == 0:
        weight_hard, weight_soft = 1.0, 0.0
    else:
        weight_hard /= total_w
        weight_soft /= total_w

    # Shortcuts
    job_hard_index = skill_spaces["job_hard"]["skill_index"]  # job skill axis
    emp_hard_index = skill_spaces["emp_hard"]["skill_index"]
    job_soft_index = skill_spaces["job_soft"]["skill_index"]
    emp_soft_index = skill_spaces["emp_soft"]["skill_index"]

    job_hard_mat = skill_spaces["job_hard"]["matrix"]
    emp_hard_mat_full = skill_spaces["emp_hard"]["matrix"]
    job_soft_mat = skill_spaces["job_soft"]["matrix"]
    emp_soft_mat_full = skill_spaces["emp_soft"]["matrix"]

    n_emp = len(df_emp)

    # -----------------------------
    # 3. HARD: job-centric axis
    # -----------------------------
    num_job_hard = len(job_hard_index)
    job_hard_vec = job_hard_mat[job_idx, :]  # already on full job axis

    # Build employee HARD matrix on job's axis (missing skills = 0)
    emp_hard_mat = np.zeros((n_emp, num_job_hard), dtype=float)

    for skill, job_col in job_hard_index.items():
        if skill in emp_hard_index:
            emp_col = emp_hard_index[skill]
            emp_hard_mat[:, job_col] = emp_hard_mat_full[:, emp_col]
        # else: remain 0 for that skill for all employees

    hard_sim = cosine_similarity_one_to_many(job_hard_vec, emp_hard_mat)

    # -----------------------------
    # 4. SOFT: job-centric axis
    # -----------------------------
    num_job_soft = len(job_soft_index)
    job_soft_vec = job_soft_mat[job_idx, :]

    emp_soft_mat = np.zeros((n_emp, num_job_soft), dtype=float)

    for skill, job_col in job_soft_index.items():
        if skill in emp_soft_index:
            emp_col = emp_soft_index[skill]
            emp_soft_mat[:, job_col] = emp_soft_mat_full[:, emp_col]

    soft_sim = cosine_similarity_one_to_many(job_soft_vec, emp_soft_mat)

    # -----------------------------
    # 5. Optional: coverage penalty
    #    (how many of the job skills does employee actually have?)
    # -----------------------------
    # Count non-zero skills per employee on job's HARD axis
    job_required_hard = (job_hard_vec > 0).sum()
    emp_hard_nonzero = (emp_hard_mat > 0).sum(axis=1)
    hard_coverage = np.where(job_required_hard > 0,
                             emp_hard_nonzero / job_required_hard,
                             1.0)

    # We can use coverage as a multiplier (tunable exponent)
    coverage_alpha = 1.0  # you can change this
    coverage_factor = hard_coverage ** coverage_alpha

    # -----------------------------
    # 6. Combine with job-specific weights
    # -----------------------------
    combined_score_raw = weight_hard * hard_sim + weight_soft * soft_sim
    combined_score = combined_score_raw * coverage_factor

    # -----------------------------
    # 7. Build result DataFrame
    # -----------------------------
    results = pd.DataFrame({
        "emp_row_idx": np.arange(len(df_emp)),
        "emp_id": df_emp["id"].values,
        "emp_name": df_emp["name"].values,
        "similarity_hard": hard_sim,
        "similarity_soft": soft_sim,
        "similarity_combined_raw": combined_score_raw,
        "hard_coverage": hard_coverage,
        "similarity_combined": combined_score,
    })

    results = results.sort_values("similarity_combined", ascending=False).head(top_k)

    return job_name, results

def get_hard_skills(skills_dict):
    if not isinstance(skills_dict, dict):
        return {}
    return skills_dict.get("Hard Skills", {}) or {}

def get_soft_skills(skills_dict):
    if not isinstance(skills_dict, dict):
        return {}
    return skills_dict.get("Soft Skills", {}) or {}

#extracted skills and levels using chatgpto5
df_job = pd.DataFrame([
    {
        "id": 1,
        "name": "HR",
        "Skills": {
            "Hard Skills": {
                "Recruitment Processes": 5,
                "Employee Onboarding": 4,
                "HRIS Systems": 3,
                "Compensation & Benefits": 4,
                "Labor Law": 5,
                "Performance Management": 4,
                "Employee Engagement Surveys": 3,
                "Data Reporting & Dashboards": 2,
                "Employer Branding": 3,
                "Training & Development Planning": 4
            },
            "Soft Skills": {
                "Communication": 6,
                "Empathy": 6,
                "Conflict Resolution": 5,
                "Negotiation": 4,
                "Active Listening": 6,
                "Teamwork": 4,
                "Discretion & Confidentiality": 5,
                "Stress Management": 3,
                "Adaptability": 3,
                "Public Speaking": 2
            }
        }
    },
    {
        "id": 2,
        "name": "Finances",
        "Skills": {
            "Hard Skills": {
                "Excel": 6,
                "Financial Analysis": 5,
                "Accounting Principles": 5,
                "Budgeting": 4,
                "SQL": 3,
                "Forecasting Models": 4,
                "Regulations & Compliance": 4,
                "Power BI / Tableau": 3,
                "Taxation Basics": 3,
                "Cost Accounting": 2
            },
            "Soft Skills": {
                "Attention to Detail": 6,
                "Analytical Thinking": 5,
                "Risk Awareness": 4,
                "Integrity": 6,
                "Time Management": 4,
                "Communication": 3,
                "Teamwork": 3,
                "Stress Tolerance": 3,
                "Problem Solving": 4,
                "Stakeholder Management": 2
            }
        }
    },
    {
        "id": 3,
        "name": "Diplomat",
        "Skills": {
            "Hard Skills": {
                "International Relations": 5,
                "Policy Writing": 4,
                "Cultural Analysis": 4,
                "Foreign Languages": 5,
                "Negotiation Frameworks": 4,
                "Media Handling": 3,
                "Speech Writing": 3,
                "Conflict Mediation Techniques": 4,
                "Protocol & Etiquette": 5,
                "Geopolitical Analysis": 4
            },
            "Soft Skills": {
                "Diplomacy": 6,
                "Communication": 6,
                "Crisis Management": 4,
                "Emotional Intelligence": 6,
                "Persuasion": 5,
                "Adaptability": 4,
                "Resilience": 4,
                "Networking": 5,
                "Patience": 5,
                "Public Speaking": 4
            }
        }
    },
    {
        "id": 4,
        "name": "Fullstack Developer",
        "Skills": {
            "Hard Skills": {
                "Python": 4,
                "JavaScript": 6,
                "TypeScript": 4,
                "React": 5,
                "Node.js": 5,
                "SQL": 4,
                "NoSQL": 3,
                "REST APIs": 5,
                "GraphQL": 3,
                "HTML/CSS": 5,
                "Testing (Unit/Integration)": 4,
                "Docker": 3,
                "CI/CD Pipelines": 3,
                "Cloud Platforms (AWS/Azure/GCP)": 3
            },
            "Soft Skills": {
                "Problem Solving": 6,
                "Teamwork": 4,
                "Communication": 3,
                "Ownership": 4,
                "Adaptability": 4,
                "Time Management": 3,
                "Self-Learning": 5,
                "Attention to Detail": 3,
                "Collaboration with Non-Tech Stakeholders": 2
            }
        }
    },
    {
        "id": 5,
        "name": "AI Engineer",
        "Skills": {
            "Hard Skills": {
                "Python": 6,
                "Machine Learning": 6,
                "Deep Learning": 5,
                "TensorFlow": 4,
                "PyTorch": 4,
                "Data Engineering": 3,
                "Statistics": 5,
                "MLOps": 3,
                "Vector Databases": 3,
                "Prompt Engineering": 4,
                "Classical ML (Sklearn)": 5,
                "Feature Engineering": 4,
                "Experiment Tracking": 3,
                "Model Evaluation & Metrics": 5
            },
            "Soft Skills": {
                "Analytical Thinking": 6,
                "Problem Solving": 6,
                "Creativity": 4,
                "Communication": 3,
                "Curiosity": 5,
                "Business Understanding": 3,
                "Collaboration": 4,
                "Documentation": 2,
                "Presentation Skills": 2
            }
        }
    },
    {
        "id": 6,
        "name": "Penetration Tester",
        "Skills": {
            "Hard Skills": {
                "Networking": 5,
                "Python": 4,
                "Bash Scripting": 4,
                "Linux": 6,
                "Vulnerability Analysis": 6,
                "OWASP Top 10": 5,
                "Metasploit": 4,
                "Burp Suite": 5,
                "Web Application Security": 5,
                "Threat Modeling": 3,
                "Report Writing": 3,
                "Social Engineering Techniques": 2,
                "Cloud Security Basics": 2
            },
            "Soft Skills": {
                "Critical Thinking": 6,
                "Persistence": 5,
                "Attention to Detail": 5,
                "Communication": 3,
                "Ethical Mindset": 6,
                "Time Management": 3,
                "Stress Tolerance": 3,
                "Curiosity": 4,
                "Team Collaboration": 3
            }
        }
    },
    {
        "id": 7,
        "name": "Strategic Consultant",
        "Skills": {
            "Hard Skills": {
                "Market Analysis": 5,
                "Excel Modeling": 5,
                "PowerPoint Storytelling": 6,
                "Business Strategy": 5,
                "Financial Modeling": 4,
                "Primary Research": 4,
                "Secondary Research": 4,
                "Competitive Analysis": 4,
                "Data Visualization": 3,
                "Basic SQL": 2
            },
            "Soft Skills": {
                "Communication": 6,
                "Presentation Skills": 6,
                "Problem Solving": 5,
                "Leadership": 3,
                "Client Management": 5,
                "Structured Thinking": 6,
                "Time Management": 4,
                "Teamwork": 4,
                "Feedback Handling": 3,
                "Resilience": 3
            }
        }
    },
    {
        "id": 8,
        "name": "Material Engineer",
        "Skills": {
            "Hard Skills": {
                "Material Science": 6,
                "Chemistry": 5,
                "Mechanical Testing": 4,
                "Simulation Tools (FEA)": 4,
                "Quality Control": 4,
                "Data Analysis": 3,
                "CAD Tools": 3,
                "Failure Analysis": 4,
                "Manufacturing Processes": 3,
                "Regulatory Standards": 2
            },
            "Soft Skills": {
                "Attention to Detail": 6,
                "Problem Solving": 5,
                "Analytical Thinking": 5,
                "Teamwork": 4,
                "Technical Writing": 3,
                "Communication": 3,
                "Project Management": 3,
                "Creativity": 3,
                "Collaboration with Production": 2
            }
        }
    }
])
#need to load data from datagen.py after i use api key to generate 10k (for now use predefined users to check algorithm)
df_emp = pd.DataFrame([
  {
    "id": 1,
    "name": "Alice",
    "Skills": {
      "Hard Skills": {
        "Python": 5,
        "Pandas": 4,
        "Numpy": 3,
        "SQL": 4,
        "DB": 4
      },
      "Soft Skills": {
        "Communication": 5,
        "Teamwork": 4,
        "Problem Solving": 3
      }
    }
  },

  {
    "id": 2,
    "name": "Amir",
    "Skills": {
      "Hard Skills": {
        "Python": 3,
        "Excel": 4,
        "Power BI": 3,
        "SQL": 3,
        "DB": 3
      },
      "Soft Skills": {
        "Teamwork": 5,
        "Ownership": 4,
        "Attention to Detail": 3
      }
    }
  },

  {
    "id": 3,
    "name": "Noa",
    "Skills": {
      "Hard Skills": {
        "Python": 6,
        "ETL": 5,
        "Airflow": 4,
        "Spark": 4,
        "DB": 4,
        "SQL": 4
      },
      "Soft Skills": {
        "Leadership": 3,
        "Communication": 4,
        "Adaptability": 5
      }
    }
  },

  {
    "id": 4,
    "name": "Roni",
    "Skills": {
      "Hard Skills": {
        "Excel": 5,
        "Tableau": 4,
        "Power BI": 3,
        "SQL": 3,
        "DB": 3
      },
      "Soft Skills": {
        "Time Management": 4,
        "Teamwork": 3,
        "Stakeholder Management": 4
      }
    }
  },

  {
    "id": 5,
    "name": "Eli",
    "Skills": {
      "Hard Skills": {
        "Python": 4,
        "Git": 3,
        "Docker": 2,
        "Kubernetes": 1
      },
      "Soft Skills": {
        "Problem Solving": 5,
        "Ownership": 4,
        "Adaptability": 4
      }
    }
  }
]
)

# -------------------------------------------------------------------
# 2. Collect skill vocabularies (axis systems)
#    - one for job hard
#    - one for job soft
#    - one for employee hard
#    - one for employee soft
# -------------------------------------------------------------------

# Job skill sets
job_hard_set = set()
job_soft_set = set()

for skills in df_job["Skills"]:
    h = get_hard_skills(skills)
    s = get_soft_skills(skills)
    job_hard_set.update(h.keys())
    job_soft_set.update(s.keys())

# Employee skill sets
emp_hard_set = set()
emp_soft_set = set()

for skills in df_emp["Skills"]:
    h = get_hard_skills(skills)
    s = get_soft_skills(skills)
    emp_hard_set.update(h.keys())
    emp_soft_set.update(s.keys())

# Sort for deterministic order
job_hard_skills = sorted(job_hard_set)
job_soft_skills = sorted(job_soft_set)
emp_hard_skills = sorted(emp_hard_set)
emp_soft_skills = sorted(emp_soft_set)

# Create skill → index mappings
job_hard_index = {skill: i for i, skill in enumerate(job_hard_skills)}
job_soft_index = {skill: i for i, skill in enumerate(job_soft_skills)}
emp_hard_index = {skill: i for i, skill in enumerate(emp_hard_skills)}
emp_soft_index = {skill: i for i, skill in enumerate(emp_soft_skills)}

# -------------------------------------------------------------------
# 3. Initialize matrices
#    - rows = jobs / employees
#    - cols = skills for that axis system
# -------------------------------------------------------------------

n_jobs = len(df_job)
n_emps = len(df_emp)

job_hard_matrix = np.zeros((n_jobs, len(job_hard_skills)), dtype=float)
job_soft_matrix = np.zeros((n_jobs, len(job_soft_skills)), dtype=float)

emp_hard_matrix = np.zeros((n_emps, len(emp_hard_skills)), dtype=float)
emp_soft_matrix = np.zeros((n_emps, len(emp_soft_skills)), dtype=float)

# -------------------------------------------------------------------
# 4. Fill job matrices
# -------------------------------------------------------------------

for row_idx, row in df_job.iterrows():
    skills = row["Skills"]
    h = get_hard_skills(skills)
    s = get_soft_skills(skills)

    # Hard skills
    for skill_name, level in h.items():
        col_idx = job_hard_index[skill_name]
        job_hard_matrix[row_idx, col_idx] = float(level)

    # Soft skills
    for skill_name, level in s.items():
        col_idx = job_soft_index[skill_name]
        job_soft_matrix[row_idx, col_idx] = float(level)

# -------------------------------------------------------------------
# 5. Fill employee matrices
# -------------------------------------------------------------------

for row_idx, row in df_emp.iterrows():
    skills = row["Skills"]
    h = get_hard_skills(skills)
    s = get_soft_skills(skills)

    # Hard skills
    for skill_name, level in h.items():
        col_idx = emp_hard_index[skill_name]
        emp_hard_matrix[row_idx, col_idx] = float(level)

    # Soft skills
    for skill_name, level in s.items():
        col_idx = emp_soft_index[skill_name]
        emp_soft_matrix[row_idx, col_idx] = float(level)

# -------------------------------------------------------------------
# 6. Id → row index mappings (so you can access vectors fast later)
# -------------------------------------------------------------------

job_id_to_idx = {row["id"]: i for i, row in df_job.iterrows()}
emp_id_to_idx = {row["id"]: i for i, row in df_emp.iterrows()}

# Optional: name → row index (if useful)
job_name_to_idx = {row["name"]: i for i, row in df_job.iterrows()}
emp_name_to_idx = {row["name"]: i for i, row in df_emp.iterrows()}

# -------------------------------------------------------------------
# 7. Pack everything into a convenient structure
# -------------------------------------------------------------------

skill_spaces = {
    "job_hard": {
        "matrix": job_hard_matrix,
        "skill_index": job_hard_index,
        "id_index": job_id_to_idx,
        "name_index": job_name_to_idx,
    },
    "job_soft": {
        "matrix": job_soft_matrix,
        "skill_index": job_soft_index,
        "id_index": job_id_to_idx,
        "name_index": job_name_to_idx,
    },
    "emp_hard": {
        "matrix": emp_hard_matrix,
        "skill_index": emp_hard_index,
        "id_index": emp_id_to_idx,
        "name_index": emp_name_to_idx,
    },
    "emp_soft": {
        "matrix": emp_soft_matrix,
        "skill_index": emp_soft_index,
        "id_index": emp_id_to_idx,
        "name_index": emp_name_to_idx,
    },
}



# Example: similarity on HARD skills (only where skill names overlap)
# First, align dimensions by skill name (intersection of skills):

common_hard_skills = sorted(set(job_hard_index.keys()) & set(emp_hard_index.keys()))

# Build aligned matrices only on common skills
job_hard_cols = [job_hard_index[s] for s in common_hard_skills]
emp_hard_cols = [emp_hard_index[s] for s in common_hard_skills]

job_hard_aligned = job_hard_matrix[:, job_hard_cols]
emp_hard_aligned = emp_hard_matrix[:, emp_hard_cols]

similarity_hard = cosine_similarity_matrix(job_hard_aligned, emp_hard_aligned)
# similarity_hard[j, e] = similarity between job j and employee e based on hard skills

print (df_emp.head(20))
print (df_job.head(20))

job_name, top5 = get_top_employees_for_job("AI Engineer", top_k=5)

print(f"Top 5 employees for job: {job_name}\n")
print(top5[["emp_id", "emp_name", "similarity_hard", "similarity_soft", "similarity_combined"]])



print(get_job_weights("AI Engineer"))
print(get_job_weights("HR"))
print(get_job_weights("Some Unknown Job"))
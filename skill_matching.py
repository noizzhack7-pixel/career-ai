import pandas as pd
import numpy as np


##example for AI to copy
df_emp = pd.DataFrame([
    { "id": 1,
    "name": "Alice",
    "Skills": {
                  "Hard Skills": ["Python", "Sql", "DB"],
                  "Soft Skills": ["Communication", "Teamwork"] }

    },
    { "id": 2,
    "name": "Amir",
                  "Hard Skills": ["Python", "Sql", "DB"],
                  "Soft Skills": ["Communication", "Teamwork"] }

    ])

df_job = pd.DataFrame()

print (df_emp.head(20))
print (df_job.head)

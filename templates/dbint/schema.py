import os
import json
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values, Json

# Database connection
conn = psycopg2.connect(
    dbname="your_database",
    user="your_user",
    password="your_password",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Folder for CSV files
folder_path = r"C:\Users\User\PycharmProjects\career-ai\templates"


# Helper functions
def insert_skills(file_path, table_name):
    """Insert skills into hard_skills or soft_skills table without duplicates."""
    df = pd.read_csv(file_path)
    skill_names = df['name'].drop_duplicates().tolist()  # Assuming skills column is named 'name'

    values = [(name,) for name in skill_names]

    query = f"INSERT INTO {table_name} (name) VALUES %s ON CONFLICT (name) DO NOTHING;"
    execute_values(cursor, query, values)
    conn.commit()


def insert_positions(file_path):
    """Insert data into positions table."""
    df = pd.read_csv(file_path)
    positions = df['name'].drop_duplicates().tolist()

    values = [(p,) for p in positions]

    query = "INSERT INTO positions (name) VALUES %s ON CONFLICT (name) DO NOTHING;"
    execute_values(cursor, query, values)
    conn.commit()


def insert_employees(file_path):
    """Insert data into employees table."""
    df = pd.read_csv(file_path)

    for _, row in df.iterrows():
        name = row['name']
        current_position = row['current_position']  # Expects a position name
        past_positions = list(map(int, row['past_positions'].split(','))) if row['past_positions'] else []

        # Get or create current_position ID
        cursor.execute("SELECT id FROM positions WHERE name = %s;", (current_position,))
        position_result = cursor.fetchone()
        if position_result:
            current_position_id = position_result[0]
        else:
            cursor.execute("INSERT INTO positions (name) VALUES (%s) RETURNING id;", (current_position,))
            current_position_id = cursor.fetchone()[0]

        # Insert employee
        cursor.execute("""
            INSERT INTO employees (name, current_position, past_positions)
            VALUES (%s, %s, %s)
        """, (name, current_position_id, past_positions))
        conn.commit()


def upsert_employee_skills():
    """Insert/Update employee skill arrays in new JSONB-based schema.

    Columns:
      - employee_id (int, PK referencing employees.id)
      - employee_num (text)
      - employee_soft_skills (jsonb array of {id: string, experience: number})
      - employee_hard_skills (jsonb array of {id: string, experience: number})
    """
    query = (
        """
        INSERT INTO employee_skill_experience (
            employee_id, employee_num, employee_soft_skills, employee_hard_skills
        ) VALUES (%s, %s, %s, %s)
        ON CONFLICT (employee_id) DO UPDATE SET
            employee_num = EXCLUDED.employee_num,
            employee_soft_skills = EXCLUDED.employee_soft_skills,
            employee_hard_skills = EXCLUDED.employee_hard_skills
        """
    )

    # Example payload; replace with your generation/loading logic as needed.
    rows = [
        (
            1,
            "E0001",
            Json([
                {"id": "1", "experience": 3},
                {"id": "2", "experience": 3.5},
            ]),
            Json([
                {"id": "10", "experience": 4},
                {"id": "12", "experience": 2},
            ]),
        )
    ]

    cursor.executemany(query, rows)
    conn.commit()


# Insert skills
insert_skills(os.path.join(folder_path, "hard_skills.csv"), "hard_skills")
insert_skills(os.path.join(folder_path, "soft_skills.csv"), "soft_skills")

# Insert positions
insert_positions(os.path.join(folder_path, "positions.csv"))

# Insert employees
insert_employees(os.path.join(folder_path, "employees.csv"))

# Populate employee skills JSONB table (manually or dynamically based on your own rules)
upsert_employee_skills()

# Close connection
cursor.close()
conn.close()

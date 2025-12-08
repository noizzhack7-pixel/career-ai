import os
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

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


def insert_employee_skill_experience():
    """Insert experience for employees on various skills dynamically."""
    query = """
        INSERT INTO employee_skill_experience (employee_id, skill_id, skill_type, experience_level)
        VALUES (%s, %s, %s, %s)
    """
    # Replace with your data
    data = [
        (1, 2, 'hard', 5),  # Example: Employee 1 has 5 years of experience with skill 2 (hard skill)
        (1, 4, 'soft', 3),  # Example: Employee 1 has 3 years of experience with skill 4 (soft skill)
    ]
    cursor.executemany(query, data)
    conn.commit()


# Insert skills
insert_skills(os.path.join(folder_path, "hard_skills.csv"), "hard_skills")
insert_skills(os.path.join(folder_path, "soft_skills.csv"), "soft_skills")

# Insert positions
insert_positions(os.path.join(folder_path, "positions.csv"))

# Insert employees
insert_employees(os.path.join(folder_path, "employees.csv"))

# Populate employee-skill experience table (manually or dynamically based on your own rules)
insert_employee_skill_experience()

# Close connection
cursor.close()
conn.close()

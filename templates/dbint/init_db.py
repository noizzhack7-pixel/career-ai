import os
import psycopg2
from psycopg2 import sql


def get_env(name: str, default: str | None = None) -> str:
    value = os.getenv(name, default)
    if value is None:
        raise RuntimeError(f"Environment variable {name} must be set or provide a default")
    return value


def ensure_database(dbname: str, user: str, password: str, host: str, port: str) -> None:
    """
    Connect to the default 'postgres' database and create the target database if it doesn't exist.
    """
    conn = psycopg2.connect(dbname="postgres", user=user, password=password, host=host, port=port)
    conn.autocommit = True
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
            exists = cur.fetchone() is not None
            if not exists:
                cur.execute(sql.SQL("CREATE DATABASE {} ENCODING 'UTF8' TEMPLATE template1").format(sql.Identifier(dbname)))
    finally:
        conn.close()


def create_schema(dbname: str, user: str, password: str, host: str, port: str) -> None:
    """
    Create tables required by the application if they don't already exist.
    This matches the expectations of templates/dbint/schema.py data loaders.
    """
    conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
    try:
        with conn, conn.cursor() as cur:
            # positions
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS positions (
                    id SERIAL PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL
                );
                """
            )

            # employees
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS employees (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    current_position INTEGER REFERENCES positions(id) ON DELETE SET NULL,
                    past_positions INTEGER[] DEFAULT '{}'
                );
                """
            )

            # skills (hard and soft)
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS hard_skills (
                    id SERIAL PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS soft_skills (
                    id SERIAL PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL
                );
                """
            )

            # employee skills: store soft/hard skills as JSONB arrays of objects
            # Recreate the table to match the new structure
            cur.execute(
                """
                DROP TABLE IF EXISTS employee_skill_experience CASCADE;
                """
            )
            cur.execute(
                """
                CREATE TABLE employee_skill_experience (
                    employee_id INTEGER PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
                    employee_num TEXT,
                    employee_soft_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
                    employee_hard_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
                    -- Basic checks to ensure arrays
                    CHECK (jsonb_typeof(employee_soft_skills) = 'array'),
                    CHECK (jsonb_typeof(employee_hard_skills) = 'array')
                );
                """
            )
    finally:
        conn.close()


def initialize_postgres():
    """
    Entry point to ensure the database exists and the schema is created.

    Configuration is taken from environment variables when present, falling back to defaults:
      - PGHOST (default: localhost)
      - PGPORT (default: 5432)
      - PGUSER (default: your_user)
      - PGPASSWORD (default: your_password)
      - PGDATABASE (target DB name; default: your_database)
    """
    host = get_env("PGHOST", "localhost")
    port = get_env("PGPORT", "5432")
    user = get_env("PGUSER", "your_user")
    password = get_env("PGPASSWORD", "your_password")
    dbname = get_env("PGDATABASE", "your_database")

    ensure_database(dbname, user, password, host, port)
    create_schema(dbname, user, password, host, port)


if __name__ == "__main__":
    initialize_postgres()

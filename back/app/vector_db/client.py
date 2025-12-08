from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional, List, Dict, Any
from app.core.config import settings
import logging


class VectorDBClient:
    """PostgreSQL + pgvector database client for storing and searching vectors"""

    def __init__(self):
        self.database_url = settings.database_url
        self.engine = None
        self.SessionLocal = None

    def connect(self):
        """Connect to PostgreSQL instance and enable pgvector"""
        self.engine = create_engine(self.database_url, pool_pre_ping=True)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

        # Enable pgvector extension (may require elevated privileges on managed DBs like Supabase)
        try:
            with self.engine.connect() as conn:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
                conn.commit()
        except Exception as exc:
            logging.getLogger(__name__).warning(
                "Could not ensure pgvector extension: %s. If you're using Supabase, enable the 'vector' extension in the SQL editor/dashboard.",
                exc,
            )

    def get_session(self) -> Session:
        """Get a new database session"""
        if not self.SessionLocal:
            self.connect()
        return self.SessionLocal()

    def create_table(self, table_name: str, vector_dimensions: int):
        """Create a table for storing vectors with metadata"""
        with self.engine.connect() as conn:
            conn.execute(text(f"""
                CREATE TABLE IF NOT EXISTS {table_name} (
                    id VARCHAR PRIMARY KEY,
                    embedding vector({vector_dimensions}),
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """))
            # Create index for vector similarity search
            conn.execute(text(f"""
                CREATE INDEX IF NOT EXISTS {table_name}_embedding_idx
                ON {table_name}
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100)
            """))
            conn.commit()

    def insert_vectors(self, table_name: str, vectors: List[Dict[str, Any]]):
        """Insert vectors with metadata into table

        Args:
            table_name: Name of the table
            vectors: List of dicts with 'id', 'embedding', and 'metadata' keys
        """
        with self.engine.connect() as conn:
            for vector in vectors:
                conn.execute(text(f"""
                    INSERT INTO {table_name} (id, embedding, metadata)
                    VALUES (:id, :embedding, :metadata)
                    ON CONFLICT (id) DO UPDATE
                    SET embedding = EXCLUDED.embedding,
                        metadata = EXCLUDED.metadata
                """), {
                    "id": vector["id"],
                    "embedding": vector["embedding"],
                    "metadata": vector["metadata"]
                })
            conn.commit()

    def search_similar(self, table_name: str, query_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        """Search for similar vectors using cosine similarity

        Args:
            table_name: Name of the table
            query_vector: Query embedding vector
            limit: Maximum number of results

        Returns:
            List of dicts with 'id', 'metadata', and 'similarity' keys
        """
        with self.engine.connect() as conn:
            result = conn.execute(text(f"""
                SELECT id, metadata,
                       1 - (embedding <=> :query_vector::vector) as similarity
                FROM {table_name}
                ORDER BY embedding <=> :query_vector::vector
                LIMIT :limit
            """), {"query_vector": str(query_vector), "limit": limit})

            return [
                {"id": row[0], "metadata": row[1], "similarity": float(row[2])}
                for row in result
            ]

    def delete_vectors(self, table_name: str, ids: List[str]):
        """Delete vectors by IDs"""
        with self.engine.connect() as conn:
            conn.execute(text(f"""
                DELETE FROM {table_name}
                WHERE id = ANY(:ids)
            """), {"ids": ids})
            conn.commit()

    def delete_table(self, table_name: str):
        """Delete entire table"""
        with self.engine.connect() as conn:
            conn.execute(text(f"DROP TABLE IF EXISTS {table_name} CASCADE"))
            conn.commit()

    def close(self):
        """Close database connection"""
        if self.engine:
            self.engine.dispose()


# Singleton instance
vector_db_client = VectorDBClient()

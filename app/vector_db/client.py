from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from typing import Optional
import os


class VectorDBClient:
    """Qdrant vector database client for storing and searching skill vectors"""

    def __init__(self):
        self.host = os.getenv("QDRANT_HOST", "localhost")
        self.port = int(os.getenv("QDRANT_PORT", "6333"))
        self.client: Optional[QdrantClient] = None

    def connect(self):
        """Connect to Qdrant instance"""
        pass

    def create_collection(self, collection_name: str, vector_size: int):
        """Create a new collection for storing vectors"""
        pass

    def insert_vectors(self, collection_name: str, vectors: list, payloads: list):
        """Insert vectors with metadata into collection"""
        pass

    def search_similar(self, collection_name: str, query_vector: list, limit: int = 10):
        """Search for similar vectors in collection"""
        pass

    def delete_vectors(self, collection_name: str, ids: list):
        """Delete vectors by IDs"""
        pass

    def delete_collection(self, collection_name: str):
        """Delete entire collection"""
        pass


# Singleton instance
vector_db_client = VectorDBClient()

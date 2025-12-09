import os
from pathlib import Path
from typing import Optional

try:
    from supabase import create_client, Client  # type: ignore
except ImportError:  # supabase-py not installed
    create_client = None
    Client = None

try:
    from dotenv import load_dotenv  # type: ignore
except ImportError:
    load_dotenv = None


def get_supabase_client() -> Optional["Client"]:
    """
    Return a shared Supabase client if supabase-py is installed and env vars are set.
    Falls back to None so callers can gracefully use mock/file data.
    """
    global _client
    if "_client" in globals():
        return _client  # type: ignore

    # Load .env once if available (project root: ../.. from /back/app/services)
    if load_dotenv:
        env_path = Path(__file__).resolve().parents[3] / ".env"
        if env_path.exists():
            load_dotenv(env_path)
        else:
            load_dotenv()

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if not create_client:
        print("[supabase] supabase-py not installed; returning None")
        _client = None  # type: ignore
        return _client

    if not url or not key:
        print(f"[supabase] Missing SUPABASE_URL or key (SERVICE_ROLE or ANON); url={bool(url)}, key={bool(key)}")
        _client = None  # type: ignore
        return _client

    try:
        _client = create_client(url, key)  # type: ignore
    except Exception as exc:  # pragma: no cover - defensive
        print(f"[supabase] Failed to init client: {exc}")
        _client = None  # type: ignore

    return _client


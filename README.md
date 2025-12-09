# Career AI

## 🧠 Overview

Career-AI is an intelligent platform for managing and analyzing positions, candidates, skills, and learning paths.

It combines a FastAPI backend, a modern web frontend, Supabase/PostgreSQL (with pgvector) for storage and search, and an LLM-powered recommendation engine (LangChain + OpenAI) to deliver:

It provides:

- RESTful APIs for positions, profiles, employees, and skills
- Vector and relational search (PostgreSQL + pgvector via Supabase)
- Smart matching between candidates and positions (in both directions)
- Skill gap analysis (hard/soft skills, levels, aggregate summaries)
- Learning recommendations based on LLMs (LangChain structured output)
- Data generation utilities for local development

## 📌 API Endpoints

All endpoints are prefixed with `/api/v1` and follow RESTful conventions.

---

## 🏗️ Project Structure

Monorepo layout (key parts):

- backend/ — FastAPI app, routers, models, and services
  - backend/app/main.py — app entrypoint (includes routers)
  - backend/app/api/v1/routers — feature routers (employees, positions, smart, assessment, skills)
  - backend/app/models — Pydantic models
  - backend/app/services — integrations (e.g., Supabase client)
  - backend/data — optional seed/mock data
- client/ and front/ — frontend applications (UI experiments and implementations)
- data_generation/ — scripts to synthesize sample employees and related data
- templates/ — prompt/data templates
- tests/ — automated tests for backend components
- docker-compose.yaml — local services (Postgres with pgvector)
- pyproject.toml — Python project configuration

---

## 🏗️ Architecture

### System Overview

The system centers on matching employees to positions (and vice versa), analyzing skill gaps against role profiles, and providing learning plans to bridge those gaps. Data lives in Supabase (PostgreSQL), enriched with pgvector for similarity/matching. The backend exposes typed REST endpoints and delegates heavy ranking and retrieval to database RPCs and vector search. An LLM is used to produce structured learning recommendations from computed gaps and the available course catalog.

### System Components

- FastAPI backend exposing `/api/v1` routes
- Supabase (PostgreSQL + pgvector) for storage, search, and RPC matching
- Redis, MQ, and workers (optional/for scale-out; see future diagram) for precomputation/caching
- Frontend web clients for exploration and decision support
- LLM provider (OpenAI) via LangChain for structured recommendations

### Data Flow

1. Clients call FastAPI endpoints.
2. Backend loads employees/positions/profiles/courses from Supabase.
3. Matching and scoring are computed via database RPCs and helpers.
4. Skill gaps are computed by comparing candidate vs. profile skills.
5. LLM receives a compact prompt (skills, gaps, course catalog) and returns a structured plan + course IDs.
6. Backend maps course IDs to course objects and returns a final response.

### High-Level System Diagram - Currently

```
┌──────────────────┐        HTTP (JSON)        ┌──────────────────────────┐
│      Client      │ ─────────────────────────▶│        FastAPI API        │
│  (front/client)  │                            │  backend/app (Python)     │
└────────┬─────────┘                            │  /api/v1 routers          │
         │                                      └───────────┬──────────────┘
         │                                                  │
         │                                              Supabase REST/PG
         │                                                  │
         │                                      ┌───────────▼──────────────┐
         │                                      │   Supabase (PostgreSQL)  │
         │                                      │   - tables (JSON/string) │
         │                                      │   - pgvector embeddings  │
         │                                      │   - tsvector full-text   │
         │                                      │   - RPCs (SQL functions) │
         │                                      └───────────┬──────────────┘
         │                                                  │
         │                                  LLM (recommendations)
         │                                                  │
         │                                      ┌───────────▼──────────────┐
         └──────────────────────────────────────│   OpenAI via LangChain   │
                                                └──────────────────────────┘
```

- Current runtime: Client (Next.js/React) calls FastAPI only. The backend calls Supabase for data and calls OpenAI (via LangChain) for learning recommendations. The UI never calls the model directly.
- Local dev: `docker-compose.yaml` provides a Postgres with pgvector as an alternative backend to Supabase if needed.
- No Redis/MQ workers are required at the moment; they are part of a future scale-out plan.

### High-Level System Diagram - Future

```
┌──────────────────┐
│     Client       │
└──────┬───────────┘
       │
┌──────▼──────────┐              ┌──────────▼─────────┐
│  FastAPI        │◄────────────►│   Redis Cluster    │
│  (Multi-inst)   │              │   (Cache Layer)    │
└──────┬──────────┘              └────────────────────┘
       │
       ├───────────────────┐
       │                   │
┌──────▼──────┐    ┌───────▼────────┐
│  Message     │    │  PostgreSQL    │
│  Queue       │    │  Primary +     │
│ (RabbitMQ)   │    │  Read Replicas │
└──────┬───────┘    └────────────────┘
       │
┌──────▼──────────────────┐
│  Skill Calc Workers     │ ← <1 sec per employee
│  (Celery/Distributed)   │ ← Max 1hr batch timeout
└─────────────────────────┘
```

### Architecture Benefits

| Requirement | Solution |
|-------------|----------|
| **<1 sec per employee** | Pre-computed embeddings in Redis + parallel workers + read replicas |
| **Elastic data processing** | Schema-less JSON fields + dynamic Pydantic models + extensible pipeline |
| **<1 hour recalculation** | Message queue with DLQ + Celery retries + batch processing + timeouts |
| **Zero loading time** | Redis cache (>90% hit rate) + prefetching + optimistic UI |
| **99% uptime** | Multi-AZ deployment + auto-scaling + health checks + circuit breakers + DB replication |

---

## 🛠️ Technology Stack

- Python 3.11+, FastAPI, Pydantic v2
- Supabase (PostgreSQL + pgvector), SQL RPCs
- LangChain + OpenAI (structured output) for recommendations
- Frontend: React/Next.js (front) and UI experiments (client)
- Docker and docker-compose for local infra
- pytest for testing

Environment variables (typical):

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (used server-side)
- `OPENAI_API_KEY` — OpenAI API key
- `OPENAI_MODEL` — optional, defaults to `gpt-4o` in code (or `gpt-4o-mini` in earlier versions)

Example `.env` (do not commit secrets):

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```

Docker-compose provides a local Postgres with pgvector (if you do not use Supabase during development). For production, use Supabase.

## 🖥️ UI Functionality (front/client)

Two UI codebases exist in this repo:
- `front/` — main Next.js/React application (app router under `front/src/app`).
- `client/` — UI experiments/components (e.g., dashboard, questionnaire) that inform the main app.

Key features (based on current folders and backend endpoints):
- Navigation and layout
  - Sidebar navigation (`client/src/components/Sidebar`) and shared header/dropdowns in `front/src/app/shared/*`.
- Home/Dashboard
  - Overview pages under `front/src/app/home` and `client/src/components/dashboard` for quick access to positions and personal profile.
- Positions
  - Positions listing and details in `front/src/app/positions`.
  - Integrates with backend routes like `/api/v1/positions`, `/api/v1/smart/positions/top`, and `/api/v1/smart/positions/similar` to show best matches and similar roles.
- Profile (Employee)
  - `front/src/app/profile` shows the current employee summary, skills, and suggested positions.
  - Uses `/api/v1/employees/me` (or similar) and smart endpoints for personalized recommendations.
- Questionnaire / Assessment
  - `front/src/app/questionnaire` and `client/src/components/questionnaire` collect or refine user skills/preferences.
  - Sends data to assessment/skills endpoints to update stored skills.
- Skill Gaps
  - Calls `/api/v1/smart/gaps` to visualize hard/soft skill gaps between the employee and selected position profiles.
- Learning Recommendations
  - Triggers `/api/v1/smart/learning_recommendations` to generate an L&D plan and recommended courses, then renders plan text and selected course cards.

State and services:
- Data-fetching helpers live under `front/src/app/services` and global stores under `front/src/app/stores` (with models in `front/src/app/stores/models`).
- Shared UI primitives/components under `client/src/components/ui` and `front/src/app/shared/*` ensure consistent styling and UX.

## 🚀 Quick Start

Prerequisites:
- Python 3.11+
- Node 18+ (for frontends)
- An OpenAI API key (for learning recommendations)
- Supabase project (recommended) or local Postgres (docker-compose)

1) Clone and configure

```
git clone <this-repo>
cd career-ai
cp .env.example .env   # if provided; otherwise create .env per above
```

2) Backend — install and run

Using pip:

```
pip install -U pip
pip install -e .
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 5000
```

Or using uv (optional):

```
pip install -U uv
uv sync
uv run uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 5000
```

API is now available at:
- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

3) Frontend (optional; if you plan to run the `front/` app):

```
cd front
npm install
npm run dev
```

4) Local Postgres (optional):

```
docker compose up -d postgres
```

Then set `DATABASE_URL`/Supabase variables appropriately and create the necessary tables.

## 📚 API Overview and Examples

Base URL: `http://localhost:5000/api/v1`

Routers included:
- `positions` — CRUD and matching mock data
- `employees` — employee profiles and current employee endpoint
- `smart` — matching, gaps, and learning recommendations
- `assessment` — assessment-related endpoints
- `skills` — skills endpoints

Examples:

1) Top candidates for a position

```
GET /api/v1/smart/candidates/top?position_id=70000501&limit=5
```

2) Similar candidates to a given employee

```
GET /api/v1/smart/candidates/similar?candidate_id=12345&limit=5
```

3) Top positions for a candidate

```
GET /api/v1/smart/positions/top?candidate_id=12345&limit=5
```

4) Similar positions to a given position

```
GET /api/v1/smart/positions/similar?position_id=70000501&limit=5
```

5) Skill gap analysis (candidate vs. all profiles of a position)

```
GET /api/v1/smart/gaps?candidate_id=12345&position_id=70000501
```

6) Learning recommendations (LLM-powered)

```
POST /api/v1/smart/learning_recommendations?employee_number=12345&profile_id=42
```

Response (shape):

```
{
  "plan": "...",              // textual learning plan (Hebrew in current prompt)
  "courses": [                 // selected courses mapped by ID
    { "id": 101, "name": "...", "description": "..."}
  ]
}
```

Notes:
- Make sure `OPENAI_API_KEY` is set. If dependencies are missing, the endpoint returns 500 with a helpful message.
- Courses are read from `courses` table in Supabase (fields: `id`, `course_name`, `course_description`).

## 🧮 Matching and Skill Gaps

### Matching algorithm (pgvector + full-text + metadata)

The database schema and matching logic combine three signals:

1) Vector similarity on embeddings
- Column: `embedding extensions.vector(1536)` (pgvector)
- Represents dense semantic embedding of a candidate/profile/position description and skills.
- Typical similarity: inner product or cosine distance. Higher is better for inner product; lower is better for Euclidean/cosine distance.

2) Full-text relevance
- Column: `fulltext tsvector`
- Built from concatenated string fields (e.g., title, description, enumerated skills) using `to_tsvector`.
- Ranked with `ts_rank_cd(fulltext, to_tsquery/plainto_tsquery(...))`.

3) String/metadata filters
- Columns: plain strings/JSON (e.g., `position_name`, `profile_name`, `division`, `location`, `work_model`).
- Used for exact/ILIKE filters, boosting, or tie-breakers.

Scoring and normalization:
- An RPC computes a weighted score, conceptually: `score_raw = w_vec*vec_sim + w_ft*ft_rank + w_meta*meta_bonus`.
- The backend normalizes returned `score` values to 0–100 (min–max) before responding, preserving order while standardizing the scale.

Example schema snippet:
```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Positions or profiles table (illustrative)
CREATE TABLE profiles (
  profile_id      bigint primary key,
  position_id     bigint,
  profile_name    text,
  position_name   text,
  description     text,
  hard_skills     jsonb,
  soft_skills     jsonb,
  embedding       vector(1536),   -- pgvector
  fulltext        tsvector        -- full-text index
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_embedding ON profiles USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_fulltext  ON profiles USING gin(fulltext);
```

Example query fragment (illustrative; actual logic resides in Supabase RPCs referenced by the API):
```sql
WITH q AS (
  SELECT 
    p.profile_id,
    1 - (p.embedding <=> :candidate_embedding)     AS vec_sim,     -- cosine similarity
    ts_rank_cd(p.fulltext, plainto_tsquery(:qtext)) AS ft_rank,
    (CASE WHEN p.position_name ILIKE :preferred THEN 0.05 ELSE 0 END) AS meta_bonus
  FROM profiles p
  WHERE p.position_name ILIKE :filter
)
SELECT profile_id,
       (0.7*vec_sim + 0.25*ft_rank + 0.05*meta_bonus) AS score
FROM q
ORDER BY score DESC
LIMIT :limit;
```

API mapping:
- `/api/v1/smart/candidates/top` → RPC `match_candidates_for_position`
- `/api/v1/smart/candidates/similar` → RPC `match_similar_candidates`
- `/api/v1/smart/positions/top` → RPC `match_positions_for_candidate`
- `/api/v1/smart/positions/similar` → RPC `match_similar_positions`

The backend utilities in `smart.py` then enrich results with profile/position details, and apply min–max normalization to 0–100.

#### How `match_candidates_for_position` works (SQL walk‑through)

This RPC finds the best matching profile (within a given position) for each candidate and returns the top candidates overall. The core of the function looks like this:

```sql
WITH profs AS (
  -- all profiles for this position
  SELECT profile_id, profile_name, position_name, embedding
  FROM profiles
  WHERE position_id = p_position_id
    AND embedding IS NOT NULL
),
scored AS (
  -- compute similarity for EACH (candidate, profile)
  SELECT
    e.employee_number AS candidate_id,
    e.first_name,
    e.last_name,
    p.profile_id,
    p.profile_name,
    p.position_name,
    1 - (e.embedding <#> p.embedding) AS score,
    ROW_NUMBER() OVER (
      PARTITION BY e.employee_number
      ORDER BY e.embedding <#> p.embedding
    ) AS rn
  FROM structured_employees e
  JOIN profs p ON true
  WHERE e.embedding IS NOT NULL
)
SELECT
  candidate_id,
  first_name,
  last_name,
  profile_id,
  profile_name,
  position_name,
  score
FROM scored
WHERE rn = 1                -- best profile for each candidate
ORDER BY score DESC
LIMIT p_limit;
```

Key points and implications:

- Candidate/profile candidate set:
  - `profs` first filters to all profiles that belong to the requested `p_position_id` and have non‑null embeddings.
  - `structured_employees` is filtered to candidates with non‑null embeddings.
  - `JOIN profs p ON true` forms a Cartesian product between the filtered candidates and the relevant profiles for that position so each pair can be scored.

- Similarity metric with pgvector:
  - The operator `<#>` is pgvector’s inner‑product distance. Lower is better (smaller distance).
  - The query converts distance to a higher‑is‑better similarity via `1 - (e.embedding <#> p.embedding)` and stores it in `score`.
  - Operationally, this makes `score` intuitive: larger means more similar.

- Pick the best profile per candidate:
  - `ROW_NUMBER() OVER (PARTITION BY e.employee_number ORDER BY e.embedding <#> p.embedding)` ranks, per candidate, all profiles by increasing distance (i.e., best first).
  - `WHERE rn = 1` keeps only the top profile for each candidate, ensuring a single profile context is associated with that candidate in the result.

- Final ordering and limiting:
  - After reducing to one row per candidate, the result is ordered by the similarity `score` descending and constrained by `p_limit`.

- Result shape and API mapping:
  - The RPC returns: `candidate_id, first_name, last_name, profile_id, profile_name, position_name, score`.
  - The backend endpoint `/api/v1/smart/candidates/top` consumes these rows, enriches with full profile details (including skills/description), and normalizes `score` with min–max to a 0–100 scale for consistent UI display while preserving order.

- Indexing and performance considerations:
  - Ensure an IVFFlat index exists on `structured_employees.embedding` and `profiles.embedding` with the appropriate operator class (e.g., `vector_cosine_ops` for cosine). When using inner‑product metrics, choose the corresponding operator class.
  - Keep `embedding IS NOT NULL` filters to avoid runtime errors and wasted work.
  - If the number of profiles per position is large, consider pre‑restricting candidates (e.g., by department/location) or using ANN search on one side to cut down the Cartesian product size.

- Practical outcome:
  - For each candidate, only the strongest profile under the given position is considered in ranking. This aligns with the UI, which presents a single “best‑fit” profile context per candidate for that position.

### Skill representation and gap computation

Skill representation:
- Hard/soft skills are arrays of `{ "skill": str, "level": int }`.
- Parsed into dicts like `{ "python": 3 }` (lowercased keys).

Gap computation (for each required skill):
- `gap = required_level - candidate_level`
- Status mapping:
  - `gap <= -1` → `strength`
  - `gap == 0` → `meet`
  - `1 <= gap <= 2` → `upskill`
  - `gap >= 3` or missing skill → `missing`

Normalization of scores:
- When ranking results (from RPCs), scores are min–max normalized to 0–100 to preserve order.

Data sources (Supabase):
- `positions`, `profiles` (profile includes required skills), `structured_employees` (candidate skills), `courses` (catalog).

## 🧪 Testing

Run backend tests:

```
pytest -q
```

You can also run specific test files from the `tests/` directory.

## 🧰 Data Generation

Utilities for generating demo data:
- `data_generation.py` — entry point
- `data_generation/` — modules like `employees_generation.py`
- `initial_code/datagen.py` — initial examples

Use these scripts to create realistic employees and profiles for demos.

## ⚙️ Deployment

- Dockerfile included for containerizing the backend.
- `docker-compose.yaml` includes a Postgres (pgvector) service. You may introduce a `web` service to run the API in containers; update ports accordingly.
- Configure environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`) in your deployment environment.

## 🩺 Troubleshooting

- 500 on `/smart/learning_recommendations`: ensure `OPENAI_API_KEY` is set and LangChain + OpenAI packages are installed.
- Empty matches: ensure Supabase tables are populated and RPCs exist as expected.
- CORS errors from frontend: update `allow_origins` in `backend/app/main.py` to include your frontend URL.
- Port conflicts: backend defaults to port 5000 in dev commands.

## 🗺️ Roadmap

- Add full CRUD for employees/positions
- Production-grade vector search with embeddings pipeline
- Background workers for precomputation and cache warming
- Richer course catalog with providers and prerequisites
- Authentication/authorization and multi-tenant support

## 📄 License

TBD — add a license file appropriate for your project.

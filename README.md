# Career AI

Career-AI is a FastAPI + Angular project for managing positions, candidates, and skills, with vector-based matching and gap analysis.

## Why this README changed

We want a clearer plan before refactoring. This document now captures:
- Current state and duplication we need to fix.
- Target repository layout.
- Refactor steps and order.
- How to run things today (before refactor).

## Current state (Dec 2025)
- Two copies of the app: one at repo root and one under `career-ai/` (each with `back/`, `front/`, Docker files, tests, and data). We should keep one and delete the duplicate.
- Backend: FastAPI service in `back/app` with routers for candidates, positions, skills, and AI matching.
- Frontend: Angular app in `front/`.
- Infra: Dockerfile and docker-compose at both root and `career-ai/` level.
- Data/demo assets: `initial_code/`, `templates/`, `tests/data_generation.py`.

## Refactor goals
- Single source of truth: remove duplicated project tree, keep one canonical layout.
- Rename directories for clarity: `back` → `backend`, `front` → `frontend`.
- Standardize configs: `.env.example`, consistent `docker-compose.yml`/`Dockerfile`, shared `.env` loading.
- Simplify dev UX: clear make/uv scripts, single entrypoints for API/UI.
- Testing + quality: pytest baseline, lint/type checks, sample data seeding.
- Documentation: keep API snapshot here, move deep docs to `/docs`.

## Target repository layout

```
career-ai/
├── backend/             # FastAPI app (current `back/app`)
│   └── app/
│       ├── api/v1/routers/*.py
│       ├── services/
│       ├── models/
│       ├── vector_db/
│       └── core/
├── frontend/            # Angular app (current `front/`)
│   └── src/app/...
├── infra/               # Docker, compose, env templates
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── .env.example
├── data/                # Seeds/fixtures
├── tests/               # Pytest suite
├── scripts/             # Local tools (seed, lint, format)
├── docs/                # Deeper architecture/API docs
└── README.md
```

## Refactor plan (order of operations)
1) Pick canonical root (suggest: current root) and delete the duplicate `career-ai/` tree.
2) Rename `back` → `backend`, `front` → `frontend`; update imports, Docker paths, and docs accordingly.
3) Consolidate infra: single `infra/docker-compose.yml`, `Dockerfile.backend`, `Dockerfile.frontend`, and `.env.example`.
4) Add developer scripts: `uv run lint`, `uv run test`, `npm run lint`, `npm run test`, optional `make` shortcuts.
5) Stabilize backend structure: ensure `app/main.py` uses settings from `.env`, align routers/services/models naming, and add type/lint checks.
6) Stabilize frontend: update API base URL config, ensure shared store/services folder naming.
7) Testing + data: keep seeds in `data/`, ensure tests load from there, and wire CI entrypoints.

## Quick start (current layout, before refactor)

Prerequisites: Python 3.13+, Docker & Docker Compose, Node 18+ (for frontend).

```bash
# Install backend deps (from repo root)
pip install -e .

# Run API locally (current paths)
uvicorn app.main:app --app-dir back --reload

# Or run via Docker Compose (current root compose)
docker-compose up
```

API docs: http://localhost:8000/docs  
Swagger prefix: `/api/v1`

### Frontend (current layout)
```bash
cd front
npm install
npm start
# App defaults to http://localhost:4200
```

## API snapshot (v1)
All endpoints are prefixed with `/api/v1`.

### Candidates
| Method | Route               | Body              | Returns           | Description               |
|--------|---------------------|-------------------|-------------------|---------------------------|
| POST   | `/candidates/`      | `Candidate`       | `Candidate`       | Create a candidate        |
| POST   | `/candidates/batch` | `List[Candidate]` | `List[Candidate]` | Create multiple           |
| GET    | `/candidates/`      | —                 | `List[Candidate]` | List all                  |
| GET    | `/candidates/{id}`  | —                 | `Candidate`       | Get by ID                 |
| PUT    | `/candidates/{id}`  | `Candidate`       | `Candidate`       | Update                    |
| DELETE | `/candidates/{id}`  | —                 | —                 | Delete                    |
| DELETE | `/candidates/`      | —                 | —                 | Delete all                |

### Positions
| Method | Route               | Body             | Returns          | Description               |
|--------|---------------------|------------------|------------------|---------------------------|
| POST   | `/positions/`       | `Position`       | `Position`       | Create a position         |
| POST   | `/positions/batch`  | `List[Position]` | `List[Position]` | Create multiple           |
| GET    | `/positions/`       | —                | `List[Position]` | List all                  |
| GET    | `/positions/{id}`   | —                | `Position`       | Get by ID                 |
| PUT    | `/positions/{id}`   | `Position`       | `Position`       | Update                    |
| DELETE | `/positions/{id}`   | —                | —                | Delete                    |
| DELETE | `/positions/`       | —                | —                | Delete all                |

### Skills
| Method | Route              | Body        | Returns           | Description               |
|--------|--------------------|-------------|-------------------|---------------------------|
| POST   | `/skills/hard`     | `HardSkill` | `HardSkill`       | Create hard skill         |
| POST   | `/skills/soft`     | `SoftSkill` | `SoftSkill`       | Create soft skill         |
| GET    | `/skills/hard`     | —           | `List[HardSkill]` | List hard skills          |
| GET    | `/skills/soft`     | —           | `List[SoftSkill]` | List soft skills          |
| GET    | `/skills/hard/{id}`| —           | `HardSkill`       | Get hard skill            |
| GET    | `/skills/soft/{id}`| —           | `SoftSkill`       | Get soft skill            |
| DELETE | `/skills/hard/{id}`| —           | —                 | Delete hard skill         |
| DELETE | `/skills/soft/{id}`| —           | —                 | Delete soft skill         |
| DELETE | `/skills/`         | —           | —                 | Delete all skills         |

### Smart (AI-powered matching)
| Method | Route                        | Params/Body                   | Returns             | Description                     |
|--------|------------------------------|-------------------------------|---------------------|---------------------------------|
| POST   | `/smart/candidates/ingest`   | Body: `Candidate`             | Confirmation        | Add candidate                   |
| POST   | `/smart/positions/ingest`    | Body: `Position`              | Confirmation        | Add position                    |
| GET    | `/smart/candidates/top`      | `position_id`, `limit=10`     | `List[MatchResult]` | Top candidates for a position   |
| GET    | `/smart/candidates/similar`  | `candidate_id`, `limit=10`    | `List[MatchResult]` | Similar candidates              |
| GET    | `/smart/positions/top`       | `candidate_id`, `limit=10`    | `List[MatchResult]` | Top positions for a candidate   |
| GET    | `/smart/positions/similar`   | `position_id`, `limit=10`     | `List[MatchResult]` | Similar positions               |
| GET    | `/smart/gaps`                | `candidate_id`, `position_id` | `SkillGapResponse`  | Skill gap analysis              |
| GET    | `/smart/health`              | —                             | Health status       | Health check                    |

Sample `MatchResult`:
```json
{
  "id": "candidate-123",
  "name": "John Doe",
  "score": 0.87,
  "semantic_similarity": 0.90,
  "skill_match": 0.82,
  "details": {
    "explanation": "Strong match based on technical skills",
    "matching_skills": ["Python Programming", "SQL"],
    "category_match": true
  }
}
```

Sample `SkillGapResponse`:
```json
{
  "readiness_score": 85.0,
  "summary": {
    "total_skills_required": 7,
    "skills_met": 5,
    "critical_gaps": 1,
    "moderate_gaps": 0,
    "minor_gaps": 1
  },
  "recommendations": [
    {
      "priority": "high",
      "message": "Focus on developing 1 critical skill(s)",
      "skills": ["Cloud Services"]
    }
  ]
}
```

## Architecture (snapshot)
- FastAPI service with routers for CRUD and AI matching.
- Vector search via PostgreSQL + pgvector; embeddings via sentence-transformers (`all-MiniLM-L6-v2`).
- Optional queue + workers for recalculation; Redis cache for embeddings/results.
- Monitoring target: Prometheus/Grafana + ELK; retries/circuit breakers for resilience.

Data flow (conceptual):
- Create/ingest: Client → FastAPI → Ingestion → Queue → Worker → Vectorization → PostgreSQL + Redis.
- Matching: Client → FastAPI → Redis cache (hit) or PostgreSQL (miss).
- Gap analysis: Client → FastAPI → Redis → PostgreSQL read replica → vector compare.

## Technology stack
- Python 3.13+, FastAPI 0.116+, Pydantic, SQLAlchemy 2.0, pgvector 0.2.4+
- Embeddings: Sentence Transformers `all-MiniLM-L6-v2` (384-d)
- Server: Uvicorn
- Frontend: Angular (Node 18+)
- Containers: Docker, Docker Compose
- Tests: Pytest

Matching score (current design):
```
final_score = (
    semantic_similarity * 0.60 +
    skill_match * 0.30 +
    category_bonus * 0.10
)
```

## Data models (conceptual)
- Candidate: `name`, `candidate_id`, `current_position`, `past_positions`, `hard_skills`, `soft_skills`
- Position: `id`, `name`, `category`, `profiles`
- Profile: `id`, `name`, `hard_skills`, `soft_skills`
- Skill: `id`, `skill`, `level` (1.0–5.0, beginner → expert)

## Configuration
Environment variables (via `.env` or compose):
```
APP_NAME=Career AI
APP_VERSION=1.0.0
DEBUG=false
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret
DB_NAME=career_ai
DATABASE_URL=postgresql://admin:secret@localhost:5432/career_ai
VECTOR_DIMENSIONS=384
API_V1_PREFIX=/api/v1
```

## Development workflow (current)
- Backend tests: `pytest`
- Run API with reload: `uvicorn app.main:app --app-dir back --reload`
- Docker (current root compose): `docker-compose up --build` / `docker-compose down`
- Manual API checks:
  - Health: `curl http://localhost:8000/api/v1/smart/health`
  - Ingest candidate: `curl -X POST http://localhost:8000/api/v1/smart/candidates/ingest ...`
  - Gap analysis: `curl "http://localhost:8000/api/v1/smart/gaps?candidate_id=...&position_id=..." `

## Next steps
1) Confirm we will keep the root copy and delete `career-ai/` duplicate.
2) Rename folders to `backend/` and `frontend/` and update paths in code, Docker, and docs.
3) Move Docker/compose/env templates under `infra/` and adjust commands in this README.
4) Add `.env.example` and minimal `make`/`uv` scripts for lint/test/run.
5) Add/align tests and data seeds under `tests/` and `data/`.

## License
Provided as-is for educational and development purposes.

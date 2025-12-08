# Career AI

## 🧠 Overview

**Career-AI** is an intelligent backend service for managing and analyzing **positions**, **candidates**, and **skills** using FastAPI and vector embeddings.

It provides:

- RESTful API for managing positions, candidates, and skills
- Vector-based similarity search using PostgreSQL with pgvector
- Smart matching between candidates and positions
- Skill gap analysis
- Type-safe models with Pydantic validation

---

## 🚀 Quick Start

### Prerequisites

- Python 3.13+
- Docker & Docker Compose

### Installation

```bash
# Install dependencies (run from repo root)
pip install -e .

# Run with Docker Compose (from repo root)
docker-compose up

# Or run locally (from repo root)
uvicorn app.main:app --app-dir back --reload
```

The API will be available at `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

---

## ☁️ Use Supabase (managed Postgres) — recommended

You can run the API locally and connect it to a managed Postgres (Supabase). This avoids running a local Postgres via Docker and works well for collaboration.

### 1) Set up Supabase
- Create a Supabase project at https://supabase.com
- In SQL Editor → enable the `vector` extension:
  ```sql
  create extension if not exists vector;
  ```
- Copy the full connection string (Database → Connection string → URI). It looks like:
  `postgresql://USER:PASSWORD@HOST:6543/postgres?sslmode=require`

### 2) Configure the app
- Create a `.env` file in the project root with at least:
  ```env
  SUPABASE_DB_URL=postgresql://USER:PASSWORD@HOST:6543/postgres?sslmode=require
  # Optional
  # OPENAI_API_KEY=...
  ```

Notes
- The backend prefers `SUPABASE_DB_URL` when present and automatically appends `sslmode=require` if missing.
- If you still use `DATABASE_URL`, it will be used when `SUPABASE_DB_URL` is not set.

### 3) Initialize the schema on Supabase
Run the initializer once to create the required tables.

```bash
python templates/dbint/init_db.py
```

What it does
- Creates `positions`, `employees`, `hard_skills`, `soft_skills`, and `employee_skill_experience` if they don’t exist. On managed services, it will not attempt to create the database itself.

Optional: seed demo data
- The CSV-based seeder reads connection settings from the same env and uses relative paths. Run:
  ```bash
  python templates/dbint/schema.py
  ```

### 4) Run the API locally
```bash
uvicorn app.main:app --app-dir back --host 0.0.0.0 --port 8000 --reload
```

- API docs: http://localhost:8000/docs

---

## 🐳 Run with Docker Desktop

1) Prerequisites
- Install Docker Desktop and ensure it’s running.
- Ensure no other services are using ports 8000 (API) or 5432 (Postgres).

2) Start the stack from the project root
```bash
# Build images and start containers
docker compose up --build

# Or run in background
docker compose up --build -d
```

What starts:
- Backend API container (FastAPI) exposed at `http://localhost:8000`.
- PostgreSQL with pgvector on `localhost:5432` (user: `admin`, password: `secret`, db: `career_ai`).
- Persistent Docker volume `postgres_data` for the database.

3) Verify
- Open API docs: `http://localhost:8000/docs`
- Logs:
  - All: `docker compose logs -f`
  - Web only: `docker compose logs -f web`
  - DB only: `docker compose logs -f postgres`

4) Stop and clean up
```bash
# Stop containers, keep volumes
docker compose down

# Stop and remove containers + volumes (fresh DB next run)
docker compose down -v
```

5) Changing ports or credentials
- Edit `docker-compose.yaml` port mappings or environment variables and rerun with `--build`.

Notes
- The Angular frontend in `front/` is not containerized by default; run it separately with Node if needed.
- The Dockerfile uses `uv` to install Python dependencies according to `pyproject.toml` (lock optional).
- If you are using Supabase instead of Docker Postgres, you can still run only the `web` container by passing `SUPABASE_DB_URL` as an environment variable or via `.env` and removing the `postgres` service from `docker-compose.yaml`.

---

## 📌 API Endpoints

All endpoints are prefixed with `/api/v1` and follow RESTful conventions.

### `/api/v1/candidates`

| Method | Route                    | Body              | Returns           | Description                    |
|--------|--------------------------|-------------------|-------------------|--------------------------------|
| POST   | `/candidates/`           | `Candidate`       | `Candidate`       | Create a single candidate      |
| POST   | `/candidates/batch`      | `List[Candidate]` | `List[Candidate]` | Create multiple candidates     |
| GET    | `/candidates/`           | —                 | `List[Candidate]` | Get all candidates             |
| GET    | `/candidates/{id}`       | —                 | `Candidate`       | Get candidate by ID            |
| PUT    | `/candidates/{id}`       | `Candidate`       | `Candidate`       | Update candidate               |
| DELETE | `/candidates/{id}`       | —                 | —                 | Delete candidate               |
| DELETE | `/candidates/`           | —                 | —                 | Delete all candidates          |

---

### `/api/v1/positions`

| Method | Route                    | Body              | Returns          | Description                    |
|--------|--------------------------|-------------------|------------------|--------------------------------|
| POST   | `/positions/`            | `Position`        | `Position`       | Create a single position       |
| POST   | `/positions/batch`       | `List[Position]`  | `List[Position]` | Create multiple positions      |
| GET    | `/positions/`            | —                 | `List[Position]` | Get all positions              |
| GET    | `/positions/{id}`        | —                 | `Position`       | Get position by ID             |
| PUT    | `/positions/{id}`        | `Position`        | `Position`       | Update position                |
| DELETE | `/positions/{id}`        | —                 | —                | Delete position                |
| DELETE | `/positions/`            | —                 | —                | Delete all positions           |

---

### `/api/v1/skills`

| Method | Route                    | Body         | Returns           | Description                    |
|--------|--------------------------|--------------|-------------------|--------------------------------|
| POST   | `/skills/hard`           | `HardSkill`  | `HardSkill`       | Create a hard skill            |
| POST   | `/skills/soft`           | `SoftSkill`  | `SoftSkill`       | Create a soft skill            |
| GET    | `/skills/hard`           | —            | `List[HardSkill]` | Get all hard skills            |
| GET    | `/skills/soft`           | —            | `List[SoftSkill]` | Get all soft skills            |
| GET    | `/skills/hard/{id}`      | —            | `HardSkill`       | Get hard skill by ID           |
| GET    | `/skills/soft/{id}`      | —            | `SoftSkill`       | Get soft skill by ID           |
| DELETE | `/skills/hard/{id}`      | —            | —                 | Delete hard skill              |
| DELETE | `/skills/soft/{id}`      | —            | —                 | Delete soft skill              |
| DELETE | `/skills/`               | —            | —                 | Delete all skills              |

---

### `/api/v1/smart` (AI-Powered Matching)

| Method | Route                        | Parameters                        | Returns                | Description                              |
|--------|------------------------------|-----------------------------------|------------------------|------------------------------------------|
| POST   | `/smart/candidates/ingest`   | Body: `Candidate`                 | Confirmation           | Add candidate to system                  |
| POST   | `/smart/positions/ingest`    | Body: `Position`                  | Confirmation           | Add position to system                   |
| GET    | `/smart/candidates/top`      | `position_id`, `limit=10`         | `List[MatchResult]`    | Top candidates for a position            |
| GET    | `/smart/candidates/similar`  | `candidate_id`, `limit=10`        | `List[MatchResult]`    | Similar candidates                       |
| GET    | `/smart/positions/top`       | `candidate_id`, `limit=10`        | `List[MatchResult]`    | Top positions for a candidate            |
| GET    | `/smart/positions/similar`   | `position_id`, `limit=10`         | `List[MatchResult]`    | Similar positions                        |
| GET    | `/smart/gaps`                | `candidate_id`, `position_id`     | `SkillGapResponse`     | Comprehensive skill gap analysis         |
| GET    | `/smart/health`              | —                                 | Health status          | Service health check                     |

**MatchResult Response:**
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

**SkillGapResponse:**
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

---

## 🏗️ Project Structure

```
career-ai/
├── back/
│   └── app/
│       ├── __init__.py
│       ├── main.py                 # FastAPI application entry point
│       ├── api/
│       │   └── v1/
│       │       ├── __init__.py
│       │       └── routers/
│       │           ├── candidates.py    # Candidate endpoints
│       │           ├── positions.py     # Position endpoints
│       │           ├── skills.py        # Skills endpoints
│       │           └── smart.py         # AI matching endpoints
│       ├── models/
│       │   ├── BaseValues.py       # Enums and base types
│       │   ├── Candidate.py        # Candidate model
│       │   ├── Position.py         # Position model
│       │   ├── Profile.py          # Profile model
│       │   └── Skill.py            # Skill models
│       ├── services/
│       │   ├── ingestion.py        # Data ingestion service
│       │   ├── vectorization.py    # Embedding generation
│       │   └── matching.py         # Matching algorithms
│       ├── vector_db/
│       │   └── client.py           # PostgreSQL + pgvector client
│       └── core/
│           └── config.py           # Configuration settings
├── initial_code/                   # Demo assets & scripts
├── tests/                          # Test utilities
├── Dockerfile
├── docker-compose.yaml
├── pyproject.toml
├── uv.lock
├── .env (optional)
└── README.md
```

---

## 🏗️ Architecture

### System Overview

**Career-AI** uses an **event-driven microservices architecture** with caching and message queues to meet demanding non-functional requirements:

- ⚡ **<1 second** per employee skill recalculation
- 🔄 **Elastic processing** for structured/unstructured data
- ⏱️ **<1 hour** total recalculation with retry logic
- 🚀 **Zero loading time** in UI
- 💪 **99% uptime** SLA

### System Components

1. **Service Layer** (Horizontally Scalable)
   - **Core API Service** (FastAPI) - stateless, multiple instances
   - **Skill Calculation Worker Service** - dedicated async workers
   - **Ingestion Service** - data validation & preprocessing

2. **Message Queue** (RabbitMQ/AWS SQS)
   - Async skill recalculation jobs
   - Dead letter queue for failed jobs (retry logic)
   - Priority queues (critical vs batch operations)

3. **Cache Layer** (Redis Cluster)
   - Calculated embeddings (TTL: 24h)
   - Frequently accessed candidate/position data
   - Match results cache
   - Session/UI state cache

4. **Database Layer**
   - **PostgreSQL Primary** (write operations) with read replicas
   - **pgvector** for embeddings
   - Connection pooling (PgBouncer)

5. **Background Job Processor** (Celery/Bull)
   - Distributed task queue
   - Automatic retries with exponential backoff
   - Job status tracking
   - Max 1 hour timeout per recalculation batch

6. **Monitoring & Health Checks**
   - Prometheus + Grafana
   - ELK Stack for logging
   - Circuit breakers (handle failures gracefully)

### Data Flow

- **Candidate/Position Creation:** Client → FastAPI → Ingestion → Queue → Worker → Vectorization → PostgreSQL + Redis Cache
- **Smart Matching:** Client → FastAPI → Redis (cache hit) OR PostgreSQL Read Replica (cache miss) → Response
- **Skill Gap Analysis:** Client → FastAPI → Redis Cache → PostgreSQL Read Replica → Compare vectors → Gap calculation
- **Async Recalculation:** Queue → Celery Workers → Parallel Processing → PostgreSQL + Cache Update → Retry on Failure

### High-Level System Diagram

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

- **Framework:** FastAPI 0.116+
- **Language:** Python 3.13+
- **Validation:** Pydantic with type hints
- **Database:** PostgreSQL 16 with pgvector extension
- **ORM:** SQLAlchemy 2.0+
- **Vector Operations:** pgvector 0.2.4+
- **ML Embeddings:** Sentence Transformers 2.2+ (`all-MiniLM-L6-v2`)
- **ML Backend:** PyTorch 2.0+
- **Server:** Uvicorn
- **Containerization:** Docker & Docker Compose
- **Testing:** Pytest

### Vectorization Approach

**Hybrid Strategy (Option 3):**
- **Semantic Embeddings (70%)**: Using Sentence Transformers model `all-MiniLM-L6-v2`
  - 384-dimensional vectors
  - Captures semantic meaning of skills and experience
  - Understands skill relationships (e.g., "Python developer" ≈ "Python engineer")
- **Structured Features (30%)**: Numeric skill statistics
  - Exact skill level matching
  - 80% threshold for skill requirements
  - Category matching bonus

**Matching Score Formula:**
```
final_score = (
    semantic_similarity × 0.60 +    # Cosine similarity from embeddings
    skill_match × 0.30 +             # Exact skill overlap percentage
    category_bonus × 0.10            # Same category = 1.0, different = 0.5
)
```

---

## 📦 Data Models

### Candidate

```python
{
  "name": "John Doe",
  "candidate_id": "uuid-generated",
  "current_position": "Position",
  "past_positions": ["Position"],
  "hard_skills": ["HardSkill"],
  "soft_skills": ["SoftSkill"]
}
```

### Position

```python
{
  "name": "Backend Developer",
  "id": "uuid-generated",
  "category": "Tech",  # Tech, HR, Business, Finance, Law, Other
  "profiles": ["Profile"]  # List of skill profiles
}
```

### Profile

```python
{
  "id": "uuid-generated",
  "name": "Senior Backend Engineer Profile",
  "hard_skills": ["HardSkill"],
  "soft_skills": ["SoftSkill"]
}
```

### Skills

```python
# HardSkill
{
  "skill": "Python Programming",  # from HardSkills enum
  "level": 4.5,                   # 1.0-5.0 range
  "id": "uuid-generated"
}

# SoftSkill
{
  "skill": "Communication",  # from SoftSkills enum
  "level": 4.0,              # 1.0-5.0 range
  "id": "uuid-generated"
}
```

**Skill Level Scale:**
- **1.0-2.0**: Beginner level
- **2.0-3.0**: Basic level
- **3.0-4.0**: Intermediate level
- **4.0-4.5**: Advanced level
- **4.5-5.0**: Expert level

---

## 🔧 Configuration

Environment variables (configured in `.env` or `docker-compose.yaml`):

```env
# Application
APP_NAME=Career AI
APP_VERSION=1.0.0
DEBUG=false

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret
DB_NAME=career_ai
DATABASE_URL=postgresql://admin:secret@localhost:5432/career_ai

# Vector Settings
VECTOR_DIMENSIONS=384

# API
API_V1_PREFIX=/api/v1
```

---

## 🧪 Development

### Running Tests

```bash
# Run pytest
pytest

# Test smart endpoints (requires running server)
python test_smart_endpoints.py
```

### Local Development

```bash
# Install in development mode
pip install -e .

# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Testing Smart Matching Endpoints

The project includes a comprehensive test script (`test_smart_endpoints.py`) that demonstrates:

1. **Ingesting test data** (candidate + position)
2. **Skill gap analysis** with detailed output
3. **Health check** to verify service status

**Run the test:**
```bash
# Start the server first
uvicorn app.main:app --reload

# In another terminal, run the test
python test_smart_endpoints.py
```

**Expected output:**
```
============================================================
Smart Matching Endpoints Test
============================================================

4. Testing health check...
Status: 200
Response: {
  "status": "healthy",
  "features": {
    "vectorization": "sentence-transformers (all-MiniLM-L6-v2)",
    "candidates_loaded": 1,
    "positions_loaded": 1
  }
}

Readiness Score: 85.0/100

Summary:
  - Total skills required: 7
  - Skills met: 5
  - Critical gaps: 1
  - Moderate gaps: 0
  - Minor gaps: 1

Recommendations:
  [HIGH] Focus on developing 1 critical skill(s)
    Skills: Cloud Services (e.g., AWS, GCP, Azure)
```

### Docker Development

```bash
# Build and run
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop services
docker-compose down
```

### Manual API Testing

**1. Health Check:**
```bash
curl http://localhost:8000/api/v1/smart/health
```

**2. Ingest a Candidate:**
```bash
curl -X POST http://localhost:8000/api/v1/smart/candidates/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "candidate_id": "alice-123",
    "hard_skills": [
      {"skill": "Python Programming", "level": 4.5, "id": "hs1"}
    ],
    "soft_skills": [
      {"skill": "Communication", "level": 4.0, "id": "ss1"}
    ],
    "past_positions": []
  }'
```

**3. Analyze Skill Gaps:**
```bash
curl "http://localhost:8000/api/v1/smart/gaps?candidate_id=alice-123&position_id=backend-456"
```

---

## 📝 License

This project is provided as-is for educational and development purposes.

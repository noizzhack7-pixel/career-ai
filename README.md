# Career AI

## 🧠 Overview

**Career-AI** is an intelligent backend service for managing and analyzing **positions**, **candidates**, and **skills**.

It provides:

- Ingestion and structuring of positions, candidates, and skills  
- Vectorization (embeddings) of entities  
- Smart matching between candidates and positions  
- Similarity search (similar candidates / similar positions)  
- Gap analysis between required and existing skills  

This service is designed to be the “AI brain” behind HR platforms, talent marketplaces, and internal mobility systems.

---

## ✨ Features

- 🔄 **CRUD APIs** for skills, positions, and candidates  
- 🧮 **Vectorization engine** for embeddings-based similarity search  
- 🎯 **Smart matching APIs**:
  - Top candidates for a position
  - Top positions for a candidate
  - Similar candidates / positions
  - Skill gaps between candidate and job
- 🧱 **Extensible architecture**, suitable for plugging into existing HRIS / ATS systems

---

## 📌 API Endpoints

> All endpoints return the requested object(s) on success, or an `Error` object on failure.

### `/skills`

| Method | Route         | Body           | Returns        |
|--------|---------------|----------------|----------------|
| POST   | `/skills/add`        | `List[Skill]`    | `List[Skill]`  |
| PUT    | `/skills/update`     | `List[Skill]`    | `List[Skill]`  |
| GET    | `/skills/get_all`    | —                | `List[Skill]`  |
| DELETE | `/skills/delete`     | `List[Skill]`    | `List[Skill]`  |
| DELETE | `/skills/delete_all` | —                | `bool`         |

---

### `/positions`

| Method | Route             | Body              | Returns           |
|--------|-------------------|-------------------|-------------------|
| POST   | `/positions/add`        | `List[Position]`   | `List[Position]` |
| PUT    | `/positions/update`     | `List[Position]`   | `List[Position]` |
| GET    | `/positions/get_all`    | —                 | `List[Position]` |
| DELETE | `/positions/delete`     | `List[Position]`   | `List[Position]` |
| DELETE | `/positions/delete_all` | —                 | `bool`           |

---

### `/candidates`

| Method | Route              | Body                 | Returns              |
|--------|--------------------|----------------------|----------------------|
| POST   | `/candidates/add`        | `List[Candidate]`    | `List[Candidate]`    |
| PUT    | `/candidates/update`     | `List[Candidate]`    | `List[Candidate]`    |
| GET    | `/candidates/get_all`    | —                    | `List[Candidate]`    |
| DELETE | `/candidates/delete`     | `List[Candidate]`    | `List[Candidate]`    |
| DELETE | `/candidates/delete_all` | —                    | `bool`               |

---

### `/smart` (AI-Powered)

These endpoints expose the main intelligence layer of the system.

> Exact request/response schemas depend on your implementation and can be documented in OpenAPI/Swagger.

| Method | Route                         | Description |
|--------|-------------------------------|-------------|
| GET    | `/smart/get_top_candidates`      | Get top-matching candidates for a given position |
| GET    | `/smart/get_simillar_candidates` | Get candidates similar to a given candidate |
| GET    | `/smart/get_top_positions`       | Get top-matching positions for a given candidate |
| GET    | `/smart/get_simillar_positions`  | Get positions similar to a given position |
| GET    | `/smart/get_gaps`                | Get missing skills / gaps between a candidate and a position |

---   

## 🏗️ Architecture

At a high level, Career-AI sits between your **client applications** (HR portals, employee portals, ATS, etc.) and your **data layer** (databases + vector store).

```mermaid
flowchart LR
  subgraph Clients[Client Applications]
    HR[HR System / Admin UI]
    EMP[Employee Portal / Career App]
  end

  subgraph CareerAI[Career-AI Service]
    API[REST API Layer<br/>(/skills, /positions, /candidates, /smart)]
    INGEST[Ingestion & Validation<br/>(schema, cleaning, normalization)]
    VEC[Vectorization Engine<br/>(embeddings)]
    MATCH[Matching & Gap Engine<br/>(similarity, ranking)]
  end

  subgraph DataLayer[Data Layer]
    DB[(Operational DB<br/>skills / candidates / positions)]
    VS[(Vector Store<br/>embeddings)]
  end

  HR --> API
  EMP --> API

  API --> INGEST
  INGEST --> DB

  API --> MATCH
  MATCH --> DB
  MATCH --> VEC
  VEC --> VS
  VS --> MATCH

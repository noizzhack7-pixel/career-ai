# Career AI

## 🧠 Overview

**Career-AI** is an intelligent backend service for managing and analyzing **positions**, **candidates**, and **skills**.

It provides:

- Ingestion and structuring of positions, candidates, and skills  
- Vectorization (embeddings)  
- Smart matching between candidates and positions  
- Similarity search (similar candidates / similar positions)  
- Gap analysis between required and existing skills  

This service acts as the “AI brain” behind HR platforms and internal mobility systems.

---

## 📌 API Endpoints

> All endpoints return the requested objects on success, or an `Error` object on failure.

### `/skills`

| Method | Route                | Body            | Returns       |
|--------|----------------------|-----------------|---------------|
| POST   | `/skills/add`        | `List[Skill]`    | `List[Skill]` |
| PUT    | `/skills/update`     | `List[Skill]`    | `List[Skill]` |
| GET    | `/skills/get_all`    | —               | `List[Skill]` |
| DELETE | `/skills/delete`     | `List[Skill]`    | `List[Skill]` |
| DELETE | `/skills/delete_all` | —               | `bool`        |

---

### `/positions`

| Method | Route                   | Body               | Returns          |
|--------|-------------------------|--------------------|------------------|
| POST   | `/positions/add`        | `List[Position]`   | `List[Position]` |
| PUT    | `/positions/update`     | `List[Position]`   | `List[Position]` |
| GET    | `/positions/get_all`    | —                 | `List[Position]` |
| DELETE | `/positions/delete`     | `List[Position]`   | `List[Position]` |
| DELETE | `/positions/delete_all` | —                 | `bool`           |

---

### `/candidates`

| Method | Route                    | Body                 | Returns            |
|--------|---------------------------|----------------------|--------------------|
| POST   | `/candidates/add`         | `List[Candidate]`    | `List[Candidate]`  |
| PUT    | `/candidates/update`      | `List[Candidate]`    | `List[Candidate]`  |
| GET    | `/candidates/get_all`     | —                    | `List[Candidate]`  |
| DELETE | `/candidates/delete`      | `List[Candidate]`    | `List[Candidate]`  |
| DELETE | `/candidates/delete_all`  | —                    | `bool`             |

---

### `/smart` (AI-Powered)

| Method | Route                         | Description |
|--------|-------------------------------|-------------|
| GET    | `/smart/get_top_candidates`      | Top-matching candidates for a position |
| GET    | `/smart/get_simillar_candidates` | Similar candidates to a given candidate |
| GET    | `/smart/get_top_positions`       | Top-matching positions for a candidate |
| GET    | `/smart/get_simillar_positions`  | Similar positions to a given position |
| GET    | `/smart/get_gaps`                | Skill gaps between a candidate and a position |

---

## 🏗️ Architecture

### High-Level System Diagram (GitHub-compatible)

```mermaid
flowchart LR

    subgraph Clients["Client Applications"]
        HR["HR Admin UI"]
        EMP["Employee Portal"]
    end

    subgraph CareerAI["Career-AI Service"]
        API["REST API Layer (/skills, /positions, /candidates, /smart)"]
        INGEST["Ingestion & Validation"]
        VEC["Vectorization Engine"]
        MATCH["Matching & Gap Engine"]
    end

    subgraph DataLayer["Data Layer"]
        DB["Operational Database"]
        VS["Vector Store (Embeddings)"]
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

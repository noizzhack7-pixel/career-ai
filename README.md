# Career AI

## 🧠 Overview

**Career-AI** is an intelligent backend service for managing and analyzing **positions**, **candidates**, and **skills**.

It provides:

- Ingestion and structuring of positions, candidates, and skills  
- Vectorization (embeddings)  
- Smart matching between candidates and positions  
- Skill gap analysis  

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
| GET    | `/positions/get_all`    | —                  | `List[Position]` |
| DELETE | `/positions/delete`     | `List[Position]`   | `List[Position]` |
| DELETE | `/positions/delete_all` | —                  | `bool`           |

---

### `/candidates`

| Method | Route                    | Body                 | Returns            |
|--------|--------------------------|----------------------|--------------------|
| POST   | `/candidates/add`        | `List[Candidate]`    | `List[Candidate]`  |
| PUT    | `/candidates/update`     | `List[Candidate]`    | `List[Candidate]`  |
| GET    | `/candidates/get_all`    | —                    | `List[Candidate]`  |
| DELETE | `/candidates/delete`     | `List[Candidate]`    | `List[Candidate]`  |
| DELETE | `/candidates/delete_all` | —                    | `bool`             |

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

This diagram includes the required components:

1. Ingestion  
2. Vectorization  
3. Vector Store  
4. HR UI  
5. Employee UI  
6. REST API Layer  

Flow rules:

- **Employee data:** UI → API → Ingestion → Vectorization → Vector Store  
- **Positions data:** UI → API → Ingestion → Vector Store (no vectorization)  
- **Smart endpoints:** API → Vector Store for similarity search  

### High-Level System Diagram

```mermaid
flowchart LR

    HR["HR UI"]
    EMP["Employee UI"]
    API["REST API Layer"]
    ING["Ingestion"]
    VEC["Vectorization"]
    VS["Vector Store"]
 
    HR --> API
    EMP --> API

    API --> ING
    API --> VS

    ING -->|Employee data| VEC
    VEC --> VS

    ING -->|Positions data| VS

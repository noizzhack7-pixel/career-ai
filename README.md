# Career AI

## 🧠 Overview

**Career-AI** is an intelligent backend service for managing and analyzing **positions**, **candidates**, and **skills**.

It provides:

- Ingestion and structuring of positions, candidates, and skills  
- Vectorization (embeddings)  
- Smart matching between candidates and positions  
- Similarity search  
- Skill gap analysis  

---

## 📌 API Endpoints

(Sections unchanged—truncated for brevity.)

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

### High-Level System Diagram (GitHub-compatible)

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

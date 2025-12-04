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

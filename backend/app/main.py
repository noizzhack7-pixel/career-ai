import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.v1.routers import skills, positions, smart, assessment, employees

app = FastAPI(
    title="Career AI API",
    description="Intelligent backend service for managing positions, candidates, and skills",
    version="1.0.0"
)

# CORS middleware - allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(skills.router, prefix="/api/v1")
app.include_router(positions.router, prefix="/api/v1")
app.include_router(smart.router, prefix="/api/v1")
app.include_router(assessment.router, prefix="/api/v1")
app.include_router(employees.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Career AI API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


uvicorn.run(app, host="0.0.0.0", port=5000)
from fastapi import FastAPI
from app.api.v1.routers import skills, positions, candidates, smart

app = FastAPI(
    title="Career AI API",
    description="Intelligent backend service for managing positions, candidates, and skills",
    version="1.0.0"
)

# Include routers
app.include_router(skills.router, prefix="/api/v1")
app.include_router(positions.router, prefix="/api/v1")
app.include_router(candidates.router, prefix="/api/v1")
app.include_router(smart.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Career AI API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

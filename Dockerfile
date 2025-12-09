FROM python:3.13-slim-bookworm

# Install minimal build tools (needed for some wheels) and clean up apt lists
RUN apt-get update && apt-get install --no-install-recommends -y \
        build-essential \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install uv from PyPI (avoids external install script failures)
RUN pip install --no-cache-dir uv

# Copy project manifest first to leverage Docker layer caching
COPY pyproject.toml ./

# Install dependencies and create the virtual environment using uv
# Note: We intentionally avoid using a broken uv.lock. Once a valid lock is generated,
# you can add `COPY uv.lock ./` and switch back to `uv sync --frozen` for deterministic builds.
RUN uv sync

# Copy the rest of the project
COPY . .

# Ensure the virtualenv bin is first on PATH
ENV PATH="/app/.venv/bin:${PATH}"

# Expose the specified port for FastAPI (default 80 in container)
EXPOSE 80

# Run the FastAPI app located under back/app from the repo root
CMD ["uvicorn", "app.main:app", "--app-dir", "back", "--host", "0.0.0.0", "--port", "80"]
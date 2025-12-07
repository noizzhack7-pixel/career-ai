FROM python:3.13-slim-bookworm

RUN apt-get update && apt-get install --no-install-recommends -y \
        build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ADD https://astral.sh/uv/install.sh /install.sh
RUN chmod -R 755 /install.sh && /install.sh && rm /install.sh

# Set up the UV environment path correctly
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app

COPY . .

RUN uv sync

# Ensure the virtualenv bin is first on PATH
ENV PATH="/app/.venv/bin:${PATH}"

# Expose the specified port for FastAPI (default 80 in container)
EXPOSE 80

# Run the FastAPI app located under back/app from the repo root
CMD ["uvicorn", "app.main:app", "--app-dir", "back", "--host", "0.0.0.0", "--port", "80"]
# Nexus — Static Node.js App for Docker

A production-ready static file server built with **Node.js + Express**, containerised with a multi-stage **Dockerfile**, and orchestrated with **docker-compose**.

---

## Project Structure

```
nexus-app/
├── src/
│   └── server.js          # Express server
├── public/
│   ├── index.html         # Main page
│   ├── css/style.css
│   └── js/app.js
├── Dockerfile             # Multi-stage build
├── docker-compose.yml
├── .dockerignore
├── .env.example
└── package.json
```

---

## Quick Start

### Option A — Docker Compose (recommended)

```bash
# 1. Clone / download the project
cd nexus-app

# 2. (Optional) configure environment
cp .env.example .env

# 3. Build & start
docker compose up -d

# 4. Open in browser
open http://localhost:3000
```

### Option B — Plain Docker

```bash
# Build image
docker build -t nexus-app .

# Run container
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --name nexus-app \
  --restart unless-stopped \
  nexus-app
```

---

## Endpoints

| Method | Path        | Description                         |
|--------|-------------|-------------------------------------|
| GET    | `/`         | Main page (serves `public/`)        |
| GET    | `/health`   | Health check — JSON status + uptime |
| GET    | `/api/info` | Server info, Node version, memory   |
| GET    | `*`         | SPA fallback → `index.html`         |

---

## Environment Variables

| Variable    | Default        | Description              |
|-------------|----------------|--------------------------|
| `PORT`      | `3000`         | Port the server listens on |
| `NODE_ENV`  | `development`  | `production` or `development` |
| `HOST_PORT` | `3000`         | Host port (docker-compose only) |

---

## Useful Docker Commands

```bash
# View logs
docker logs -f nexus-app

# Check health status
docker inspect --format='{{.State.Health.Status}}' nexus-app

# Stop & remove
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Shell into container
docker exec -it nexus-app sh
```

---

## Image Size

The multi-stage build produces a minimal Alpine-based image (~130 MB) by:
- Installing only production dependencies (`npm ci --omit=dev`)
- Using `node:20-alpine` as the runtime base
- Running as a non-root user for security

# ─────────────────────────────────────────────────────────────────────────────
#  Stage 1 — deps
#  Install only production dependencies in an isolated layer.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only manifest files first (maximises layer caching)
COPY package*.json ./

# Install production deps only
RUN npm ci --omit=dev


# ─────────────────────────────────────────────────────────────────────────────
#  Stage 2 — runtime
#  Lean final image: copy app code + pre-built node_modules from stage 1.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src/    ./src/
COPY public/ ./public/
COPY package.json ./

# Own everything as our non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Runtime configuration
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Docker-native health check — hits our /health endpoint every 30 s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]

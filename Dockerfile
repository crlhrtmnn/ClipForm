# Build stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage
FROM nginx:stable-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx config with health check
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Run as non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

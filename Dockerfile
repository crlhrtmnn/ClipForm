# Build stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Run as non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ===================================================
# Chemify — Production Multi-Stage Dockerfile
# Stage 1: Build production React + TypeScript bundle
# Stage 2: High-performance Nginx web server
# ===================================================

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy project source files
COPY tsconfig.json vite.config.ts index.html ./
COPY public ./public
COPY assets ./assets
COPY src ./src

# Build production assets
RUN npm run build

# Stage 2: Runtime Web Server
FROM nginx:alpine AS runner

# Remove default nginx site
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom production nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/chemify.conf

# Copy built distribution from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose production ports (4326 and 5467 requested, plus standard 80)
EXPOSE 80 4326 5467

# Healthcheck monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O - http://127.0.0.1:4326/healthz || wget -q -O - http://127.0.0.1:5467/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]


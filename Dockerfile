# Stage 1: Build with Bun
FROM oven/bun:1.1.13 AS builder

WORKDIR /app

COPY . .

# Install dependencies and build the app
RUN bun install --frozen-lockfile
RUN bun run build

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

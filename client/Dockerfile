# -------- Builder --------
FROM node:25-bookworm AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

# Build the app for production
RUN pnpm run build

# -------- Runner --------
FROM nginx:alpine AS runner

# Copy the build output to Nginx's html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: copy custom Nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 5173
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

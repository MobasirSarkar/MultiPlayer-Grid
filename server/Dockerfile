# -------- Builder --------
FROM node:25-bookworm AS builder

# Enable pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy lockfile and package manifest first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the source
COPY . .

# Generate Prisma client
RUN pnpm dlx prisma generate

# Build the app (TypeScript -> JS)
RUN pnpm run build



# -------- Runner --------
FROM node:25-bookworm AS runner

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only what's needed for production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Generate Prisma client (needed in runtime)
RUN pnpm dlx prisma generate

# Expose the app port
EXPOSE ${PORT}

# Run migrations at container startup (non-interactive)
CMD pnpm dlx prisma migrate deploy && node dist/index.js

# TSL-UI Dockerfile
# Platform: linux/amd64 (required for TSL compiler x86_64 binary)

# Stage 1: Install dependencies
FROM --platform=linux/amd64 node:20-slim AS deps

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Build application
FROM --platform=linux/amd64 node:20-slim AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application (creates .next/standalone)
RUN pnpm build

# Stage 3: Production runtime
FROM --platform=linux/amd64 node:20-slim AS runner

WORKDIR /app

# Install wget and ca-certificates for downloading TSL compiler, then clean up
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Download and install TSL Compiler v1.0.7 (Ubuntu binary)
RUN wget -q https://github.com/divark/TSLCompiler/releases/download/v1.0.7/tslcompiler-ubuntu-22.04.tar.gz && \
    tar -xzf tslcompiler-ubuntu-22.04.tar.gz && \
    mkdir -p /app/bin && \
    mv tslcompiler /app/bin/tslcompiler && \
    chmod +x /app/bin/tslcompiler && \
    rm tslcompiler-ubuntu-22.04.tar.gz

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Next.js standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Ensure /tmp has correct permissions for compiler temporary files
RUN mkdir -p /tmp && chmod 1777 /tmp

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]

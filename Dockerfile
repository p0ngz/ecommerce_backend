FROM node:20-alpine

# Prisma requires OpenSSL on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and prisma schema first (for layer caching)
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (dev included — needed for tsc and ts-node)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --omit=dev

EXPOSE 3000

# Copy and set entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

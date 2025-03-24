# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY packages/api/package.json ./packages/api/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN cd packages/api && yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json yarn.lock ./
COPY packages/api/package.json ./packages/api/
RUN yarn install --frozen-lockfile --production

# Copy built application
COPY --from=builder /app/packages/api/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"] 
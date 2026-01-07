# server/Dockerfile

FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

# Development target (hot reload with ts-node-dev)
FROM base AS dev
ENV NODE_ENV=development
RUN npm install --only=development || true
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Build target
FROM base AS builder
RUN npm run build

# Production target
FROM node:20-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]

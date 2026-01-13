# client/Dockerfile

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
# Cambiamos ci por install para saltar la restricción del lockfile
RUN npm install
COPY . .

# Development target (Vite)
FROM base AS dev
ENV NODE_ENV=development
ENV HOST=0.0.0.0
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Build target
FROM base AS builder
RUN npm run build

# Production: serve static files with nginx
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html

# Configurar redirección de API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
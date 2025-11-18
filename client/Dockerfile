# Etapa 1: Construcción (Build)
FROM node:20 as build

WORKDIR /app

# ---- ¡ESTAS LÍNEAS SON LA SOLUCIÓN! ----
# 1. Declara los argumentos que vienen de docker-compose.yml
ARG API_HOST
ARG API_BASE
ARG API_PORT

# 2. Conviértelos a variables de entorno que VITE pueda leer
ENV VITE_API_HOST=$API_HOST
ENV VITE_API_BASE=$API_BASE
ENV VITE_API_PORT=$API_PORT
# ---------------------------------------------

COPY package*.json ./
RUN npm install
COPY . .

# 3. Vite ahora usará las variables VITE_* correctas durante el build
RUN npm run build

# Etapa 2: Servidor (Serve)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
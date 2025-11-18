# Etapa 1: Construcción
FROM node:20 as build
WORKDIR /app

# Recibimos argumentos de docker-compose
ARG API_HOST
ARG API_BASE
ARG API_PORT

# Convertimos a variables de entorno para VITE
ENV VITE_API_HOST=$API_HOST
ENV VITE_API_BASE=$API_BASE
ENV VITE_API_PORT=$API_PORT

COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
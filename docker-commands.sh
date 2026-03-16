#!/bin/bash
# Comandos Docker para AdoptMe
# Este archivo es solo para referencia, no es ejecutable directamente

# ============================================
# BUILD DE LA IMAGEN
# ============================================

# Build local
docker build -t adoptme .

# Build con tag de versión
docker build -t adoptme:1.0.0 .

# ============================================
# EJECUTAR CONTENEDOR
# ============================================

# Ejecutar con MongoDB local
docker run -d \
  --name adoptme-container \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/adoptme \
  adoptme

# Ejecutar con MongoDB Atlas
docker run -d \
  --name adoptme-container \
  -p 8080:8080 \
  -e MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/adoptme" \
  adoptme

# Ejecutar en modo interactivo (para debugging)
docker run -it \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/adoptme \
  adoptme sh

# ============================================
# GESTIÓN DE CONTENEDORES
# ============================================

# Ver logs
docker logs adoptme-container

# Ver logs en tiempo real
docker logs -f adoptme-container

# Detener contenedor
docker stop adoptme-container

# Iniciar contenedor detenido
docker start adoptme-container

# Eliminar contenedor
docker rm adoptme-container

# Eliminar contenedor forzado (si está corriendo)
docker rm -f adoptme-container

# ============================================
# DOCKERHUB
# ============================================

# Login a DockerHub
docker login

# Tag para DockerHub (REEMPLAZAR <TU_USUARIO>)
docker tag adoptme <TU_USUARIO>/adoptme:latest
docker tag adoptme <TU_USUARIO>/adoptme:1.0.0

# Push a DockerHub
docker push <TU_USUARIO>/adoptme:latest
docker push <TU_USUARIO>/adoptme:1.0.0

# Pull desde DockerHub
docker pull <TU_USUARIO>/adoptme:latest

# ============================================
# LIMPIEZA
# ============================================

# Eliminar imagen local
docker rmi adoptme

# Eliminar imágenes sin usar
docker image prune

# Eliminar todo (contenedores, imágenes, volúmenes)
docker system prune -a

# ============================================
# DEBUGGING
# ============================================

# Ver imágenes
docker images

# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluidos detenidos)
docker ps -a

# Inspeccionar contenedor
docker inspect adoptme-container

# Ver uso de recursos
docker stats adoptme-container

# Ejecutar comando dentro del contenedor
docker exec -it adoptme-container sh

# ============================================
# HEALTH CHECK
# ============================================

# Verificar que el servidor responde
curl http://localhost:8080/health

# Ver logs de arranque
docker logs adoptme-container | grep "Server listening"

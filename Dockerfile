# Usar Node.js 18 Alpine
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (solo producción)
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 8080

# Variables de entorno por default
ENV PORT=8080
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"]
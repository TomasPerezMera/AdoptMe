# AdoptMe - Pet Adoption Platform

Backend API para sistema de adopción de mascotas desarrollado como Proyecto Final de Backend 3.

## Descripción

AdoptMe es una aplicación backend que permite:

- Registro y autenticación de usuarios.
- Gestión de mascotas disponibles para adopción.
- Sistema de adopciones.
- Generación de datos mock para testing.

## Tecnologías

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de Datos:** MongoDB
- **Testing:** Mocha, Chai, Supertest
- **Containerización:** Docker
- **Mocking:** Faker.js

## Instalación Local

1. Clonar el repositorio;
2. Instalar dependencias con "npm install";
3. Configurar variables de entorno;
4. Iniciar MongoDB localmente o configurar URI de MongoDB Atlas;
5. Ejecutar la aplicación con "npm start".

### Imagen de Docker

La imagen está disponible en DockerHub:

docker pull <TU_USUARIO_DOCKERHUB>/adoptme:latest

### Build de la imagen

```bash
docker build -t adoptme .

docker tag adoptme <TU_USUARIO_DOCKERHUB>/adoptme:latest

docker push <TU_USUARIO_DOCKERHUB>/adoptme:latest
```

## API Endpoints

### Sessions

- `POST /api/sessions/register` - Registrar usuario.
- `POST /api/sessions/login` - Login.
- `GET /api/sessions/current` - Usuario actual.

### Users

- `GET /api/users` - Listar usuarios.
- `GET /api/users/:uid` - Obtener usuario.
- `PUT /api/users/:uid` - Actualizar usuario.
- `DELETE /api/users/:uid` - Eliminar usuario.

### Pets

- `GET /api/pets` - Listar mascotas.
- `POST /api/pets` - Crear mascota.
- `PUT /api/pets/:pid` - Actualizar mascota.
- `DELETE /api/pets/:pid` - Eliminar mascota.

### Adoptions

- `GET /api/adoptions` - Listar adopciones.
- `GET /api/adoptions/:aid` - Obtener adopción.
- `POST /api/adoptions/:uid/:pid` - Crear adopción.

### Mocks

- `GET /api/mocks/mockingpets` - Generar 100 mascotas mock.
- `GET /api/mocks/mockingusers` - Generar 50 usuarios mock.
- `POST /api/mocks/generateData` - Insertar datos mock en BD.
  ```json
  {
    "users": 10,
    "pets": 20
  }
  ```

### Health Check

- `GET /health` - Estado del servidor.

## Testing

Ejecutar tests:

```bash
npm test
```

Los tests cubren:

- Router de Adoptions (todos los endpoints)
- Casos de éxito y error
- Validaciones de negocio

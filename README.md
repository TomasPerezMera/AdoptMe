# AdoptMe - Pet Adoption Platform

Backend API para sistema de adopción de mascotas desarrollado como Proyecto Final de Backend 3.

## Descripción

AdoptMe es una aplicación backend que permite:

- Registro y autenticación de usuarios.
- Gestión de mascotas disponibles para adopción.
- Sistema de adopciones.
- Generación de datos mock para testing.

** NOTA: Al Dockerizar el proyecto, el análisis de seguridad de Docker Hub reporta vulnerabilidades en dependencias npm como multer y tar. Estas pertenecen a librerías de terceros, y no afectan directamente la lógica del proyecto en su contexto actual. Por lo tanto, opté por no actualizar debido a cambios incompatibles en las nuevas versiones de las librerías, priorizando la estabilidad del proyecto académico. **

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

docker pull tomasperezmera/adoptme:latest

Link: https://hub.docker.com/repository/docker/tomasperezmera/adoptme/

### Build de la imagen

```bash
docker build -t adoptme .

docker tag adoptme <USUARIO_DOCKERHUB>/adoptme:latest

docker push <USUARIO_DOCKERHUB>/adoptme:latest
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

### Ejecutar Tests

**Prerequisito:** El servidor debe estar corriendo.

```bash
Terminal 1: Iniciar servidor

npm run dev

Terminal 2: Ejecutar tests

npm test
```

Los tests cubren todos los endpoints del router de adoptions (11 tests).

## Screenshots - Tests Exitosos

### Adoption Tests pasando con éxito:

![npm tests exitosos](/src/public/adoptme-tests/passing-tests.jpg)

### Endpoints Testados con Postman:

![health-check](/src/public/adoptme-tests/1-health-check.jpg)
![mocking-pets](/src/public/adoptme-tests/2-mocking-pets.jpg)
![mocking-users](/src/public/adoptme-tests/3-mocking-users.jpg)
![generate-data](/src/public/adoptme-tests/4-generate-data.jpg)
![verify-data-users](/src/public/adoptme-tests/5-verify-data-users.jpg)
![verify-data-pets](/src/public/adoptme-tests/6-verify-data-pets.jpg)
![logger-test](/src/public/adoptme-tests/7-logger-test.jpg)

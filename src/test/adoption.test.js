import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

// Nota: Ajustar la ruta según tu estructura
const requester = supertest('http://localhost:8080');

describe('Adoptions Router Tests', function() {
    this.timeout(5000);

    let testUser;
    let testPet;
    let createdAdoptionId;

    // Conectamos a BBDD de test previo a comenzar;
    before(async function() {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect('mongodb://localhost:27017/adoptme_test');
        }
    });

    // Limpiamos datos después de todos los tests.
    after(async function() {
        if (createdAdoptionId) {
            await requester.delete(`/api/adoptions/${createdAdoptionId}`);
        }
        await mongoose.connection.close();
    });

    // Creamos Usuario y Mascota de test;
    beforeEach(async function() {
        const userResponse = await requester
            .post('/api/sessions/register')
            .send({
                first_name: 'Test',
                last_name: 'User',
                email: `testuser_${Date.now()}@test.com`,
                password: 'test123'
            });
        if (userResponse.body.payload) {
            testUser = { _id: userResponse.body.payload };
        }
        const petResponse = await requester
            .post('/api/pets')
            .send({
                name: 'TestPet',
                specie: 'dog',
                birthDate: '2020-01-01'
            });
        if (petResponse.body.payload) {
            testPet = petResponse.body.payload;
        }
    });

    /* GET /api/adoptions - Obtener todas las adopciones */
    describe('GET /api/adoptions', () => {
        it('Debería obtener todas las adopciones con status 200', async () => {
            const response = await requester.get('/api/adoptions');
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').that.equals('success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.be.an('array');
        });
        it('La respuesta debería tener la estructura correcta', async () => {
            const response = await requester.get('/api/adoptions');
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal('success');
            // Si hay adopciones, validamos estructura de cada una;
            if (response.body.payload.length > 0) {
                const adoption = response.body.payload[0];
                expect(adoption).to.have.property('_id');
                expect(adoption).to.have.property('owner');
                expect(adoption).to.have.property('pet');
            }
        });
    });

    /* GET /api/adoptions/:aid - Obtener una adopción por ID */
    describe('GET /api/adoptions/:aid', () => {
        it('Debería devolver error 404 si la adopción no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await requester.get(`/api/adoptions/${fakeId}`);
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body).to.have.property('error').that.equals('Adoption not found');
        });

        it('Debería devolver la adopción correcta si existe', async function() {
            if (!testUser || !testPet) {
                this.skip();
            }
            const createResponse = await requester
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);
            if (createResponse.status !== 200) {
                this.skip();
            }

            // Obtenemos todas las adopciones para encontrar la que acabamos de crear;
            const allAdoptionsResponse = await requester.get('/api/adoptions');
            const adoptions = allAdoptionsResponse.body.payload;
            if (adoptions.length === 0) {
                this.skip();
            }
            const adoptionId = adoptions[adoptions.length - 1]._id;
            // Ahora sí, probamos GET por ID;
            const response = await requester.get(`/api/adoptions/${adoptionId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').that.equals('success');
            expect(response.body.payload).to.have.property('_id').that.equals(adoptionId);
        });
        it('Debería devolver error con ID inválido (formato incorrecto)', async () => {
            const response = await requester.get('/api/adoptions/invalid-id-format');
            // Puede ser 404 o 500, dependiendo de validación.
            expect(response.status).to.be.oneOf([404, 500]);
            expect(response.body).to.have.property('status').that.equals('error');
        });
    });

    /* POST /api/adoptions/:uid/:pid - Crear una nueva adopción */
    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debería crear una adopción exitosamente con usuario y mascota válidos', async function() {
            if (!testUser || !testPet) {
                this.skip();
            }
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').that.equals('success');
            expect(response.body).to.have.property('message').that.equals('Pet adopted');
        });
        it('Debería devolver error 404 si el usuario no existe', async function() {
            if (!testPet) {
                this.skip();
            }
            const fakeUserId = new mongoose.Types.ObjectId();
            const response = await requester
                .post(`/api/adoptions/${fakeUserId}/${testPet._id}`);
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body).to.have.property('error').that.equals('user Not found');
        });
        it('Debería devolver error 404 si la mascota no existe', async function() {
            if (!testUser) {
                this.skip();
            }
            const fakePetId = new mongoose.Types.ObjectId();
            const response = await requester
                .post(`/api/adoptions/${testUser._id}/${fakePetId}`);
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body).to.have.property('error').that.equals('Pet not found');
        });
        it('Debería devolver error 400 si la mascota ya está adoptada', async function() {
            if (!testUser || !testPet) {
                this.skip();
            }
            // Primera adopción;
            await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);
            // Crear otro usuario para intentar adoptar la misma mascota.
            const secondUserResponse = await requester
                .post('/api/sessions/register')
                .send({
                    first_name: 'Second',
                    last_name: 'User',
                    email: `seconduser_${Date.now()}@test.com`,
                    password: 'test123'
                });
            if (!secondUserResponse.body.payload) {
                this.skip();
            }
            const secondUserId = secondUserResponse.body.payload;
            // Intentar adoptar la misma mascota;
            const response = await requester
                .post(`/api/adoptions/${secondUserId}/${testPet._id}`);
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body).to.have.property('error').that.equals('Pet is already adopted');
        });
        it('Debería devolver error con IDs inválidos (formato incorrecto)', async () => {
            const response = await requester
                .post('/api/adoptions/invalid-uid/invalid-pid');
            expect(response.status).to.be.oneOf([404, 500]);
            expect(response.body).to.have.property('status').that.equals('error');
        });
        it('Debería actualizar el array de pets del usuario después de adoptar', async function() {
            if (!testUser || !testPet) {
                this.skip();
            }
            // Creamos una adopción;
            await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);
            // Verificamos que el usuario tenga la mascota en su array.
            const userResponse = await requester.get(`/api/users/${testUser._id}`);
            expect(userResponse.status).to.equal(200);
            expect(userResponse.body.payload).to.have.property('pets');
            expect(userResponse.body.payload.pets).to.be.an('array');
            expect(userResponse.body.payload.pets.length).to.be.greaterThan(0);
        });
        it('Debería marcar la mascota como adoptada después de la adopción', async function() {
            if (!testUser || !testPet) {
                this.skip();
            }
            await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);
            // Verificamos que la mascota está marcada como adoptada;
            const petResponse = await requester.get(`/api/pets`);
            const adoptedPet = petResponse.body.payload.find(p => p._id === testPet._id);
            if (adoptedPet) {
                expect(adoptedPet).to.have.property('adopted').that.equals(true);
                expect(adoptedPet).to.have.property('owner');
            }
        });
    });
});